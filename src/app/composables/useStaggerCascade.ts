import { gsap } from 'gsap'

/** Staggered reveal animations for lists, menus, and galleries */

interface StaggerOptions {
  stagger?: number
  duration?: number
  distance?: number
  opacity?: number
  ease?: string
  direction?: 'down' | 'up' | 'left' | 'right'
}

export function useStaggerCascade() {
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

  function cascade(
    elements: HTMLElement[] | NodeListOf<Element>,
    options: StaggerOptions = {}
  ): Promise<void> {
    const {
      stagger = 0.1,
      duration = 0.5,
      distance = 20,
      opacity = 0,
      ease = 'power2.out',
      direction = 'down'
    } = options

    if (prefersReducedMotion.value) {
      gsap.set(elements, { opacity: 1, y: 0, x: 0 })
      return Promise.resolve()
    }

    const fromVars: gsap.TweenVars = { opacity }

    switch (direction) {
      case 'down':
        fromVars.y = -distance
        break
      case 'up':
        fromVars.y = distance
        break
      case 'left':
        fromVars.x = distance
        break
      case 'right':
        fromVars.x = -distance
        break
    }

    return new Promise<void>((resolve) => {
      gsap.fromTo(
        elements,
        fromVars,
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration,
          ease,
          stagger,
          onComplete: resolve
        }
      )
    })
  }

  function exit(
    elements: HTMLElement[] | NodeListOf<Element>,
    options: StaggerOptions = {}
  ): Promise<void> {
    const { stagger = 0.05, duration = 0.3, ease = 'power2.in' } = options

    if (prefersReducedMotion.value) {
      gsap.set(elements, { opacity: 0 })
      return Promise.resolve()
    }

    return new Promise<void>((resolve) => {
      gsap.to(elements, {
        opacity: 0,
        y: -10,
        duration,
        ease,
        stagger,
        onComplete: resolve
      })
    })
  }

  return { cascade, exit, prefersReducedMotion: readonly(prefersReducedMotion) }
}
