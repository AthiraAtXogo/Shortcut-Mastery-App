<script setup lang="ts">
import * as THREE from 'three'

// #region setup
interface Segment {
  line: THREE.Line
  particles: FlowParticle[]
  opacity: number
  from: THREE.Vector3
  to: THREE.Vector3
  length: number
}

interface FlowParticle {
  mesh: THREE.Mesh
  t: number // 0→1 along segment
  speed: number
}

interface AddOptions {
  fromX: number // normalized 0-1 screen coords
  fromY: number
  toX: number
  toY: number
  comboLevel: number
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

const segments: Segment[] = []
let animFrameId = 0
let isFading = false
const MAX_SEGMENTS = 5
// #endregion

// #region methods
function screenToWorld(nx: number, ny: number): THREE.Vector3 {
  // Map normalized 0-1 screen coords to world space at z=0
  // Camera is at z=10, FOV=60, aspect varies
  const aspect = camera.value ? camera.value.aspect : 16 / 9
  const vFov = (60 * Math.PI) / 180
  const height = 2 * Math.tan(vFov / 2) * 10 // world height at z=0
  const width = height * aspect
  return new THREE.Vector3(
    (nx - 0.5) * width,
    (0.5 - ny) * height,
    0
  )
}

function getComboColor(level: number): THREE.Color {
  if (level >= 10) return new THREE.Color(0xffd700) // gold
  if (level >= 5) return new THREE.Color(0xa855f7) // purple
  if (level >= 3) return new THREE.Color(0x00d4ff) // cyan
  return new THREE.Color(0x4488ff) // blue
}

function makeCircleSprite(): THREE.Texture {
  const size = 32
  const cv = document.createElement('canvas')
  cv.width = size
  cv.height = size
  const ctx = cv.getContext('2d')!
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.5, 'rgba(255,255,255,0.6)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(cv)
  tex.needsUpdate = true
  return tex
}

const sharedSprite = shallowRef<THREE.Texture>()

function buildSegment(opts: AddOptions): Segment {
  if (!scene.value) throw new Error('no scene')

  const from = screenToWorld(opts.fromX, opts.fromY)
  const to = screenToWorld(opts.toX, opts.toY)
  const color = getComboColor(opts.comboLevel)
  const intensity = Math.min(1, 0.5 + opts.comboLevel * 0.05)

  // Line geometry
  const points = [from.clone(), to.clone()]
  const geo = new THREE.BufferGeometry().setFromPoints(points)
  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: intensity,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  const line = new THREE.Line(geo, mat)
  scene.value.add(line)

  // Flow particles along the segment
  const sprite = sharedSprite.value!
  const particleCount = 4 + Math.floor(opts.comboLevel / 2)
  const particles: FlowParticle[] = []

  for (let i = 0; i < particleCount; i++) {
    const pGeo = new THREE.PlaneGeometry(0.18, 0.18)
    const pMat = new THREE.MeshBasicMaterial({
      map: sprite,
      color,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    const mesh = new THREE.Mesh(pGeo, pMat)
    const t = i / particleCount
    mesh.position.lerpVectors(from, to, t)
    scene.value.add(mesh)
    particles.push({ mesh, t, speed: 0.006 + Math.random() * 0.004 })
  }

  const length = from.distanceTo(to)
  return { line, particles, opacity: intensity, from, to, length }
}

function disposeSegment(seg: Segment) {
  if (!scene.value) return
  seg.line.geometry.dispose()
  ;(seg.line.material as THREE.Material).dispose()
  scene.value.remove(seg.line)

  seg.particles.forEach((p) => {
    p.mesh.geometry.dispose()
    ;(p.mesh.material as THREE.Material).dispose()
    scene.value!.remove(p.mesh)
  })
}

function animateLoop() {
  if (!renderer.value || !scene.value || !camera.value) return

  // Update flow particles along each segment
  segments.forEach((seg) => {
    seg.particles.forEach((p) => {
      p.t += p.speed
      if (p.t > 1) p.t -= 1
      p.mesh.position.lerpVectors(seg.from, seg.to, p.t)
      const mat = p.mesh.material as THREE.MeshBasicMaterial
      // Pulse brightness
      mat.opacity = seg.opacity * (0.6 + Math.sin(p.t * Math.PI * 4) * 0.4)
    })

    // Update line opacity
    const lineMat = seg.line.material as THREE.LineBasicMaterial
    lineMat.opacity = seg.opacity * 0.7
  })

  // Fade out when breaking
  if (isFading) {
    let allGone = true
    for (let i = segments.length - 1; i >= 0; i--) {
      segments[i].opacity -= 0.03
      if (segments[i].opacity <= 0) {
        disposeSegment(segments[i])
        segments.splice(i, 1)
      } else {
        allGone = false
      }
    }
    if (allGone) isFading = false
  }

  renderer.value.render(scene.value, camera.value)
  animFrameId = requestAnimationFrame(animateLoop)
}

function initThree() {
  if (!canvasRef.value) return

  scene.value = new THREE.Scene()

  camera.value = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
  camera.value.position.set(0, 0, 10)
  camera.value.lookAt(0, 0, 0)

  renderer.value = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: false,
    premultipliedAlpha: false
  })
  renderer.value.setClearColor(0x000000, 0)
  renderer.value.setPixelRatio(Math.min(globalThis.devicePixelRatio ?? 1, 2))

  sharedSprite.value = makeCircleSprite()

  handleResize()
  animateLoop()
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
function addConnection(opts: AddOptions) {
  if (prefersReducedMotion.value || !scene.value) return
  isFading = false

  // Remove oldest if at cap
  if (segments.length >= MAX_SEGMENTS) {
    disposeSegment(segments.shift()!)
  }

  segments.push(buildSegment(opts))
}

function breakCombo() {
  isFading = true
}

defineExpose({ addConnection, breakCombo })
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
  segments.forEach(disposeSegment)
  segments.length = 0
  sharedSprite.value?.dispose()
  renderer.value?.dispose()
})
// #endregion
</script>

<template>
  <canvas
    ref="canvasRef"
    class="combo-chain"
  />
</template>

<style scoped>
.combo-chain {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
