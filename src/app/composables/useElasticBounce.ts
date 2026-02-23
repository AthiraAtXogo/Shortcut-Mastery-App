import { gsap } from 'gsap'

/** Elastic bounce feedback for buttons and interactive elements */

interface BounceOptions {
  scale?: number
  duration?: number
  ease?: string
}

export function useElasticBounce() {
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

  function bounce(
    element: HTMLElement | Element,
    options: BounceOptions = {}
  ): Promise<void> {
    const { scale = 0.95, duration = 0.4, ease = 'elastic.out(1, 0.3)' } = options

    if (prefersReducedMotion.value) return Promise.resolve()

    return new Promise<void>((resolve) => {
      gsap.fromTo(
        element,
        { scale },
        { scale: 1, duration, ease, onComplete: resolve }
      )
    })
  }

  /** Scale down slightly on press */
  function press(element: HTMLElement | Element): void {
    if (prefersReducedMotion.value) return
    gsap.to(element, { scale: 0.95, duration: 0.1, ease: 'power2.out' })
  }

  /** Elastic spring back on release */
  function release(element: HTMLElement | Element): void {
    if (prefersReducedMotion.value) return
    gsap.to(element, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.3)' })
  }

  return {
    bounce,
    press,
    release,
    prefersReducedMotion: readonly(prefersReducedMotion)
  }
}
