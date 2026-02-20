<script setup lang="ts">
import * as THREE from 'three'

// #region setup
type BossType = 'vscode' | 'chrome' | 'windows' | 'terminal' | 'notion'

interface Props {
  bossType?: BossType
}

const props = withDefaults(defineProps<Props>(), {
  bossType: 'vscode'
})

// Boss visual config
const BOSS_CONFIG: Record<BossType, { color: number, emissive: number, label: string }> = {
  vscode: { color: 0x007acc, emissive: 0x007acc, label: 'VS Code' },
  chrome: { color: 0xfbbc05, emissive: 0xea4335, label: 'Chrome' },
  windows: { color: 0x00adef, emissive: 0x00adef, label: 'Windows' },
  terminal: { color: 0x00ff41, emissive: 0x00ff41, label: 'Terminal' },
  notion: { color: 0xffffff, emissive: 0x888888, label: 'Notion' }
}
// #endregion

// #region composables
const { prefersReducedMotion } = useThree()
// #endregion

// #region state
const canvasRef = ref<HTMLCanvasElement>()
const scene = shallowRef<THREE.Scene>()
const camera = shallowRef<THREE.PerspectiveCamera>()
const renderer = shallowRef<THREE.WebGLRenderer>()

// Boss mesh parts
const bossGroup = shallowRef<THREE.Group>()
const bodyMesh = shallowRef<THREE.Mesh>()
const glowRing = shallowRef<THREE.Mesh>()
const orbitals: THREE.Mesh[] = []

let animFrameId = 0
let time = 0
let isShaking = false
let shakeTime = 0
let damageFlashActive = false
let damageFlashTime = 0
// #endregion

