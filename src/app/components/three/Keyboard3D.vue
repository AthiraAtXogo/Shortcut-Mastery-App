<script setup lang="ts">
import * as THREE from 'three'

// #region setup
interface KeyData {
  code: string
  label: string
  row: number
  col: number
  width: number
}

interface Props {
  pressedKeys?: string[]
  highlightedKeys?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  pressedKeys: () => [],
  highlightedKeys: () => []
})
// #endregion

// #region composables
const { prefersReducedMotion } = useThree()
// #endregion

// #region state
const canvasRef = ref<HTMLCanvasElement>()
const scene = shallowRef<THREE.Scene>()
const camera = shallowRef<THREE.PerspectiveCamera>()
const renderer = shallowRef<THREE.WebGLRenderer>()
const keyMeshes = shallowRef<Map<string, THREE.Mesh>>(new Map())
const keyboardGroup = shallowRef<THREE.Group>()

const mouseX = ref(0)
const mouseY = ref(0)
let animFrameId = 0
let elapsed = 0
// #endregion

// #region key layout
const KEY_ROWS: KeyData[][] = [
  // Row 0: Esc + F1-F12
  [
    { code: 'Escape', label: 'Esc', row: 0, col: 0, width: 1 },
    { code: 'F1', label: 'F1', row: 0, col: 1.5, width: 1 },
    { code: 'F2', label: 'F2', row: 0, col: 2.6, width: 1 },
    { code: 'F3', label: 'F3', row: 0, col: 3.7, width: 1 },
    { code: 'F4', label: 'F4', row: 0, col: 4.8, width: 1 },
    { code: 'F5', label: 'F5', row: 0, col: 6.1, width: 1 },
    { code: 'F6', label: 'F6', row: 0, col: 7.2, width: 1 },
    { code: 'F7', label: 'F7', row: 0, col: 8.3, width: 1 },
    { code: 'F8', label: 'F8', row: 0, col: 9.4, width: 1 },
    { code: 'F9', label: 'F9', row: 0, col: 10.7, width: 1 },
    { code: 'F10', label: 'F10', row: 0, col: 11.8, width: 1 },
    { code: 'F11', label: 'F11', row: 0, col: 12.9, width: 1 },
    { code: 'F12', label: 'F12', row: 0, col: 14.0, width: 1 },
  ],
  // Row 1: ` 1-0 - = Backspace
  [
    { code: 'Backquote', label: '`', row: 1, col: 0, width: 1 },
    { code: 'Digit1', label: '1', row: 1, col: 1.1, width: 1 },
    { code: 'Digit2', label: '2', row: 1, col: 2.2, width: 1 },
    { code: 'Digit3', label: '3', row: 1, col: 3.3, width: 1 },
    { code: 'Digit4', label: '4', row: 1, col: 4.4, width: 1 },
    { code: 'Digit5', label: '5', row: 1, col: 5.5, width: 1 },
    { code: 'Digit6', label: '6', row: 1, col: 6.6, width: 1 },
    { code: 'Digit7', label: '7', row: 1, col: 7.7, width: 1 },
    { code: 'Digit8', label: '8', row: 1, col: 8.8, width: 1 },
    { code: 'Digit9', label: '9', row: 1, col: 9.9, width: 1 },
    { code: 'Digit0', label: '0', row: 1, col: 11.0, width: 1 },
    { code: 'Minus', label: '-', row: 1, col: 12.1, width: 1 },
    { code: 'Equal', label: '=', row: 1, col: 13.2, width: 1 },
    { code: 'Backspace', label: '⌫', row: 1, col: 14.3, width: 1.7 },
  ],
  // Row 2: Tab Q-P [ ] \
  [
    { code: 'Tab', label: 'Tab', row: 2, col: 0, width: 1.5 },
    { code: 'KeyQ', label: 'Q', row: 2, col: 1.6, width: 1 },
    { code: 'KeyW', label: 'W', row: 2, col: 2.7, width: 1 },
    { code: 'KeyE', label: 'E', row: 2, col: 3.8, width: 1 },
    { code: 'KeyR', label: 'R', row: 2, col: 4.9, width: 1 },
    { code: 'KeyT', label: 'T', row: 2, col: 6.0, width: 1 },
    { code: 'KeyY', label: 'Y', row: 2, col: 7.1, width: 1 },
    { code: 'KeyU', label: 'U', row: 2, col: 8.2, width: 1 },
    { code: 'KeyI', label: 'I', row: 2, col: 9.3, width: 1 },
    { code: 'KeyO', label: 'O', row: 2, col: 10.4, width: 1 },
    { code: 'KeyP', label: 'P', row: 2, col: 11.5, width: 1 },
    { code: 'BracketLeft', label: '[', row: 2, col: 12.6, width: 1 },
    { code: 'BracketRight', label: ']', row: 2, col: 13.7, width: 1 },
    { code: 'Backslash', label: '\\', row: 2, col: 14.8, width: 1.2 },
  ],
  // Row 3: Caps A-L ; ' Enter
  [
    { code: 'CapsLock', label: 'Caps', row: 3, col: 0, width: 1.75 },
    { code: 'KeyA', label: 'A', row: 3, col: 1.85, width: 1 },
    { code: 'KeyS', label: 'S', row: 3, col: 2.95, width: 1 },
    { code: 'KeyD', label: 'D', row: 3, col: 4.05, width: 1 },
    { code: 'KeyF', label: 'F', row: 3, col: 5.15, width: 1 },
    { code: 'KeyG', label: 'G', row: 3, col: 6.25, width: 1 },
    { code: 'KeyH', label: 'H', row: 3, col: 7.35, width: 1 },
    { code: 'KeyJ', label: 'J', row: 3, col: 8.45, width: 1 },
    { code: 'KeyK', label: 'K', row: 3, col: 9.55, width: 1 },
    { code: 'KeyL', label: 'L', row: 3, col: 10.65, width: 1 },
    { code: 'Semicolon', label: ';', row: 3, col: 11.75, width: 1 },
    { code: 'Quote', label: "'", row: 3, col: 12.85, width: 1 },
    { code: 'Enter', label: 'Enter', row: 3, col: 13.95, width: 2.05 },
  ],
  // Row 4: Shift Z-M , . / Shift
  [
    { code: 'ShiftLeft', label: 'Shift', row: 4, col: 0, width: 2.25 },
    { code: 'KeyZ', label: 'Z', row: 4, col: 2.35, width: 1 },
    { code: 'KeyX', label: 'X', row: 4, col: 3.45, width: 1 },
    { code: 'KeyC', label: 'C', row: 4, col: 4.55, width: 1 },
    { code: 'KeyV', label: 'V', row: 4, col: 5.65, width: 1 },
    { code: 'KeyB', label: 'B', row: 4, col: 6.75, width: 1 },
    { code: 'KeyN', label: 'N', row: 4, col: 7.85, width: 1 },
    { code: 'KeyM', label: 'M', row: 4, col: 8.95, width: 1 },
    { code: 'Comma', label: ',', row: 4, col: 10.05, width: 1 },
    { code: 'Period', label: '.', row: 4, col: 11.15, width: 1 },
    { code: 'Slash', label: '/', row: 4, col: 12.25, width: 1 },
    { code: 'ShiftRight', label: 'Shift', row: 4, col: 13.35, width: 2.65 },
  ],
  // Row 5: Ctrl Win Alt Space Alt Ctrl
  [
    { code: 'ControlLeft', label: 'Ctrl', row: 5, col: 0, width: 1.25 },
    { code: 'MetaLeft', label: '⊞', row: 5, col: 1.35, width: 1.25 },
    { code: 'AltLeft', label: 'Alt', row: 5, col: 2.7, width: 1.25 },
    { code: 'Space', label: '', row: 5, col: 4.05, width: 6.25 },
    { code: 'AltRight', label: 'Alt', row: 5, col: 10.4, width: 1.25 },
    { code: 'MetaRight', label: '⊞', row: 5, col: 11.75, width: 1.25 },
    { code: 'ControlRight', label: 'Ctrl', row: 5, col: 13.1, width: 1.25 },
  ],
]

