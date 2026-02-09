# Task: Counter Roll Effect

## Objective

Create a slot machine style number rolling animation for scores and XP.

## Requirements

- [ ] Create useCounterRoll composable
- [ ] Animate from current to target number
- [ ] Support formatting (commas, decimals)
- [ ] Configurable duration and easing
- [ ] Support reduced motion

## Technical Details

### Implementation

```typescript
// composables/useCounterRoll.ts
import { gsap } from 'gsap'

interface CounterOptions {
  duration?: number
  ease?: string
  format?: (n: number) => string
}

export function useCounterRoll() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const roll = (
    element: HTMLElement,
    from: number,
    to: number,
    options: CounterOptions = {}
  ) => {
    const {
      duration = 1,
      ease = 'power2.out',
      format = (n: number) => Math.round(n).toLocaleString()
    } = options

    if (prefersReducedMotion.value) {
      element.textContent = format(to)
      return Promise.resolve()
    }

    return new Promise<void>(resolve => {
      gsap.fromTo(
        { value: from },
        { value: to },
        {
          duration,
          ease,
          onUpdate: function() {
            element.textContent = format(this.targets()[0].value)
          },
          onComplete: resolve
        }
      )
    })
  }

  return { roll }
}
```

### Vue Component

```vue
<template>
  <span ref="counterRef">{{ formattedValue }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: number
  duration?: number
  prefix?: string
  suffix?: string
}>()

const counterRef = ref<HTMLElement>()
const currentValue = ref(0)
const { roll } = useCounterRoll()

const formattedValue = computed(() => {
  const num = Math.round(currentValue.value).toLocaleString()
  return `${props.prefix ?? ''}${num}${props.suffix ?? ''}`
})

watch(() => props.value, async (newVal, oldVal) => {
  if (counterRef.value) {
    await roll(counterRef.value, oldVal ?? 0, newVal, {
      duration: props.duration
    })
    currentValue.value = newVal
  }
}, { immediate: true })
</script>
```

### Usage

```vue
<CounterRoll :value="userXP" prefix="⭐ " suffix=" XP" :duration="0.8" />
```

## Acceptance Criteria

- Numbers roll smoothly from old to new
- Formatting preserved during animation
- Works with large numbers
- Reduced motion shows instant change
- No flickering

## Notes

Essential for XP gains, scores, and statistics.