// #region methods
function buildBoss() {
  if (!scene.value) return

  const cfg = BOSS_CONFIG[props.bossType]
  const group = new THREE.Group()

  // Main body — geometry varies by boss type
  let bodyGeo: THREE.BufferGeometry
  if (props.bossType === 'vscode') {
    bodyGeo = new THREE.BoxGeometry(1.8, 1.8, 1.8)
  } else if (props.bossType === 'chrome') {
    bodyGeo = new THREE.SphereGeometry(1.1, 32, 32)
  } else if (props.bossType === 'windows') {
    bodyGeo = new THREE.BoxGeometry(1.6, 1.6, 0.3)
  } else if (props.bossType === 'terminal') {
    bodyGeo = new THREE.BoxGeometry(2.0, 1.4, 0.2)
  } else {
    bodyGeo = new THREE.BoxGeometry(1.6, 1.6, 0.4)
  }

  const bodyMat = new THREE.MeshStandardMaterial({
    color: cfg.color,
    emissive: cfg.emissive,
    emissiveIntensity: 0.3,
    metalness: 0.6,
    roughness: 0.3
  })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  group.add(body)
  bodyMesh.value = body

  // Outer glow ring
  const ringGeo = new THREE.TorusGeometry(1.6, 0.04, 8, 80)
  const ringMat = new THREE.MeshBasicMaterial({
    color: cfg.emissive,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  group.add(ring)
  glowRing.value = ring

  // Second orbital ring (tilted)
  const ring2Geo = new THREE.TorusGeometry(2.0, 0.025, 8, 80)
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: cfg.color,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
  ring2.rotation.x = Math.PI / 3
  group.add(ring2)

  // Orbiting energy orbs (4 small spheres)
  const orbCount = props.bossType === 'chrome' ? 3 : 4
  for (let i = 0; i < orbCount; i++) {
    const orbGeo = new THREE.SphereGeometry(0.12, 8, 8)
    const orbMat = new THREE.MeshBasicMaterial({
      color: cfg.emissive,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    const orb = new THREE.Mesh(orbGeo, orbMat)
    group.add(orb)
    orbitals.push(orb)
  }

  // Ambient + directional light
  scene.value.add(new THREE.AmbientLight(0xffffff, 0.5))
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
  dirLight.position.set(3, 5, 4)
  scene.value.add(dirLight)

  scene.value.add(group)
  bossGroup.value = group
}

function clearBoss() {
  if (!scene.value || !bossGroup.value) return
  bossGroup.value.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose()
      ;(obj.material as THREE.Material).dispose()
    }
  })
  scene.value.remove(bossGroup.value)
  orbitals.length = 0
  bossGroup.value = undefined
  bodyMesh.value = undefined
  glowRing.value = undefined
}

function animateLoop() {
  if (!renderer.value || !scene.value || !camera.value) return

  if (!prefersReducedMotion.value) {
    time += 0.016

    if (bossGroup.value) {
      // Menacing slow rotation
      bossGroup.value.rotation.y = time * 0.5

      // Bobbing float
      bossGroup.value.position.y = Math.sin(time * 1.2) * 0.15

      // Shake on damage
      if (isShaking) {
        shakeTime += 0.016
        bossGroup.value.position.x = Math.sin(shakeTime * 40) * 0.2
        if (shakeTime > 0.3) {
          isShaking = false
          shakeTime = 0
          bossGroup.value.position.x = 0
        }
      }

      // Pulse emissive on damage flash
      if (damageFlashActive) {
        damageFlashTime += 0.016
        const intensity = Math.max(0, 1 - damageFlashTime / 0.3)
        if (bodyMesh.value) {
          const mat = bodyMesh.value.material as THREE.MeshStandardMaterial
          mat.emissiveIntensity = 0.3 + intensity * 2.0
          mat.emissive.set(intensity > 0.1 ? 0xff2200 : BOSS_CONFIG[props.bossType].emissive)
        }
        if (damageFlashTime > 0.3) {
          damageFlashActive = false
          damageFlashTime = 0
          if (bodyMesh.value) {
            const mat = bodyMesh.value.material as THREE.MeshStandardMaterial
            mat.emissiveIntensity = 0.3
            mat.emissive.set(BOSS_CONFIG[props.bossType].emissive)
          }
        }
      }

      // Orbit the energy orbs
      orbitals.forEach((orb, i) => {
        const angle = time * 1.5 + (i / orbitals.length) * Math.PI * 2
        const r = 1.8
        orb.position.set(Math.cos(angle) * r, Math.sin(angle * 0.5) * 0.4, Math.sin(angle) * r)
      })

      // Pulse glow ring opacity
      if (glowRing.value) {
        const mat = glowRing.value.material as THREE.MeshBasicMaterial
        mat.opacity = 0.5 + Math.sin(time * 3) * 0.3
      }
    }
  }

  renderer.value.render(scene.value, camera.value)
  animFrameId = requestAnimationFrame(animateLoop)
}

function initThree() {
  if (!canvasRef.value) return

  scene.value = new THREE.Scene()

  camera.value = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
  camera.value.position.set(0, 1, 6)
  camera.value.lookAt(0, 0, 0)

  renderer.value = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
    premultipliedAlpha: false
  })
  renderer.value.setClearColor(0x000000, 0)
  renderer.value.setPixelRatio(Math.min(globalThis.devicePixelRatio ?? 1, 2))

  buildBoss()
  handleResize()
  animateLoop()
}

function handleResize() {
  if (!canvasRef.value || !camera.value || !renderer.value) return
  const parent = canvasRef.value.parentElement ?? canvasRef.value
  const w = parent.offsetWidth || 400
  const h = parent.offsetHeight || 400
  camera.value.aspect = w / h
  camera.value.updateProjectionMatrix()
  renderer.value.setSize(w, h)
}
// #endregion

// #region expose
function takeDamage() {
  isShaking = true
  shakeTime = 0
  damageFlashActive = true
  damageFlashTime = 0
}

function defeat() {
  clearBoss()
}

defineExpose({ takeDamage, defeat })
// #endregion

// #region lifecycle
watch(() => props.bossType, () => {
  clearBoss()
  buildBoss()
})

onMounted(async () => {
  await nextTick()
  initThree()
  globalThis.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animFrameId)
  globalThis.removeEventListener('resize', handleResize)
  clearBoss()
  renderer.value?.dispose()
})
// #endregion
</script>

<template>
  <canvas
    ref="canvasRef"
    class="boss-avatar"
  />
</template>

<style scoped>
.boss-avatar {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
