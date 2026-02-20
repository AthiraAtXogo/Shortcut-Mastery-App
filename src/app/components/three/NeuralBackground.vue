<script setup lang="ts">
import * as THREE from 'three'

// #region setup
interface NodeData {
  id: string
  mesh: THREE.Mesh
  position: THREE.Vector3
  velocity: THREE.Vector3
  brightness: number
}

interface Props {
  nodeCount?: number
  connectionDistance?: number
  driftSpeed?: number
}

const props = withDefaults(defineProps<Props>(), {
  nodeCount: 80,
  connectionDistance: 5,
  driftSpeed: 0.01
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
const connectionLines = shallowRef<THREE.LineSegments>()
const pulseActive = ref(false)
const pulseRadius = ref(0)

// Plain array — kept outside Vue reactivity to avoid proxy wrapping Three.js objects
const nodes: NodeData[] = []

let animFrameId = 0
let frameCount = 0
// #endregion

// #region computed
const isMobile = computed(() => {
  if (!import.meta.client) return false
  return globalThis.innerWidth < 768
})

const effectiveNodeCount = computed(() => {
  return isMobile.value ? 40 : props.nodeCount
})

const primaryColor = 0x00d4ff
const secondaryColor = 0xa855f7
// #endregion

// #region methods
function generateNodes() {
  if (!scene.value) return

  const count = effectiveNodeCount.value
  nodes.length = 0

  for (let i = 0; i < count; i++) {
    const geometry = new THREE.SphereGeometry(0.15, 8, 8)
    const material = new THREE.MeshBasicMaterial({
      color: Math.random() > 0.7 ? secondaryColor : primaryColor,
      transparent: true,
      opacity: 0.8
    })
    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20
    )

    scene.value.add(mesh)

    nodes.push({
      id: `node-${i}`,
      mesh,
      position: mesh.position.clone(),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * props.driftSpeed,
        (Math.random() - 0.5) * props.driftSpeed,
        (Math.random() - 0.5) * props.driftSpeed
      ),
      brightness: 0.8
    })
  }
}

function updateConnections() {
  if (!scene.value) return

  // Remove old connections
  if (connectionLines.value) {
    scene.value.remove(connectionLines.value)
    connectionLines.value.geometry.dispose()
    ;(connectionLines.value.material as THREE.Material).dispose()
  }

  const positions: number[] = []
  const maxDistance = props.connectionDistance

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const distance = nodes[i]!.position.distanceTo(nodes[j]!.position)
      if (distance < maxDistance) {
        positions.push(
          nodes[i]!.position.x, nodes[i]!.position.y, nodes[i]!.position.z,
          nodes[j]!.position.x, nodes[j]!.position.y, nodes[j]!.position.z
        )
      }
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

  const material = new THREE.LineBasicMaterial({
    color: primaryColor,
    transparent: true,
    opacity: 0.2
  })

  connectionLines.value = new THREE.LineSegments(geometry, material)
  scene.value.add(connectionLines.value)
}

function updateNodePositions() {
  if (prefersReducedMotion.value) return

  nodes.forEach((node) => {
    node.position.add(node.velocity)
    node.mesh.position.copy(node.position)

    if (Math.abs(node.position.x) > 20) node.velocity.x *= -1
    if (Math.abs(node.position.y) > 15) node.velocity.y *= -1
    if (Math.abs(node.position.z) > 10) node.velocity.z *= -1
  })
}

function updatePulse() {
  if (!pulseActive.value) return

  pulseRadius.value += 0.3

  nodes.forEach((node) => {
    const distanceFromCenter = node.position.length()
    const pulseEdge = pulseRadius.value
    const pulseWidth = 3

    if (distanceFromCenter >= pulseEdge - pulseWidth && distanceFromCenter <= pulseEdge + pulseWidth) {
      node.brightness = 1.5
      ;(node.mesh.material as THREE.MeshBasicMaterial).opacity = node.brightness
    } else {
      node.brightness = Math.max(0.8, node.brightness - 0.03)
      ;(node.mesh.material as THREE.MeshBasicMaterial).opacity = node.brightness
    }
  })

  if (pulseRadius.value > 50) {
    pulseActive.value = false
    pulseRadius.value = 0
  }
}

function animate() {
  if (!renderer.value || !scene.value || !camera.value) return

  frameCount++
  updateNodePositions()

  if (frameCount % 10 === 0) {
    updateConnections()
  }

  updatePulse()

  renderer.value.render(scene.value, camera.value)
  animFrameId = requestAnimationFrame(animate)
}

function initThree() {
  if (!canvasRef.value) return

  scene.value = new THREE.Scene()

  camera.value = new THREE.PerspectiveCamera(
    75,
    globalThis.innerWidth / globalThis.innerHeight,
    0.1,
    1000
  )
  camera.value.position.z = 30

  renderer.value = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true
  })
  renderer.value.setSize(globalThis.innerWidth, globalThis.innerHeight)
  renderer.value.setPixelRatio(Math.min(globalThis.devicePixelRatio ?? 1, 2))

  generateNodes()
  updateConnections()
  animate()
}

function handleResize() {
  if (!camera.value || !renderer.value) return
  camera.value.aspect = globalThis.innerWidth / globalThis.innerHeight
  camera.value.updateProjectionMatrix()
  renderer.value.setSize(globalThis.innerWidth, globalThis.innerHeight)
}

function triggerPulse() {
  if (pulseActive.value) return
  pulseRadius.value = 0
  pulseActive.value = true
}
// #endregion

// #region lifecycle
onMounted(() => {
  initThree()
  globalThis.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animFrameId)
  globalThis.removeEventListener('resize', handleResize)

  nodes.forEach((node) => {
    node.mesh.geometry.dispose()
    ;(node.mesh.material as THREE.Material).dispose()
  })
  nodes.length = 0

  if (connectionLines.value) {
    connectionLines.value.geometry.dispose()
    ;(connectionLines.value.material as THREE.Material).dispose()
  }

  renderer.value?.dispose()
})
// #endregion

defineExpose({ triggerPulse })
</script>

<template>
  <canvas
    ref="canvasRef"
    class="neural-bg"
  />
</template>

<style scoped>
.neural-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .neural-bg {
    opacity: 0.3;
  }
}
</style>
