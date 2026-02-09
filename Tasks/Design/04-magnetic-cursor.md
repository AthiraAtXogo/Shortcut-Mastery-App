# Task: Magnetic Cursor Effect

## Objective

Create a composable that makes elements subtly pull toward the cursor when nearby.

## Requirements

- [ ] Create useMagneticCursor composable
- [ ] Detect cursor proximity to element
- [ ] Smoothly translate element toward cursor
- [ ] Reset on mouse leave
- [ ] Configurable strength and radius
- [ ] Support reduced motion

## Technical Details

### Composable

```typescript
// composables/useMagneticCursor.ts
import { gsap } from 'gsap'

interface MagneticOptions {
  strength?: number  // 0-1, default 0.3
  radius?: number    // pixels, default 100
  ease?: string      // GSAP ease, default 'power2.out'
}

export function useMagneticCursor(
  elementRef: Ref<HTMLElement | undefined>,
  options: MagneticOptions = {}
) {
  const { strength = 0.3, radius = 100, ease = 'power2.out' } = options
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const handleMouseMove = (e: MouseEvent) => {
    if (prefersReducedMotion.value || !elementRef.value) return

    const rect = elementRef.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

    if (distance < radius) {
      const pull = (1 - distance / radius) * strength
      gsap.to(elementRef.value, {
        x: distanceX * pull,
        y: distanceY * pull,
        duration: 0.3,
        ease
      })
    }
  }

  const handleMouseLeave = () => {
    if (!elementRef.value) return
    gsap.to(elementRef.value, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)'
    })
  }

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove)
    elementRef.value?.addEventListener('mouseleave', handleMouseLeave)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    elementRef.value?.removeEventListener('mouseleave', handleMouseLeave)
  })
}
```

### Usage

```vue
<script setup>
const buttonRef = ref()
useMagneticCursor(buttonRef, { strength: 0.4 })
</script>

<template>
  <button ref="buttonRef">Hover me</button>
</template>
```

## Acceptance Criteria

- Smooth magnetic pull effect
- Natural elastic return
- No jank on fast mouse movement
- Disabled when reduced motion preferred
- Works with any element

## Notes

Subtle effect - don't overdo it. Should feel satisfying, not annoying.
