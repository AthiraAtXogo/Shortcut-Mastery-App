# Task: Speed Run Mode

## Objective

Complete 10 shortcuts as fast as possible. Compete against your best time.

## Requirements

- [ ] 10 shortcuts per run
- [ ] Total timer (counts up)
- [ ] No per-shortcut time limit
- [ ] Track personal best
- [ ] Wrong answer adds time penalty
- [ ] Show progress (3/10)

## Game Flow

```
1. Countdown 3-2-1-GO
2. Start timer
3. Show first shortcut
4. User presses shortcut
5. Correct: Next shortcut immediately
6. Wrong: +2 second penalty, can retry
7. After 10: Stop timer, show results
8. Compare to personal best
```

## Scoring

- Base XP: 100 for completion
- Time bonus: Extra XP for fast times
- Accuracy bonus: Extra XP for no mistakes
- Personal best bonus: +50 XP if new record

## Implementation

```typescript
export function useSpeedRun() {
  const totalShortcuts = 10
  const currentIndex = ref(0)
  const elapsedTime = ref(0)
  const penalties = ref(0)
  const mistakes = ref(0)
  const personalBest = ref<number | null>(null)

  const totalTime = computed(() => elapsedTime.value + penalties.value * 2000)

  const start = async () => {
    shortcuts.value = await getRandomShortcuts(totalShortcuts)
    currentIndex.value = 0
    elapsedTime.value = 0
    penalties.value = 0
    mistakes.value = 0

    // Load personal best
    personalBest.value = await getPersonalBest('speed-run')

    // 3-2-1 countdown then start
    await countdown()
    startTimer()
  }

  const submitAnswer = (pressedKeys: string[]) => {
    const result = validateCombo(pressedKeys, currentShortcut.value.keys)

    if (result.isCorrect) {
      currentIndex.value++

      if (currentIndex.value >= totalShortcuts) {
        finishRun()
      }
      return { correct: true }
    }

    mistakes.value++
    penalties.value++
    return { correct: false, penalty: 2000 }
  }

  const finishRun = async () => {
    stopTimer()

    const isNewBest = !personalBest.value || totalTime.value < personalBest.value

    if (isNewBest) {
      await savePersonalBest('speed-run', totalTime.value)
    }

    return {
      time: totalTime.value,
      mistakes: mistakes.value,
      isNewBest,
      xp: calculateXP()
    }
  }
}
```

## Acceptance Criteria

- 10 shortcuts per run
- Timer visible and accurate
- Wrong answers add penalty
- Personal best tracked
- New record celebrated
- Results screen shows stats
