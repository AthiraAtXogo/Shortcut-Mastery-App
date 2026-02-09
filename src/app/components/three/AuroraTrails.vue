<script setup lang="ts">
import * as THREE from 'three'

// #region setup
interface Props {
  streak?: number
}

const props = withDefaults(defineProps<Props>(), {
  streak: 0
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
const ribbons = shallowRef<THREE.Mesh[]>([])
const time = ref(0)
const animationFrameId = ref<number>()
// #endregion

// #region computed
const visible = computed(() => props.streak >= 3)

const color = computed(() => {
  if (props.streak >= 21) return '#ffd700' // Gold
  if (props.streak >= 11) return '#f43f5e' // Pink
  if (props.streak >= 6) return '#a855f7' // Purple
  return '#00d4ff' // Blue
})

const intensity = computed(() => {
  return Math.min(props.streak / 20, 1)
})

const colorRGB = computed(() => {
  const hex = color.value.replace('#', '')
  const r = Number.parseInt(hex.substring(0, 2), 16) / 255
  const g = Number.parseInt(hex.substring(2, 4), 16) / 255
  const b = Number.parseInt(hex.substring(4, 6), 16) / 255
  return new THREE.Vector3(r, g, b)
})
// #endregion

// #region shaders
const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Wave motion (more visible amplitude)
    pos.y += sin(pos.x * 0.3 + uTime * 2.0) * 1.5;
    pos.z += cos(pos.x * 0.2 + uTime * 1.5) * 1.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    // Smooth gradient from edges to center
    float alpha = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);

    // Horizontal fade on edges
    alpha *= smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);

    // Apply intensity and global opacity (much more visible)
    alpha *= (0.6 + uIntensity * 0.4) * uOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }
`
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

  // Create ribbons
  createRibbons()

  // Start animation
  animate()
}

function createRibbons() {
  if (!scene.value) return

  const ribbonCount = 3
  ribbons.value = []

  for (let i = 0; i < ribbonCount; i++) {
    const geometry = new THREE.PlaneGeometry(40, 6, 32, 8)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: colorRGB.value.clone() },
        uIntensity: { value: intensity.value },
        uOpacity: { value: visible.value ? 1 : 0 }
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    })

    const mesh = new THREE.Mesh(geometry, material)

    // Position ribbons
    mesh.position.y = (i - 1) * 4
    mesh.position.z = 0
    mesh.rotation.x = 0

    scene.value.add(mesh)
    ribbons.value.push(mesh)
  }
}

function updateRibbons() {
  ribbons.value.forEach((ribbon) => {
    const material = ribbon.material as THREE.ShaderMaterial
    if (!material.uniforms) return

    // Update time
    if (material.uniforms.uTime) {
      material.uniforms.uTime.value = time.value
    }

    // Update color
    if (material.uniforms.uColor) {
      material.uniforms.uColor.value.copy(colorRGB.value)
    }

    // Update intensity
    if (material.uniforms.uIntensity) {
      material.uniforms.uIntensity.value = intensity.value
    }

    // Handle visibility with smooth fade
    if (material.uniforms.uOpacity) {
      const currentOpacity = material.uniforms.uOpacity.value
      const targetOpacity = visible.value ? 1 : 0

      if (Math.abs(currentOpacity - targetOpacity) > 0.01) {
        material.uniforms.uOpacity.value = THREE.MathUtils.lerp(
          currentOpacity,
          targetOpacity,
          0.05
        )
      }
    }
  })
}

function animate() {
  if (!renderer.value || !scene.value || !camera.value) return

  // Update time
  if (!prefersReducedMotion.value) {
    time.value += 0.01
  }

  // Update ribbon uniforms
  updateRibbons()

  // Render
  renderer.value.render(scene.value, camera.value)

  animationFrameId.value = requestAnimationFrame(animate)
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

  // Cancel animation
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }

  // Cleanup
  ribbons.value.forEach((ribbon) => {
    ribbon.geometry.dispose()
    ;(ribbon.material as THREE.Material).dispose()
  })

  renderer.value?.dispose()
})
// #endregion
</script>

<template>
  <canvas ref="canvasRef" class="aurora-trails" />
</template>

<style scoped>
.aurora-trails {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .aurora-trails {
    opacity: 0.3;
  }
}
</style>
