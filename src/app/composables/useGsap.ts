import { gsap } from 'gsap'
import { ref, onMounted, onUnmounted } from 'vue'

// Animation presets
export const ANIMATION_PRESETS = {
  elasticBounce: {
    ease: 'elastic.out(1, 0.3)',
    duration: 0.6
  },
  smoothReveal: {
    ease: 'power2.out',
    duration: 0.4
  },
  quickPop: {
    ease: 'back.out(1.7)',
    duration: 0.3
  },
  snappy: {
    ease: 'power3.out',
    duration: 0.25
  }
} as const

export type AnimationPreset = keyof typeof ANIMATION_PRESETS

export function useGsap() {
  // SSR-safe reduced motion check
  const prefersReducedMotion = ref(false)

  if (process.client) {
    onMounted(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      prefersReducedMotion.value = mediaQuery.matches

      const handler = (e: MediaQueryListEvent) => {
        prefersReducedMotion.value = e.matches
      }

      mediaQuery.addEventListener('change', handler)

      onUnmounted(() => {
        mediaQuery.removeEventListener('change', handler)
      })
    })
  }

  /**
   * Animate with reduced motion support
   */
  function animate(
    target: gsap.TweenTarget,
    props: gsap.TweenVars,
    preset?: AnimationPreset
  ): gsap.core.Tween {
    const presetProps = preset ? ANIMATION_PRESETS[preset] : {}

    if (prefersReducedMotion.value) {
      return gsap.set(target, { ...props })
    }

    return gsap.to(target, { ...presetProps, ...props })
  }

  /**
   * Animate from a state
   */
  function animateFrom(
    target: gsap.TweenTarget,
    props: gsap.TweenVars,
    preset?: AnimationPreset
  ): gsap.core.Tween {
    const presetProps = preset ? ANIMATION_PRESETS[preset] : {}

    if (prefersReducedMotion.value) {
      return gsap.set(target, {})
    }

    return gsap.from(target, { ...presetProps, ...props })
  }

  /**
   * Text scramble effect - types out text with random characters
   */
  function textScramble(
    target: Element,
    text: string,
    options: { duration?: number; chars?: string } = {}
  ): gsap.core.Tween {
    const { duration = 0.8, chars = '!<>-_\\/[]{}—=+*^?#' } = options

    if (prefersReducedMotion.value) {
      if (target instanceof HTMLElement) {
        target.textContent = text
      }
      return gsap.set(target, {})
    }

    const obj = { progress: 0 }

    return gsap.to(obj, {
      progress: 1,
      duration,
      ease: 'none',
      onUpdate: () => {
        if (!(target instanceof HTMLElement)) return

        const progress = obj.progress
        const length = text.length
        const current = Math.floor(progress * length)

        let result = ''
        for (let i = 0; i < length; i++) {
          if (i < current) {
            result += text[i]
          } else if (i === current) {
            result += chars[Math.floor(Math.random() * chars.length)]
          } else {
            result += chars[Math.floor(Math.random() * chars.length)]
          }
        }
        target.textContent = result
      },
      onComplete: () => {
        if (target instanceof HTMLElement) {
          target.textContent = text
        }
      }
    })
  }

  /**
   * Counter roll effect - animates number counting up
   */
  function counterRoll(
    target: Element,
    endValue: number,
    options: { duration?: number; startValue?: number; format?: (n: number) => string } = {}
  ): gsap.core.Tween {
    const { duration = 1, startValue = 0, format = (n) => Math.round(n).toString() } = options

    if (prefersReducedMotion.value) {
      if (target instanceof HTMLElement) {
        target.textContent = format(endValue)
      }
      return gsap.set(target, {})
    }

    const obj = { value: startValue }

    return gsap.to(obj, {
      value: endValue,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (target instanceof HTMLElement) {
          target.textContent = format(obj.value)
        }
      }
    })
  }

  /**
   * Elastic bounce effect - scale up with elastic overshoot
   */
  function elasticBounce(
    target: gsap.TweenTarget,
    options: { scale?: number } = {}
  ): gsap.core.Tween {
    const { scale = 1.1 } = options

    if (prefersReducedMotion.value) {
      return gsap.set(target, { scale: 1 })
    }

    return gsap.fromTo(
      target,
      { scale: 0.8 },
      {
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
        overwrite: true
      }
    )
  }

  /**
   * Shake and flash effect - for wrong answers
   */
  function shakeAndFlash(
    target: gsap.TweenTarget,
    options: { intensity?: number } = {}
  ): gsap.core.Timeline {
    const { intensity = 10 } = options
    const tl = gsap.timeline()

    if (prefersReducedMotion.value) {
      return tl.to(target, { opacity: 0.5, duration: 0.1 }).to(target, { opacity: 1, duration: 0.1 })
    }

    return tl
      .to(target, { x: -intensity, duration: 0.05 })
      .to(target, { x: intensity, duration: 0.05 })
      .to(target, { x: -intensity * 0.7, duration: 0.05 })
      .to(target, { x: intensity * 0.7, duration: 0.05 })
      .to(target, { x: 0, duration: 0.05 })
      .to(target, { backgroundColor: 'rgba(244, 63, 94, 0.3)', duration: 0.1 }, 0)
      .to(target, { backgroundColor: 'transparent', duration: 0.2 }, 0.15)
  }

  /**
   * Stagger cascade effect - animate multiple elements in sequence
   */
  function staggerCascade(
    targets: gsap.TweenTarget,
    options: { stagger?: number; y?: number } = {}
  ): gsap.core.Tween {
    const { stagger = 0.05, y = 20 } = options

    if (prefersReducedMotion.value) {
      return gsap.set(targets, { opacity: 1, y: 0 })
    }

    return gsap.from(targets, {
      opacity: 0,
      y,
      duration: 0.4,
      stagger,
      ease: 'power2.out'
    })
  }

  /**
   * Confetti burst effect - particles exploding outward
   */
  function confettiBurst(
    container: Element,
    options: { count?: number; colors?: string[] } = {}
  ): gsap.core.Timeline {
    const { count = 20, colors = ['#00d4ff', '#a855f7', '#84cc16', '#f97316'] } = options
    const tl = gsap.timeline()

    if (prefersReducedMotion.value) {
      return tl
    }

    const rect = container.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div')
      particle.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${colors[i % colors.length]};
        pointer-events: none;
        left: ${centerX}px;
        top: ${centerY}px;
      `
      container.appendChild(particle)

      const angle = (i / count) * Math.PI * 2
      const distance = 50 + Math.random() * 100
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance

      tl.to(
        particle,
        {
          x,
          y,
          opacity: 0,
          scale: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => particle.remove()
        },
        0
      )
    }

    return tl
  }

  /**
   * Pulse glow effect
   */
  function pulseGlow(
    target: gsap.TweenTarget,
    options: { color?: string; repeat?: number } = {}
  ): gsap.core.Tween {
    const { color = '#00d4ff', repeat = 2 } = options

    if (prefersReducedMotion.value) {
      return gsap.set(target, {})
    }

    return gsap.to(target, {
      boxShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
      duration: 0.3,
      repeat,
      yoyo: true,
      ease: 'power2.inOut'
    })
  }

  return {
    gsap,
    prefersReducedMotion,
    animate,
    animateFrom,
    textScramble,
    counterRoll,
    elasticBounce,
    shakeAndFlash,
    staggerCascade,
    confettiBurst,
    pulseGlow,
    ANIMATION_PRESETS
  }
}
