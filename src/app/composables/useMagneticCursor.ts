import { gsap } from 'gsap'

interface MagneticOptions {
  strength?: number // 0-1, default 0.3
  radius?: number // pixels, default 100
  ease?: string // GSAP ease for pull
  returnEase?: string // GSAP ease for return
}

export function useMagneticCursor(
  elementRef: Ref<HTMLElement | undefined>,
  options: MagneticOptions = {}
) {
  const {
    strength = 0.3,
    radius = 100,
    ease = 'power2.out',
    returnEase = 'elastic.out(1, 0.3)'
  } = options

  // SSR-safe reduced motion check
  const prefersReducedMotion = ref(false)
  if (process.client) {
    onMounted(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      prefersReducedMotion.value = mediaQuery.matches
    })
  }

  const isHovering = ref(false)

  function handleMouseMove(e: MouseEvent) {
    if (prefersReducedMotion.value || !elementRef.value) return

    const rect = elementRef.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

    if (distance < radius) {
      isHovering.value = true
      const pull = (1 - distance / radius) * strength

      gsap.to(elementRef.value, {
        x: distanceX * pull,
        y: distanceY * pull,
        duration: 0.3,
        ease,
        overwrite: 'auto'
      })
    } else if (isHovering.value) {
      resetPosition()
    }
  }

  function handleMouseLeave() {
    resetPosition()
  }

  function resetPosition() {
    if (!elementRef.value) return

    isHovering.value = false
    gsap.to(elementRef.value, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: returnEase,
      overwrite: 'auto'
    })
  }

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    elementRef.value?.addEventListener('mouseleave', handleMouseLeave)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    elementRef.value?.removeEventListener('mouseleave', handleMouseLeave)
  })

  return {
    isHovering: readonly(isHovering)
  }
}
