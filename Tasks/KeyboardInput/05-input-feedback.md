# Task: Input Feedback System

## Objective

Provide immediate visual and audio feedback when keys are pressed.

## Requirements

- [ ] Create useInputFeedback composable
- [ ] Visual feedback on key press
- [ ] Audio feedback (click sound)
- [ ] Different feedback for correct/wrong
- [ ] Haptic feedback (if supported)
- [ ] Configurable intensity

## Technical Details

### Feedback Types

| Event | Visual | Audio | Haptic |
|-------|--------|-------|--------|
| Key press | Key lights up | Soft click | Light tap |
| Correct combo | Green glow + explosion | Success sound | Strong tap |
| Wrong combo | Red flash + shake | Error sound | Double tap |
| Partial correct | Key stays lit | None | None |

### Implementation

```typescript
// composables/useInputFeedback.ts

interface FeedbackOptions {
  sound?: boolean
  visual?: boolean
  haptic?: boolean
}

export function useInputFeedback() {
  const { play } = useAudio()
  const { bounce } = useElasticBounce()
  const { shakeAndFlash } = useShakeFlash()

  const settings = useSettingsStore()

  const onKeyPress = (key: string, element?: HTMLElement) => {
    if (settings.soundEnabled) {
      play('click')
    }

    if (element) {
      gsap.fromTo(element,
        { scale: 0.9, backgroundColor: 'var(--primary-500)' },
        { scale: 1, backgroundColor: 'var(--bg-tertiary)', duration: 0.2 }
      )
    }

    // Haptic (mobile)
    if (settings.hapticEnabled && navigator.vibrate) {
      navigator.vibrate(10)
    }
  }

  const onCorrect = async (element?: HTMLElement) => {
    if (settings.soundEnabled) {
      play('correct')
    }

    if (element) {
      // Green glow
      gsap.to(element, {
        boxShadow: '0 0 30px var(--success-500)',
        duration: 0.2,
        yoyo: true,
        repeat: 1
      })
    }

    // Haptic
    if (settings.hapticEnabled && navigator.vibrate) {
      navigator.vibrate([50, 50, 50])
    }

    // Trigger explosion effect
    // (handled by Three.js layer)
  }

  const onWrong = async (element?: HTMLElement) => {
    if (settings.soundEnabled) {
      play('wrong')
    }

    if (element) {
      await shakeAndFlash(element)
    }

    // Haptic
    if (settings.hapticEnabled && navigator.vibrate) {
      navigator.vibrate([100, 50, 100])
    }
  }

  const onCombo = (comboLevel: number) => {
    if (settings.soundEnabled) {
      play('combo')
    }

    // Combo-specific visual handled elsewhere
  }

  const onStreak = (streakLevel: number) => {
    if (streakLevel % 5 === 0 && settings.soundEnabled) {
      play('streak')
    }
  }

  return {
    onKeyPress,
    onCorrect,
    onWrong,
    onCombo,
    onStreak
  }
}
```

### Integration with Visual Keyboard

```vue
<script setup>
const { pressedKeys } = useKeyCapture()
const { onKeyPress } = useInputFeedback()
const keyRefs = ref<Map<string, HTMLElement>>(new Map())

watch(pressedKeys, (newKeys, oldKeys) => {
  // Find newly pressed keys
  const newlyPressed = [...newKeys].filter(k => !oldKeys?.has(k))

  newlyPressed.forEach(key => {
    const element = keyRefs.value.get(key)
    onKeyPress(key, element)
  })
})
</script>
```

### Sound Variations

```typescript
// Different sounds based on context
const playKeySound = (key: string) => {
  // Modifier keys have different sound
  const isModifier = ['Ctrl', 'Shift', 'Alt', 'Cmd'].includes(key)

  if (isModifier) {
    play('click-soft')
  } else {
    play('click')
  }
}
```

## Acceptance Criteria

- Every key press has feedback
- Feedback respects user settings
- Correct/wrong feedback distinct
- No lag between press and feedback
- Haptic works on mobile
- Feedback can be disabled

## Notes

Immediate feedback is crucial for game feel - must be instant.