const KEY_UNIT = 1.05   // spacing unit
const KEY_HEIGHT = 0.28  // key top face height
const KEY_DEPTH = 0.95  // key depth (z)
const ROW_SPACING = 1.05
const KEYBOARD_X_OFFSET = -8.5
const KEYBOARD_Y_OFFSET = 2.5
// #endregion

// #region methods
function createKeyTexture(label: string, isActive: boolean): THREE.CanvasTexture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = isActive ? '#00d4ff' : '#ffffff'
  ctx.font = `bold ${label.length > 3 ? 22 : label.length > 2 ? 28 : 36}px monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, size / 2, size / 2)

  return new THREE.CanvasTexture(canvas)
}

function createKeyMesh(key: KeyData, isActive: boolean): THREE.Group {
  const group = new THREE.Group()

  const w = key.width * KEY_UNIT
  const h = KEY_HEIGHT
  const d = KEY_DEPTH

  // Key body
  const bodyGeo = new THREE.BoxGeometry(w - 0.06, h, d - 0.06)
  const bodyMat = new THREE.MeshStandardMaterial({
    color: isActive ? 0x00d4ff : 0x1e1e2e,
    emissive: isActive ? 0x00d4ff : 0x000000,
    emissiveIntensity: isActive ? 0.8 : 0,
    roughness: 0.4,
    metalness: 0.6,
  })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  group.add(body)

  // Key top face with label
  if (key.label) {
    const topGeo = new THREE.PlaneGeometry(w - 0.15, d - 0.15)
    const texture = createKeyTexture(key.label, isActive)
    const topMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: isActive ? 1.0 : 0.85,
      depthWrite: false,
    })
    const top = new THREE.Mesh(topGeo, topMat)
    top.rotation.x = -Math.PI / 2
    top.position.y = h / 2 + 0.001
    group.add(top)
  }

  return group
}

function buildKeyboard() {
  if (!scene.value) return

  const group = new THREE.Group()
  const meshMap = new Map<string, THREE.Mesh>()

  // Keyboard base plate
  const baseGeo = new THREE.BoxGeometry(17.5, 0.2, 7.5)
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x111120,
    roughness: 0.5,
    metalness: 0.7,
  })
  const base = new THREE.Mesh(baseGeo, baseMat)
  base.position.set(0, -0.25, 0)
  group.add(base)

  // Place keys
  KEY_ROWS.forEach((row) => {
    row.forEach((key) => {
      const isActive =
        props.pressedKeys.includes(key.code) ||
        props.highlightedKeys.includes(key.code)

      const keyGroup = createKeyMesh(key, isActive)

      const x = KEYBOARD_X_OFFSET + key.col * KEY_UNIT + (key.width * KEY_UNIT) / 2
      const y = 0
      const z = KEYBOARD_Y_OFFSET - key.row * ROW_SPACING

      keyGroup.position.set(x, y, z)

      // Store reference to body mesh for updates
      const bodyMesh = keyGroup.children[0] as THREE.Mesh
      meshMap.set(key.code, bodyMesh)

      group.add(keyGroup)
    })
  })

  // Tilt keyboard slightly toward viewer
  group.rotation.x = -0.3

  scene.value.add(group)
  keyboardGroup.value = group
  keyMeshes.value = meshMap
}

function updateKeyStates() {
  keyMeshes.value.forEach((mesh, code) => {
    const isActive =
      props.pressedKeys.includes(code) ||
      props.highlightedKeys.includes(code)

    const mat = mesh.material as THREE.MeshStandardMaterial
    if (isActive) {
      mat.color.setHex(0x00d4ff)
      mat.emissive.setHex(0x00d4ff)
      mat.emissiveIntensity = 0.8
    } else {
      mat.color.setHex(0x1e1e2e)
      mat.emissive.setHex(0x000000)
      mat.emissiveIntensity = 0
    }
  })
}

function initThree() {
  if (!canvasRef.value) return

  // Scene
  scene.value = new THREE.Scene()

  // Camera — angled slightly above looking down at keyboard
  camera.value = new THREE.PerspectiveCamera(50, canvasRef.value.clientWidth / canvasRef.value.clientHeight, 0.1, 100)
  camera.value.position.set(0, 6, 14)
  camera.value.lookAt(0, 0, 0)

  // Renderer
  renderer.value = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
  })
  renderer.value.setSize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
  renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.value.shadowMap.enabled = true

  // Lighting
  const ambient = new THREE.AmbientLight(0x111133, 2)
  scene.value.add(ambient)

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5)
  keyLight.position.set(0, 10, 8)
  scene.value.add(keyLight)

  const rimLight = new THREE.PointLight(0xa855f7, 1.5, 30)
  rimLight.position.set(-8, 3, -5)
  scene.value.add(rimLight)

  const fillLight = new THREE.PointLight(0x00d4ff, 0.8, 20)
  fillLight.position.set(8, 2, 8)
  scene.value.add(fillLight)

  buildKeyboard()
  animate()
}

function animate() {
  if (!renderer.value || !scene.value || !camera.value || !keyboardGroup.value) return

  elapsed += 0.016

  // Floating bob
  if (!prefersReducedMotion.value) {
    keyboardGroup.value.position.y = Math.sin(elapsed * 0.6) * 0.15

    // Mouse parallax tilt
    const targetRotY = mouseX.value * 0.12
    const targetRotX = -0.3 + mouseY.value * 0.06
    keyboardGroup.value.rotation.y += (targetRotY - keyboardGroup.value.rotation.y) * 0.05
    keyboardGroup.value.rotation.x += (targetRotX - keyboardGroup.value.rotation.x) * 0.05
  }

  renderer.value.render(scene.value, camera.value)
  animFrameId = requestAnimationFrame(animate)
}

function handleResize() {
  if (!canvasRef.value || !camera.value || !renderer.value) return
  const w = canvasRef.value.clientWidth
  const h = canvasRef.value.clientHeight
  camera.value.aspect = w / h
  camera.value.updateProjectionMatrix()
  renderer.value.setSize(w, h)
}

function handleMouseMove(e: MouseEvent) {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  mouseX.value = ((e.clientX - rect.left) / rect.width - 0.5) * 2
  mouseY.value = ((e.clientY - rect.top) / rect.height - 0.5) * 2
}
// #endregion

// #region watchers
watch(
  [() => props.pressedKeys, () => props.highlightedKeys],
  () => updateKeyStates(),
  { deep: true }
)
// #endregion

// #region lifecycle
onMounted(() => {
  initThree()
  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  cancelAnimationFrame(animFrameId)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)

  // Dispose key meshes
  keyMeshes.value.forEach((mesh) => {
    mesh.geometry.dispose()
    ;(mesh.material as THREE.Material).dispose()
  })

  if (keyboardGroup.value) {
    scene.value?.remove(keyboardGroup.value)
  }

  renderer.value?.dispose()
})
// #endregion
</script>

<template>
  <canvas
    ref="canvasRef"
    class="keyboard-3d"
    @mousemove="handleMouseMove"
  />
</template>

<style scoped>
.keyboard-3d {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
