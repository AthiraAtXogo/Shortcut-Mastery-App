import { gsap } from 'gsap'

/** Wrong-answer feedback: horizontal shake + red overlay flash */

interface ShakeOptions {
  intensity?: number
  duration?: number
  flashColor?: string
}

export function useShakeFlash() {
  const prefersReducedMotion = ref(false)

  if (import.meta.client) {
    onMounted(() => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      prefersReducedMotion.value = mq.matches
      mq.addEventListener('change', (e) => {
        prefersReducedMotion.value = e.matches
      })
    })
  }

  function shake(
    element: HTMLElement | Element,
    options: ShakeOptions = {}
  ): Promise<void> {
    const { intensity = 10, duration = 0.4 } = options

    if (prefersReducedMotion.value) return Promise.resolve()

    return new Promise<void>((resolve) => {
      gsap.to(element, {
        x: intensity,
        duration: duration / 8,
        ease: 'power2.out',
        yoyo: true,
        repeat: 7,
        onComplete() {
          gsap.set(element, { x: 0 })
          resolve()
        }
      })
    })
  }

  function flash(
    element: HTMLElement | Element,
    options: ShakeOptions = {}
  ): Promise<void> {
    const { duration = 0.3, flashColor = 'rgba(244, 63, 94, 0.3)' } = options

    let overlay = (element as HTMLElement).querySelector(
      '.shake-flash-overlay'
    ) as HTMLElement | null

    if (!overlay) {
      overlay = document.createElement('div')
      overlay.className = 'shake-flash-overlay'
      overlay.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: ${flashColor};
        opacity: 0;
        z-index: 100;
        border-radius: inherit;
      `
      ;(element as HTMLElement).style.position = 'relative'
      element.appendChild(overlay)
    }

    return new Promise<void>((resolve) => {
      gsap.fromTo(
        overlay!,
        { opacity: 1 },
        { opacity: 0, duration, ease: 'power2.out', onComplete: resolve }
      )
    })
  }

  async function shakeAndFlash(
    element: HTMLElement | Element,
    options: ShakeOptions = {}
  ): Promise<void> {
    await Promise.all([shake(element, options), flash(element, options)])
  }

  /** Applies shake + flash to document.body for a full-screen effect */
  function screenShake(options: ShakeOptions = {}): Promise<void> {
    if (!import.meta.client) return Promise.resolve()
    return shakeAndFlash(document.body, options)
  }

  return {
    shake,
    flash,
    shakeAndFlash,
    screenShake,
    prefersReducedMotion: readonly(prefersReducedMotion)
  }
}
