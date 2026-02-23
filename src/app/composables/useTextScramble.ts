import { gsap } from 'gsap'

/** Matrix-style text scramble — characters randomise before settling on final text */

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

interface ScrambleOptions {
  duration?: number
  characters?: string
}

export function useTextScramble() {
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

  function scramble(
    element: HTMLElement,
    finalText: string,
    options: ScrambleOptions = {}
  ): Promise<void> {
    const { duration = 1, characters = DEFAULT_CHARS } = options

    if (prefersReducedMotion.value) {
      element.textContent = finalText
      return Promise.resolve()
    }

    return new Promise<void>((resolve) => {
      const length = finalText.length
      const chars = characters.split('')
      const obj = { progress: 0 }

      gsap.to(obj, {
        progress: length,
        duration,
        ease: 'none',
        onUpdate() {
          const current = Math.floor(obj.progress)
          let text = ''
          for (let i = 0; i < length; i++) {
            if (i < current) {
              text += finalText[i]
            } else {
              text += chars[Math.floor(Math.random() * chars.length)]
            }
          }
          element.textContent = text
        },
        onComplete() {
          element.textContent = finalText
          resolve()
        }
      })
    })
  }

  return { scramble, prefersReducedMotion: readonly(prefersReducedMotion) }
}
