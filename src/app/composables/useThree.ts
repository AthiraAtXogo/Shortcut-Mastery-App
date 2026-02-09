import * as THREE from 'three'

export function useThree() {
  // SSR-safe reduced motion check
  const prefersReducedMotion = ref(false)
  if (process.client) {
    onMounted(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      prefersReducedMotion.value = mediaQuery.matches
    })
  }

  /**
   * Create a basic glow material
   */
  function createGlowMaterial(color: string = '#00d4ff', intensity: number = 1) {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: intensity
    })
  }

  /**
   * Create a particle system for effects
   */
  function createParticleSystem(count: number = 100, color: string = '#00d4ff') {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.05,
      transparent: true,
      opacity: 0.8
    })

    return new THREE.Points(geometry, material)
  }

  /**
   * Create a line for neural network connections
   */
  function createLine(start: THREE.Vector3, end: THREE.Vector3, color: string = '#00d4ff') {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end])
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.3
    })
    return new THREE.Line(geometry, material)
  }

  /**
   * Properly dispose of Three.js objects to prevent memory leaks
   */
  function disposeObject(obj: THREE.Object3D) {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose())
        } else {
          child.material?.dispose()
        }
      }
      if (child instanceof THREE.Points) {
        child.geometry?.dispose()
        if (child.material instanceof THREE.Material) {
          child.material.dispose()
        }
      }
      if (child instanceof THREE.Line) {
        child.geometry?.dispose()
        if (child.material instanceof THREE.Material) {
          child.material.dispose()
        }
      }
    })
  }

  /**
   * Generate random position within bounds
   */
  function randomPosition(bounds: number = 5): THREE.Vector3 {
    return new THREE.Vector3(
      (Math.random() - 0.5) * bounds * 2,
      (Math.random() - 0.5) * bounds * 2,
      (Math.random() - 0.5) * bounds * 2
    )
  }

  /**
   * Lerp between two colors
   */
  function lerpColor(color1: string, color2: string, t: number): THREE.Color {
    const c1 = new THREE.Color(color1)
    const c2 = new THREE.Color(color2)
    return c1.lerp(c2, t)
  }

  return {
    THREE,
    prefersReducedMotion,
    createGlowMaterial,
    createParticleSystem,
    createLine,
    disposeObject,
    randomPosition,
    lerpColor
  }
}
