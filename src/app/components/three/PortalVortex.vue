<script setup lang="ts">
import * as THREE from 'three'

// #region composables
const { prefersReducedMotion } = useThree()
// #endregion

// #region state
const canvasRef = ref<HTMLCanvasElement>()
const scene = shallowRef<THREE.Scene>()
const camera = shallowRef<THREE.PerspectiveCamera>()
const renderer = shallowRef<THREE.WebGLRenderer>()
const isActive = ref(false)

// Portal objects
const rings: THREE.Mesh[] = []
const particles = shallowRef<THREE.Points>()
const centerGlowMesh = shallowRef<THREE.Mesh>()
const flashMesh = shallowRef<THREE.Mesh>()

let animFrameId = 0
let portalStart = 0
let dismissScheduled = false
const PORTAL_DURATION = 2500 // ms
// #endregion

// #region methods
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function lerpColor(c1: THREE.Color, c2: THREE.Color, t: number): THREE.Color {
  return new THREE.Color(
    lerp(c1.r, c2.r, t),
    lerp(c1.g, c2.g, t),
    lerp(c1.b, c2.b, t)
  )
}

function makeCircleSprite(): THREE.Texture {
  const size = 64
  const cv = document.createElement('canvas')
  cv.width = size
  cv.height = size
  const ctx = cv.getContext('2d')!
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.4, 'rgba(255,255,255,0.8)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(cv)
  tex.needsUpdate = true
  return tex
}

function buildPortal() {
  if (!scene.value) return

  const colorA = new THREE.Color(0xa855f7) // purple
  const colorB = new THREE.Color(0x00d4ff) // cyan
  const colorC = new THREE.Color(0xffffff) // white center

  // 20 torus rings receding into tunnel — additive blending so they don't block background
  for (let i = 0; i < 20; i++) {
    const t = i / 19
    const ringColor = i < 10
      ? lerpColor(colorA, colorB, i / 10)
      : lerpColor(colorB, colorC, (i - 10) / 10)

    const geo = new THREE.TorusGeometry(1 + i * 0.08, 0.015, 8, 120)
    const mat = new THREE.MeshBasicMaterial({
      color: ringColor,
      transparent: true,
      opacity: 1 - t * 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.z = -i * 0.4
    scene.value.add(mesh)
    rings.push(mesh)
  }

  // Center glow disc — additive so it glows without white fill
  const glowGeo = new THREE.CircleGeometry(1.6, 64)
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x8844ff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  const glow = new THREE.Mesh(glowGeo, glowMat)
  glow.position.z = -0.1
  scene.value.add(glow)
  centerGlowMesh.value = glow

  // Full-screen flash — additive, starts invisible
  const flashGeo = new THREE.PlaneGeometry(30, 30)
  const flashMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  const flash = new THREE.Mesh(flashGeo, flashMat)
  flash.position.z = 1
  scene.value.add(flash)
  flashMesh.value = flash

  // Particles — use circle sprite so they render as dots not squares
  const sprite = makeCircleSprite()
  const count = 250
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 1.8 + Math.random() * 2.5
    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = Math.sin(angle) * radius
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const mat = new THREE.PointsMaterial({
    size: 0.12,
    map: sprite,
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  const pts = new THREE.Points(geo, mat)
  scene.value.add(pts)
  particles.value = pts
}

function clearPortal() {
  if (!scene.value) return
  rings.forEach((r) => {
    r.geometry.dispose()
    ;(r.material as THREE.Material).dispose()
    scene.value!.remove(r)
  })
  rings.length = 0

  if (particles.value) {
    const mat = particles.value.material as THREE.PointsMaterial
    mat.map?.dispose()
    mat.dispose()
    particles.value.geometry.dispose()
    scene.value.remove(particles.value)
    particles.value = undefined
  }
  if (centerGlowMesh.value) {
    centerGlowMesh.value.geometry.dispose()
    ;(centerGlowMesh.value.material as THREE.Material).dispose()
    scene.value.remove(centerGlowMesh.value)
    centerGlowMesh.value = undefined
  }
  if (flashMesh.value) {
    flashMesh.value.geometry.dispose()
    ;(flashMesh.value.material as THREE.Material).dispose()
    scene.value.remove(flashMesh.value)
    flashMesh.value = undefined
  }
}

function animatePortal() {
  if (!renderer.value || !scene.value || !camera.value) return

  const now = Date.now()
  const elapsed = now - portalStart
  const progress = Math.min(elapsed / PORTAL_DURATION, 1)

  if (isActive.value) {
    // Spin each ring faster as progress increases
    rings.forEach((ring, i) => {
      ring.rotation.z += 0.01 + i * 0.0015 + progress * 0.04
    })

    // Pull particles inward
    if (particles.value) {
      const pos = particles.value.geometry.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const y = pos.getY(i)
        const dist = Math.sqrt(x * x + y * y)
        if (dist > 0.05) {
          const pull = 0.012 + progress * 0.018
          pos.setXY(i, x * (1 - pull / dist), y * (1 - pull / dist))
        }
      }
      pos.needsUpdate = true
      particles.value.rotation.z += 0.008
    }

    // Center glow builds up
    if (centerGlowMesh.value) {
      const mat = centerGlowMesh.value.material as THREE.MeshBasicMaterial
      mat.opacity = progress * 0.6
    }

    // Camera zoom into tunnel
    camera.value.position.z = lerp(8, 4.5, progress)

    // Final flash burst in last 15%
    if (flashMesh.value) {
      const mat = flashMesh.value.material as THREE.MeshBasicMaterial
      mat.opacity = progress > 0.85 ? (progress - 0.85) / 0.15 * 0.8 : 0
    }

    if (progress >= 1 && !dismissScheduled) {
      dismissScheduled = true
      setTimeout(() => {
        isActive.value = false
        clearPortal()
        if (camera.value) camera.value.position.z = 8
        dismissScheduled = false
      }, 200)
    }
  }

  renderer.value.render(scene.value, camera.value)
  animFrameId = requestAnimationFrame(animatePortal)
}

function initThree() {
  if (!canvasRef.value) return

  scene.value = new THREE.Scene()

  camera.value = new THREE.PerspectiveCamera(70, 1, 0.1, 100)
  camera.value.position.set(0, 0, 8)
  camera.value.lookAt(0, 0, 0)

  renderer.value = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
    premultipliedAlpha: false
  })
  renderer.value.setClearColor(0x000000, 0)
  renderer.value.setPixelRatio(Math.min(globalThis.devicePixelRatio ?? 1, 2))

  handleResize()
  animatePortal()
}

function handleResize() {
  if (!canvasRef.value || !camera.value || !renderer.value) return
  const parent = canvasRef.value.parentElement ?? canvasRef.value
  const w = parent.offsetWidth || 800
  const h = parent.offsetHeight || 600
  camera.value.aspect = w / h
  camera.value.updateProjectionMatrix()
  renderer.value.setSize(w, h)
}
// #endregion

// #region expose
function trigger() {
  if (prefersReducedMotion.value) return
  clearPortal()
  buildPortal()
  portalStart = Date.now()
  dismissScheduled = false
  isActive.value = true
  if (camera.value) camera.value.position.z = 8
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
  clearPortal()
  renderer.value?.dispose()
})
// #endregion
</script>

<template>
  <canvas
    ref="canvasRef"
    class="portal-vortex"
    :class="{ active: isActive }"
  />
</template>

<style scoped>
.portal-vortex {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.portal-vortex.active {
  opacity: 1;
}
</style>
