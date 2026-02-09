# Task: Shake and Flash Effect

## Objective

Create a wrong answer feedback animation combining screen shake and red flash.

## Requirements

- [ ] Create useShakeFlash composable
- [ ] Horizontal shake animation
- [ ] Red overlay flash
- [ ] Optional screen edge flash
- [ ] Sound integration hook
- [ ] Support reduced motion (flash only)

## Technical Details

### Implementation

```typescript
// composables/useShakeFlash.ts
import { gsap } from 'gsap'

interface ShakeOptions {
  intensity?: number
  duration?: number
  flashColor?: string
}

export function useShakeFlash() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const shake = (
    element: HTMLElement | Element,
    options: ShakeOptions = {}
  ) => {
    const { intensity = 10, duration = 0.4 } = options

    if (prefersReducedMotion.value) {
      return Promise.resolve()
    }

    return new Promise<void>(resolve => {
      gsap.to(element, {
        x: intensity,
        duration: duration / 8,
        ease: 'power2.out',
        yoyo: true,
        repeat: 7,
        onComplete: () => {
          gsap.set(element, { x: 0 })
          resolve()
        }
      })
    })
  }

  const flash = (
    element: HTMLElement | Element,
    options: ShakeOptions = {}
  ) => {
    const { duration = 0.3, flashColor = 'rgba(244, 63, 94, 0.3)' } = options

    // Create overlay if not exists
    let overlay = element.querySelector('.shake-flash-overlay') as HTMLElement
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
      `
      ;(element as HTMLElement).style.position = 'relative'
      element.appendChild(overlay)
    }

    return new Promise<void>(resolve => {
      gsap.fromTo(overlay,
        { opacity: 1 },
        {
          opacity: 0,
          duration,
          ease: 'power2.out',
          onComplete: resolve
        }
      )
    })
  }

  const shakeAndFlash = async (
    element: HTMLElement | Element,
    options: ShakeOptions = {}
  ) => {
    await Promise.all([
      shake(element, options),
      flash(element, options)
    ])
  }

  // Screen-wide effect
  const screenShake = (options: ShakeOptions = {}) => {
    const body = document.body
    return shakeAndFlash(body, options)
  }

  return { shake, flash, shakeAndFlash, screenShake }
}
```

### Usage

```vue
<script setup>
const gameRef = ref()
const { shakeAndFlash } = useShakeFlash()
const { play } = useAudio()

const onWrongAnswer = () => {
  play('wrong')
  shakeAndFlash(gameRef.value, { intensity: 8 })
}
</script>
```

### CSS for Edge Flash

```css
/* Alternative: vignette flash effect */
.screen-flash {
  position: fixed;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 0 100px 50px rgba(244, 63, 94, 0.5);
  opacity: 0;
  z-index: 9999;
}
```

## Acceptance Criteria

- Shake feels impactful but not jarring
- Flash is visible but not blinding
- Combines smoothly with sound
- Reduced motion shows flash only
- No layout shift during shake

## Notes

Wrong answer feedback should be clear but not punishing.
