<script setup lang="ts">
import * as THREE from 'three'

// #region setup
interface Node {
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
const nodes = ref<Node[]>([])
const scene = ref<THREE.Scene>()
const camera = ref<THREE.PerspectiveCamera>()
const renderer = ref<THREE.WebGLRenderer>()
const connectionLines = ref<THREE.LineSegments>()
const pulseActive = ref(false)
const pulseRadius = ref(0)
// #endregion

// #region computed
const isMobile = computed(() => {
  if (!process.client) return false
  return window.innerWidth < 768
})

const effectiveNodeCount = computed(() => {
  return isMobile.value ? 40 : props.nodeCount
})

const primaryColor = 0x00d4ff
const secondaryColor = 0xa855f7
// #endregion

// #region methods
function initThree() {
  if (!canvasRef.value) return

  // Scene
  scene.value = new THREE.Scene()

  // Camera
  camera.value = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.value.position.z = 30

  // Renderer
  renderer.value = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true
  })
  renderer.value.setSize(window.innerWidth, window.innerHeight)
  renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Generate nodes
  generateNodes()

  // Generate connections
  updateConnections()

  // Start animation
  animate()
}

function generateNodes() {
  if (!scene.value) return

  const count = effectiveNodeCount.value
  nodes.value = []

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

    nodes.value.push({
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

  // Calculate new connections
  const positions: number[] = []
  const maxDistance = props.connectionDistance

  for (let i = 0; i < nodes.value.length; i++) {
    for (let j = i + 1; j < nodes.value.length; j++) {
      const distance = nodes.value[i].position.distanceTo(nodes.value[j].position)

      if (distance < maxDistance) {
        positions.push(
          nodes.value[i].position.x,
          nodes.value[i].position.y,
          nodes.value[i].position.z,
          nodes.value[j].position.x,
          nodes.value[j].position.y,
          nodes.value[j].position.z
        )
      }
    }
  }

  // Create line geometry
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

  nodes.value.forEach(node => {
    // Update position
    node.position.add(node.velocity)
    node.mesh.position.copy(node.position)

    // Bounce off boundaries
    if (Math.abs(node.position.x) > 20) {
      node.velocity.x *= -1
    }
    if (Math.abs(node.position.y) > 15) {
      node.velocity.y *= -1
    }
    if (Math.abs(node.position.z) > 10) {
      node.velocity.z *= -1
    }
  })
}

function updatePulse() {
  if (!pulseActive.value) return

  pulseRadius.value += 0.3

  // Update node brightness based on pulse
  nodes.value.forEach(node => {
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

  // End pulse
  if (pulseRadius.value > 50) {
    pulseActive.value = false
    pulseRadius.value = 0
  }
}

function triggerPulse() {
  if (pulseActive.value) return
  pulseRadius.value = 0
  pulseActive.value = true
}

let frameCount = 0
function animate() {
  if (!renderer.value || !scene.value || !camera.value) return

  frameCount++

  // Update positions every frame
  updateNodePositions()

  // Update connections every 10 frames
  if (frameCount % 10 === 0) {
    updateConnections()
  }

  // Update pulse effect
  updatePulse()

  // Render
  renderer.value.render(scene.value, camera.value)

  requestAnimationFrame(animate)
}

function handleResize() {
  if (!camera.value || !renderer.value) return

  camera.value.aspect = window.innerWidth / window.innerHeight
  camera.value.updateProjectionMatrix()
  renderer.value.setSize(window.innerWidth, window.innerHeight)
}
// #endregion

// #region lifecycle
onMounted(() => {
  initThree()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)

  // Cleanup
  nodes.value.forEach(node => {
    node.mesh.geometry.dispose()
    ;(node.mesh.material as THREE.Material).dispose()
  })

  if (connectionLines.value) {
    connectionLines.value.geometry.dispose()
    ;(connectionLines.value.material as THREE.Material).dispose()
  }

  renderer.value?.dispose()
})
// #endregion

// Expose trigger method
defineExpose({
  triggerPulse
})
</script>

<template>
  <canvas ref="canvasRef" class="neural-bg" />
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

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .neural-bg {
    opacity: 0.3;
  }
}
</style>
