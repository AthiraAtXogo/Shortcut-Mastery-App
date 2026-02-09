# Task: Stagger Cascade Effect

## Objective

Create staggered reveal animations for lists and menu items.

## Requirements

- [ ] Create useStaggerCascade composable
- [ ] Animate items with delay between each
- [ ] Support different directions (top, bottom, left, right)
- [ ] Configurable stagger amount
- [ ] Support reduced motion

## Technical Details

### Implementation

```typescript
// composables/useStaggerCascade.ts
import { gsap } from 'gsap'

interface StaggerOptions {
  stagger?: number
  duration?: number
  y?: number
  x?: number
  opacity?: number
  ease?: string
  direction?: 'down' | 'up' | 'left' | 'right'
}

export function useStaggerCascade() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const cascade = (
    elements: HTMLElement[] | NodeListOf<Element>,
    options: StaggerOptions = {}
  ) => {
    const {
      stagger = 0.1,
      duration = 0.5,
      y = 20,
      opacity = 0,
      ease = 'power2.out',
      direction = 'down'
    } = options

    if (prefersReducedMotion.value) {
      gsap.set(elements, { opacity: 1, y: 0, x: 0 })
      return Promise.resolve()
    }

    const fromVars: gsap.TweenVars = { opacity }
    const toVars: gsap.TweenVars = { opacity: 1, duration, ease, stagger }

    switch (direction) {
      case 'down':
        fromVars.y = -y
        toVars.y = 0
        break
      case 'up':
        fromVars.y = y
        toVars.y = 0
        break
      case 'left':
        fromVars.x = y
        toVars.x = 0
        break
      case 'right':
        fromVars.x = -y
        toVars.x = 0
        break
    }

    return new Promise<void>(resolve => {
      gsap.fromTo(elements, fromVars, {
        ...toVars,
        onComplete: resolve
      })
    })
  }

  const exit = (
    elements: HTMLElement[] | NodeListOf<Element>,
    options: StaggerOptions = {}
  ) => {
    const { stagger = 0.05, duration = 0.3, ease = 'power2.in' } = options

    if (prefersReducedMotion.value) {
      gsap.set(elements, { opacity: 0 })
      return Promise.resolve()
    }

    return new Promise<void>(resolve => {
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

  return { cascade, exit }
}
```

### Usage

```vue
<script setup>
const listRef = ref()
const { cascade } = useStaggerCascade()

onMounted(() => {
  const items = listRef.value.querySelectorAll('.list-item')
  cascade(items, { stagger: 0.08, direction: 'down' })
})
</script>

<template>
  <ul ref="listRef">
    <li class="list-item" v-for="item in items">{{ item }}</li>
  </ul>
</template>
```

## Acceptance Criteria

- Items animate in sequence
- Stagger timing feels natural
- Multiple directions supported
- Exit animation available
- Reduced motion shows instant reveal

## Notes

Use for menus, result lists, achievement galleries.
