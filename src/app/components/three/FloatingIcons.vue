<script setup lang="ts">
import * as THREE from 'three'

// #region setup
interface Category {
  id: string
  name: string
  color: number // hex color for the icon face
}

interface Props {
  categories?: Category[]
}

interface FloatingIcon {
  group: THREE.Group
  angle: number
  bobOffset: number
  baseOpacity: number
  currentOpacity: number
  id: string
  name: string
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [
    { id: 'vscode', name: 'VS Code', color: 0x007acc },
    { id: 'chrome', name: 'Chrome', color: 0xfbbc05 },
    { id: 'windows', name: 'Windows', color: 0x00adef },
    { id: 'terminal', name: 'Terminal', color: 0x00ff41 },
    { id: 'notion', name: 'Notion', color: 0xaaaaaa },
    { id: 'figma', name: 'Figma', color: 0xa259ff }
  ]
})

const emit = defineEmits<{
  select: [id: string]
}>()
// #endregion

// #region composables
const { prefersReducedMotion } = useThree()
// #endregion

// #region state
const canvasRef = ref<HTMLCanvasElement>()
const scene = shallowRef<THREE.Scene>()
const camera = shallowRef<THREE.PerspectiveCamera>()
const renderer = shallowRef<THREE.WebGLRenderer>()

const icons: FloatingIcon[] = []
const ORBIT_RADIUS = 3.5
let animFrameId = 0
let time = 0
let hoveredId: string | null = null
let orbitPaused = false
// #endregion

// #region methods
function makeIconLabel(name: string, color: number): THREE.CanvasTexture {
  const size = 128
  const cv = document.createElement('canvas')
  cv.width = size
  cv.height = size
  const ctx = cv.getContext('2d')!

  // Background circle
  const hex = '#' + color.toString(16).padStart(6, '0')
  ctx.fillStyle = hex
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2)
  ctx.fill()

  // Abbreviation text
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 42px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const abbr = name.slice(0, 2).toUpperCase()
  ctx.fillText(abbr, size / 2, size / 2)

  const tex = new THREE.CanvasTexture(cv)
  tex.needsUpdate = true
  return tex
}

function buildIcons() {
  if (!scene.value) return

  const count = props.categories.length
  props.categories.forEach((cat, i) => {
    const angle = (i / count) * Math.PI * 2

    const group = new THREE.Group()

    // Icon plane
    const tex = makeIconLabel(cat.name, cat.color)
    const geo = new THREE.PlaneGeometry(1.2, 1.2)
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 1,
      depthWrite: false
    })
    const plane = new THREE.Mesh(geo, mat)
    group.add(plane)

    // Glow halo behind
    const haloGeo = new THREE.CircleGeometry(0.72, 32)
    const haloMat = new THREE.MeshBasicMaterial({
      color: cat.color,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    const halo = new THREE.Mesh(haloGeo, haloMat)
    halo.position.z = -0.01
    group.add(halo)

    // Position in orbit
    group.position.set(
      Math.cos(angle) * ORBIT_RADIUS,
      0,
      Math.sin(angle) * ORBIT_RADIUS
    )

    scene.value!.add(group)

    icons.push({
      group,
      angle,
      bobOffset: i * (Math.PI / count),
      baseOpacity: 1,
      currentOpacity: 1,
      id: cat.id,
      name: cat.name
    })
  })
}

function clearIcons() {
  if (!scene.value) return
  icons.forEach(({ group }) => {
    group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        if ((obj.material as THREE.MeshBasicMaterial).map) {
          (obj.material as THREE.MeshBasicMaterial).map!.dispose()
        }
        obj.geometry.dispose()
        ;(obj.material as THREE.Material).dispose()
      }
    })
    scene.value!.remove(group)
  })
  icons.length = 0
}

