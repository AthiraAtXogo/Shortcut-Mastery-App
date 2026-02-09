# Task: Flash Round Mode

## Objective

Quick single-shortcut challenges with a 3-second timer per shortcut.

## Requirements

- [ ] 3 second timer per shortcut
- [ ] Visual countdown
- [ ] Instant feedback on answer
- [ ] Streak tracking
- [ ] XP based on speed
- [ ] Continue until quit

## Game Flow

```
1. Show shortcut action
2. Start 3-second timer
3. User presses shortcut
4. If correct before timeout: Success + XP bonus for speed
5. If wrong or timeout: Fail + streak reset
6. Brief pause, then next shortcut
7. Continue until user quits
```

## Scoring

| Result | XP | Notes |
|--------|-------|-------|
| Correct < 1s | 75 | Speed bonus |
| Correct < 2s | 50 | Normal |
| Correct < 3s | 25 | Slow |
| Wrong/Timeout | 0 | Streak breaks |

Streak multiplier: x1.5 at 5, x2 at 10, x3 at 20

## Implementation

```typescript
export function useFlashRound() {
  const timeLimit = 3000 // 3 seconds
  const timeRemaining = ref(timeLimit)
  const isActive = ref(false)

  const startRound = () => {
    timeRemaining.value = timeLimit
    isActive.value = true

    // Countdown
    const interval = setInterval(() => {
      timeRemaining.value -= 100
      if (timeRemaining.value <= 0) {
        clearInterval(interval)
        onTimeout()
      }
    }, 100)
  }

  const submitAnswer = (pressedKeys: string[]) => {
    if (!isActive.value) return

    const elapsed = timeLimit - timeRemaining.value
    const result = validateCombo(pressedKeys, currentShortcut.value.keys)

    isActive.value = false

    if (result.isCorrect) {
      const xp = calculateXP(elapsed)
      return { correct: true, xp, timing: elapsed }
    }

    return { correct: false, timing: elapsed }
  }

  const calculateXP = (elapsed: number): number => {
    if (elapsed < 1000) return 75
    if (elapsed < 2000) return 50
    return 25
  }
}
```

## Acceptance Criteria

- Timer counts down visually
- Fast answers get more XP
- Timeout counts as wrong
- Streak multiplier works
- Satisfying feedback on correct
- Can play indefinitely
