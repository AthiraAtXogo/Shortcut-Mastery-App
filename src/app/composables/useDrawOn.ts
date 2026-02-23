import { gsap } from 'gsap'

/** SVG stroke draw-on animation using dashoffset technique */

interface DrawOptions {
  duration?: number
  ease?: string
  direction?: 'forward' | 'reverse'
  delay?: number
}

export function useDrawOn() {
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

  function draw(path: SVGPathElement, options: DrawOptions = {}): Promise<void> {
    const {
      duration = 1,
      ease = 'power2.out',
      direction = 'forward',
      delay = 0
    } = options

    const length = path.getTotalLength()
    const startOffset = direction === 'forward' ? length : 0
    const endOffset = direction === 'forward' ? 0 : length

    gsap.set(path, { strokeDasharray: length, strokeDashoffset: startOffset })

    if (prefersReducedMotion.value) {
      gsap.set(path, { strokeDashoffset: endOffset })
      return Promise.resolve()
    }

    return new Promise<void>((resolve) => {
      gsap.to(path, {
        strokeDashoffset: endOffset,
        duration,
        ease,
        delay,
        onComplete: resolve
      })
    })
  }

  function drawMultiple(
    paths: SVGPathElement[],
    options: DrawOptions & { stagger?: number } = {}
  ): Promise<void>[] {
    const { stagger = 0.1, ...drawOptions } = options
    return Promise.all(
      paths.map((path, i) =>
        draw(path, { ...drawOptions, delay: (drawOptions.delay ?? 0) + i * stagger })
      )
    )
  }

  /**
   * Animate a progress bar path to a given percentage (0-100).
   * Assumes the path is already initialised with strokeDasharray = totalLength.
   */
  function setProgress(path: SVGPathElement, percent: number, animDuration = 0.5): void {
    const length = path.getTotalLength()
    const offset = length * (1 - percent / 100)

    if (prefersReducedMotion.value) {
      gsap.set(path, { strokeDashoffset: offset })
      return
    }

    gsap.to(path, { strokeDashoffset: offset, duration: animDuration, ease: 'power2.out' })
  }

  return { draw, drawMultiple, setProgress, prefersReducedMotion: readonly(prefersReducedMotion) }
}
