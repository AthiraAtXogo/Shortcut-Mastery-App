<script setup lang="ts">
import * as THREE from 'three'

// #region setup
interface Shard {
  mesh: THREE.Mesh
  velocity: THREE.Vector3
  rotationSpeed: THREE.Vector3
  opacity: number
}

interface TriggerOptions {
  x?: number
  y?: number
  streak?: number
  intensity?: number
}

// Streak -> color mapping
const STREAK_COLORS: Array<{ min: number, color: number }> = [
  { min: 21, color: 0xffd700 }, // gold
  { min: 11, color: 0xff69b4 }, // pink
  { min: 6, color: 0xa855f7 }, // purple
  { min: 3, color: 0x7c3aed }, // blue-purple
  { min: 0, color: 0x00d4ff } // electric blue
]
// #endregion

// #region composables
const { prefersReducedMotion } = useThree()
// #endregion

// #region state
const canvasRef = ref<HTMLCanvasElement>()
const scene = shallowRef<THREE.Scene>()
const camera = shallowRef<THREE.PerspectiveCamera>()
const renderer = shallowRef<THREE.WebGLRenderer>()
const shards = shallowRef<Shard[]>([])
const isActive = ref(false)
let animFrameId = 0
// #endregion

// #region methods
function getStreakColor(streak: number): number {
  for (const entry of STREAK_COLORS) {
    if (streak >= entry.min) return entry.color
  }
  return 0x00d4ff
}

function createShardGeometry(): THREE.BufferGeometry {
  if (Math.random() > 0.5) {
    return new THREE.TetrahedronGeometry(0.12 + Math.random() * 0.1)
  }
  const s = 0.08 + Math.random() * 0.12
  return new THREE.BoxGeometry(s, s * 0.4, s * 0.4)
}

function spawnShards(options: TriggerOptions) {
  if (!scene.value) return

  // Dispose old shards
  shards.value.forEach(({ mesh }) => {
    mesh.geometry.dispose()
    ;(mesh.material as THREE.Material).dispose()
    scene.value!.remove(mesh)
  })

  const count = Math.round((options.intensity ?? 1) * 30)
  const color = getStreakColor(options.streak ?? 0)
  const newShards: Shard[] = []

  // Origin in world space from normalised screen coords
  const ox = ((options.x ?? 0.5) - 0.5) * 10
  const oy = ((options.y ?? 0.5) - 0.5) * -6

  for (let i = 0; i < count; i++) {
    const geo = createShardGeometry()
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 1
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(ox, oy, 0)

    // Random burst velocity
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.8
    const speed = 0.04 + Math.random() * 0.08
    const velY = 0.06 + Math.random() * 0.1

    const velocity = new THREE.Vector3(
      Math.cos(angle) * speed,
      velY,
      (Math.random() - 0.5) * 0.04
    )
    const rotationSpeed = new THREE.Vector3(
      (Math.random() - 0.5) * 0.15,
      (Math.random() - 0.5) * 0.15,
      (Math.random() - 0.5) * 0.15
    )

    scene.value.add(mesh)
    newShards.push({ mesh, velocity, rotationSpeed, opacity: 1 })
  }

  shards.value = newShards
  isActive.value = true
}

function animateShards() {
  if (!renderer.value || !scene.value || !camera.value) return

  if (isActive.value) {
    let anyAlive = false
    const dead: THREE.Mesh[] = []

    shards.value.forEach((shard) => {
      if (shard.opacity <= 0) return

      // Physics
      shard.velocity.y -= 0.003 // gravity
      shard.mesh.position.add(shard.velocity)

      // Rotation
      shard.mesh.rotation.x += shard.rotationSpeed.x
      shard.mesh.rotation.y += shard.rotationSpeed.y
      shard.mesh.rotation.z += shard.rotationSpeed.z

      // Fade
      shard.opacity -= 0.018
      const mat = shard.mesh.material as THREE.MeshBasicMaterial
      mat.opacity = Math.max(0, shard.opacity)

      if (shard.opacity > 0) {
        anyAlive = true
      } else {
        dead.push(shard.mesh)
      }
    })

    // Cleanup faded shards
    if (dead.length > 0) {
      dead.forEach((mesh) => {
        mesh.geometry.dispose()
        ;(mesh.material as THREE.Material).dispose()
        scene.value!.remove(mesh)
      })
      shards.value = shards.value.filter(s => s.opacity > 0)
    }

    if (!anyAlive) {
      isActive.value = false
      shards.value = []
    }
  }

  renderer.value.render(scene.value, camera.value)
  animFrameId = requestAnimationFrame(animateShards)
}

function initThree() {
  if (!canvasRef.value) return

  scene.value = new THREE.Scene()

  // Orthographic-style perspective — flat 2D feel
  camera.value = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
  camera.value.position.set(0, 0, 10)
  camera.value.lookAt(0, 0, 0)

  renderer.value = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true
  })
  renderer.value.setClearColor(0x000000, 0)
  renderer.value.setPixelRatio(Math.min(globalThis.devicePixelRatio ?? 1, 2))

  handleResize()
  animateShards()
}

function handleResize() {
  if (!canvasRef.value || !camera.value || !renderer.value) return
  const { offsetWidth: w, offsetHeight: h } = canvasRef.value.parentElement ?? canvasRef.value
  camera.value.aspect = w / h
  camera.value.updateProjectionMatrix()
  renderer.value.setSize(w, h)
}
// #endregion

// #region expose
function trigger(options: TriggerOptions = {}) {
  if (prefersReducedMotion.value) return
  spawnShards(options)
}

defineExpose({ trigger })
// #endregion

// #region lifecycle
onMounted(async () => {
  await nextTick()
  initThree()
  globalThis.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animFrameId)
  globalThis.removeEventListener('resize', handleResize)
  shards.value.forEach(({ mesh }) => {
    mesh.geometry.dispose()
    ;(mesh.material as THREE.Material).dispose()
  })
  renderer.value?.dispose()
})
// #endregion
</script>

<template>
  <canvas
    ref="canvasRef"
    class="explosion-shards"
  />
</template>

<style scoped>
.explosion-shards {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
