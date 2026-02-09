# Task: Practice Mode

## Objective

Create a no-pressure learning mode where users can practice shortcuts without time limits or scoring.

## Requirements

- [ ] No timer or time pressure
- [ ] Show shortcut hint on demand
- [ ] Track attempts but don't penalize
- [ ] Option to skip shortcuts
- [ ] Filter by category/difficulty
- [ ] Show correct answer after attempts

## Game Flow

```
1. Select category (or all)
2. Show shortcut action
3. User attempts (unlimited tries)
4. Show hint after 2 wrong attempts
5. Show answer after 5 wrong attempts
6. Move to next (or user skips)
7. End when user quits or completes set
```

## Implementation

```typescript
// composables/usePracticeMode.ts
export function usePracticeMode() {
  const shortcuts = ref<Shortcut[]>([])
  const currentIndex = ref(0)
  const attempts = ref(0)
  const showHint = ref(false)
  const showAnswer = ref(false)

  const currentShortcut = computed(() => shortcuts.value[currentIndex.value])

  const start = async (options: { category?: string; difficulty?: string }) => {
    shortcuts.value = await loadShortcuts(options)
    currentIndex.value = 0
    attempts.value = 0
  }

  const submitAnswer = (pressedKeys: string[]) => {
    const result = validateCombo(pressedKeys, currentShortcut.value.keys)

    if (result.isCorrect) {
      // Success feedback
      return { correct: true }
    }

    attempts.value++

    if (attempts.value >= 2) showHint.value = true
    if (attempts.value >= 5) showAnswer.value = true

    return { correct: false, attempts: attempts.value }
  }

  const next = () => {
    currentIndex.value++
    attempts.value = 0
    showHint.value = false
    showAnswer.value = false
  }

  const skip = () => next()

  return {
    currentShortcut,
    attempts,
    showHint,
    showAnswer,
    start,
    submitAnswer,
    next,
    skip
  }
}
```

## Acceptance Criteria

- No time pressure
- Hints show after 2 attempts
- Answer shows after 5 attempts
- Can skip any shortcut
- Can filter shortcuts
- Relaxed, learning-focused experience
