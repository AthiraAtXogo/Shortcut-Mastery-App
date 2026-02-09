# Task: Draw-On Lines Effect

## Objective

Create an SVG line drawing animation for progress bars and decorative elements.

## Requirements

- [ ] Create useDrawOn composable
- [ ] Animate SVG stroke dashoffset
- [ ] Support any SVG path
- [ ] Configurable duration and direction
- [ ] Support reduced motion

## Technical Details

### Implementation

```typescript
// composables/useDrawOn.ts
import { gsap } from 'gsap'

interface DrawOptions {
  duration?: number
  ease?: string
  direction?: 'forward' | 'reverse'
  delay?: number
}

export function useDrawOn() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const draw = (
    path: SVGPathElement,
    options: DrawOptions = {}
  ) => {
    const { duration = 1, ease = 'power2.out', direction = 'forward', delay = 0 } = options

    const length = path.getTotalLength()

    // Set up initial state
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: direction === 'forward' ? length : 0
    })

    if (prefersReducedMotion.value) {
      gsap.set(path, { strokeDashoffset: direction === 'forward' ? 0 : length })
      return Promise.resolve()
    }

    return new Promise<void>(resolve => {
      gsap.to(path, {
        strokeDashoffset: direction === 'forward' ? 0 : length,
        duration,
        ease,
        delay,
        onComplete: resolve
      })
    })
  }

  const drawMultiple = (
    paths: SVGPathElement[],
    options: DrawOptions & { stagger?: number } = {}
  ) => {
    const { stagger = 0.1, ...drawOptions } = options

    return Promise.all(
      paths.map((path, i) =>
        draw(path, { ...drawOptions, delay: (drawOptions.delay ?? 0) + i * stagger })
      )
    )
  }

  return { draw, drawMultiple }
}
```

### Progress Bar Component

```vue
<template>
  <svg class="progress-bar" viewBox="0 0 200 4">
    <path
      ref="bgPath"
      d="M 2 2 L 198 2"
      stroke="var(--bg-tertiary)"
      stroke-width="4"
      stroke-linecap="round"
      fill="none"
    />
    <path
      ref="progressPath"
      d="M 2 2 L 198 2"
      stroke="var(--primary-500)"
      stroke-width="4"
      stroke-linecap="round"
      fill="none"
    />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  progress: number // 0-100
}>()

const progressPath = ref<SVGPathElement>()
const { draw } = useDrawOn()

watch(() => props.progress, () => {
  if (!progressPath.value) return

  const length = progressPath.value.getTotalLength()
  const offset = length * (1 - props.progress / 100)

  gsap.to(progressPath.value, {
    strokeDashoffset: offset,
    duration: 0.5,
    ease: 'power2.out'
  })
})

onMounted(() => {
  if (progressPath.value) {
    const length = progressPath.value.getTotalLength()
    gsap.set(progressPath.value, {
      strokeDasharray: length,
      strokeDashoffset: length
    })
  }
})
</script>
```

### Decorative Usage

```vue
<!-- Decorative line that draws on page load -->
<svg viewBox="0 0 100 50">
  <path
    ref="decorPath"
    d="M 0 25 Q 25 0 50 25 T 100 25"
    stroke="var(--primary-500)"
    stroke-width="2"
    fill="none"
  />
</svg>

<script setup>
const decorPath = ref()
const { draw } = useDrawOn()

onMounted(() => {
  draw(decorPath.value, { duration: 1.5, ease: 'power1.inOut' })
})
</script>
```

## Acceptance Criteria

- SVG paths animate from start to end
- Works with any path shape
- Progress bars update smoothly
- Reduced motion shows instant state
- Multiple paths can stagger

## Notes

Elegant way to show progress and add visual polish.
