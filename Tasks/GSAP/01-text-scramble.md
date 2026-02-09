# Task: Text Scramble Effect

## Objective

Create a Matrix-style text scramble effect where characters scramble before revealing the final text.

## Requirements

- [ ] Create useTextScramble composable
- [ ] Scramble through random characters
- [ ] Reveal final text letter by letter
- [ ] Configurable speed and character set
- [ ] Support reduced motion (instant reveal)

## Technical Details

### Implementation

```typescript
// composables/useTextScramble.ts
import { gsap } from 'gsap'

interface ScrambleOptions {
  duration?: number
  characters?: string
  delimiter?: string
}

export function useTextScramble() {
  const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const scramble = (
    element: HTMLElement,
    finalText: string,
    options: ScrambleOptions = {}
  ) => {
    const { duration = 1, characters = defaultChars } = options

    if (prefersReducedMotion.value) {
      element.textContent = finalText
      return Promise.resolve()
    }

    return new Promise<void>(resolve => {
      const length = finalText.length
      const chars = characters.split('')
      let progress = 0

      const update = () => {
        let text = ''
        for (let i = 0; i < length; i++) {
          if (i < progress) {
            text += finalText[i]
          } else {
            text += chars[Math.floor(Math.random() * chars.length)]
          }
        }
        element.textContent = text
      }

      gsap.to({ progress: 0 }, {
        progress: length,
        duration,
        ease: 'none',
        onUpdate: function() {
          progress = this.targets()[0].progress
          update()
        },
        onComplete: () => {
          element.textContent = finalText
          resolve()
        }
      })
    })
  }

  return { scramble }
}
```

### Vue Component Wrapper

```vue
<template>
  <span ref="textRef">{{ displayText }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string
  trigger?: boolean
  duration?: number
}>()

const textRef = ref<HTMLElement>()
const displayText = ref('')
const { scramble } = useTextScramble()

watch(() => props.trigger, async (shouldTrigger) => {
  if (shouldTrigger && textRef.value) {
    await scramble(textRef.value, props.text, { duration: props.duration })
  }
})
</script>
```

### Usage

```vue
<TextScramble text="CORRECT!" :trigger="showResult" :duration="0.5" />
```

## Acceptance Criteria

- Text scrambles through random characters
- Final text reveals letter by letter
- Duration is configurable
- Reduced motion shows instant text
- No memory leaks

## Notes

Use for scores, timer displays, and result announcements.