function animateLoop() {
  if (!renderer.value || !scene.value || !camera.value) return

  if (!prefersReducedMotion.value) {
    time += 0.016

    icons.forEach((icon) => {
      // Orbit rotation
      if (!orbitPaused) {
        icon.angle += 0.003
      }

      // Update position
      icon.group.position.x = Math.cos(icon.angle) * ORBIT_RADIUS
      icon.group.position.z = Math.sin(icon.angle) * ORBIT_RADIUS

      // Gentle bob
      icon.group.position.y = Math.sin(time * 0.8 + icon.bobOffset) * 0.25

      // Billboard — always face camera
      icon.group.lookAt(camera.value!.position)

      // Smooth opacity
      const mat = (icon.group.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial
      icon.currentOpacity += (icon.baseOpacity - icon.currentOpacity) * 0.1
      mat.opacity = icon.currentOpacity

      // Smooth scale toward target
      const targetScale = hoveredId === icon.id ? 1.35 : 1.0
      icon.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12)
    })
  }

  renderer.value.render(scene.value, camera.value)
  animFrameId = requestAnimationFrame(animateLoop)
}

function handlePointerMove(e: PointerEvent) {
  if (!canvasRef.value || !camera.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const nx = (e.clientX - rect.left) / rect.width
  const ny = (e.clientY - rect.top) / rect.height

  // Raycasting
  const raycaster = new THREE.Raycaster()
  const ndc = new THREE.Vector2(nx * 2 - 1, -(ny * 2 - 1))
  raycaster.setFromCamera(ndc, camera.value)

  // Collect all icon planes
  const meshes: THREE.Mesh[] = []
  icons.forEach(({ group }) => {
    group.children.forEach((child) => {
      if (child instanceof THREE.Mesh) meshes.push(child)
    })
  })

  const hits = raycaster.intersectObjects(meshes)
  const prevHovered = hoveredId

  if (hits.length > 0) {
    // Find which icon was hit
    const hitMesh = hits[0]!.object as THREE.Mesh
    const hitIcon = icons.find(({ group }) => group.children.includes(hitMesh))
    hoveredId = hitIcon?.id ?? null
    orbitPaused = true
    canvasRef.value.style.cursor = 'pointer'
  } else {
    hoveredId = null
    orbitPaused = false
    canvasRef.value.style.cursor = 'default'
  }

  // Update opacities
  if (prevHovered !== hoveredId) {
    if (hoveredId) {
      icons.forEach((icon) => {
        icon.baseOpacity = icon.id === hoveredId ? 1.0 : 0.3
      })
    } else {
      icons.forEach((icon) => {
        icon.baseOpacity = 1.0
      })
    }
  }
}

function handleClick(_e: PointerEvent) {
  if (!hoveredId) return
  emit('select', hoveredId)

  // Zoom out clicked icon then remove
  const clicked = icons.find(i => i.id === hoveredId)
  if (clicked) {
    clicked.baseOpacity = 0
  }
}

function initThree() {
  if (!canvasRef.value) return

  scene.value = new THREE.Scene()

  camera.value = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
  camera.value.position.set(0, 3.5, 7)
  camera.value.lookAt(0, 0, 0)

  renderer.value = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
    premultipliedAlpha: false
  })
  renderer.value.setClearColor(0x000000, 0)
  renderer.value.setPixelRatio(Math.min(globalThis.devicePixelRatio ?? 1, 2))

  buildIcons()
  handleResize()
  animateLoop()
}

function handleResize() {
  if (!canvasRef.value || !camera.value || !renderer.value) return
  const parent = canvasRef.value.parentElement ?? canvasRef.value
  const w = parent.offsetWidth || 800
  const h = parent.offsetHeight || 500
  camera.value.aspect = w / h
  camera.value.updateProjectionMatrix()
  renderer.value.setSize(w, h)
}
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
  clearIcons()
  renderer.value?.dispose()
})
// #endregion
</script>

<template>
  <canvas
    ref="canvasRef"
    class="floating-icons"
    @pointermove="handlePointerMove"
    @click="handleClick"
  />
</template>

<style scoped>
.floating-icons {
  width: 100%;
  height: 100%;
  display: block;
  cursor: default;
}
</style>
