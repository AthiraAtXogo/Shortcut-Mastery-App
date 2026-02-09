# Task: Elastic Bounce Effect

## Objective

Create a satisfying elastic bounce animation for buttons and interactive elements.

## Requirements

- [ ] Create useElasticBounce composable
- [ ] Scale down then bounce back
- [ ] Configurable intensity
- [ ] Support reduced motion
- [ ] Can be triggered on click/hover

## Technical Details

### Implementation

```typescript
// composables/useElasticBounce.ts
import { gsap } from 'gsap'

interface BounceOptions {
  scale?: number
  duration?: number
  ease?: string
}

export function useElasticBounce() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const bounce = (
    element: HTMLElement | Element,
    options: BounceOptions = {}
  ) => {
    const { scale = 0.95, duration = 0.4, ease = 'elastic.out(1, 0.3)' } = options

    if (prefersReducedMotion.value) {
      return Promise.resolve()
    }

    return new Promise<void>(resolve => {
      gsap.fromTo(
        element,
        { scale },
        {
          scale: 1,
          duration,
          ease,
          onComplete: resolve
        }
      )
    })
  }

  const press = (element: HTMLElement | Element) => {
    if (prefersReducedMotion.value) return

    gsap.to(element, {
      scale: 0.95,
      duration: 0.1,
      ease: 'power2.out'
    })
  }

  const release = (element: HTMLElement | Element) => {
    if (prefersReducedMotion.value) return

    gsap.to(element, {
      scale: 1,
      duration: 0.4,
      ease: 'elastic.out(1, 0.3)'
    })
  }

  return { bounce, press, release }
}
```

### Directive Version

```typescript
// directives/vBounce.ts
export const vBounce = {
  mounted(el: HTMLElement) {
    const { bounce } = useElasticBounce()

    el.addEventListener('click', () => bounce(el))
  }
}
```

### Usage

```vue
<!-- Composable -->
<script setup>
const buttonRef = ref()
const { bounce } = useElasticBounce()

const handleClick = () => {
  bounce(buttonRef.value)
  // do action
}
</script>

<!-- Directive -->
<button v-bounce>Click me</button>
```

## Acceptance Criteria

- Satisfying elastic overshoot
- Works on any element
- Press/release separate for hold states
- Reduced motion respected
- No jank on rapid clicks

## Notes

Key to the "game feel" - buttons should feel alive.
