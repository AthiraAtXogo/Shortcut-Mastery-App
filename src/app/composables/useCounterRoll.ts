import { gsap } from 'gsap'

/** Slot-machine style number roll animation for scores and XP */

interface CounterOptions {
  duration?: number
  ease?: string
  format?: (n: number) => string
}

export function useCounterRoll() {
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

  function roll(
    element: HTMLElement,
    from: number,
    to: number,
    options: CounterOptions = {}
  ): Promise<void> {
    const {
      duration = 1,
      ease = 'power2.out',
      format = (n: number) => Math.round(n).toLocaleString()
    } = options

    if (prefersReducedMotion.value) {
      element.textContent = format(to)
      return Promise.resolve()
    }

    return new Promise<void>((resolve) => {
      const obj = { value: from }

      gsap.to(obj, {
        value: to,
        duration,
        ease,
        onUpdate() {
          element.textContent = format(obj.value)
        },
        onComplete() {
          element.textContent = format(to)
          resolve()
        }
      })
    })
  }

  return { roll, prefersReducedMotion: readonly(prefersReducedMotion) }
}
