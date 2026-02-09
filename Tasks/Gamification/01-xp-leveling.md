# Task: XP and Leveling System

## Objective

Create an XP-based progression system with levels that unlock content.

## Requirements

- [ ] XP gain on correct answers
- [ ] Level calculation formula
- [ ] Level-up detection and celebration
- [ ] XP history tracking
- [ ] Content unlocks per level

## XP Sources

| Action | Base XP | Modifiers |
|--------|---------|-----------|
| Correct answer | 10 | +speed bonus |
| Perfect timing | 25 | - |
| Streak milestone (5, 10, 20) | 50, 100, 200 | - |
| Daily challenge complete | 100 | - |
| Boss defeated | 250 | - |
| Achievement unlocked | varies | - |

## Level Formula

```typescript
// XP required for level N
const xpForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.5))
}

// Level from total XP
const levelFromXP = (xp: number): number => {
  let level = 1
  let totalRequired = 0
  while (totalRequired + xpForLevel(level) <= xp) {
    totalRequired += xpForLevel(level)
    level++
  }
  return level
}
```

## Implementation

```typescript
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  const xp = ref(0)
  const level = computed(() => levelFromXP(xp.value))

  const xpForCurrentLevel = computed(() => {
    let total = 0
    for (let i = 1; i < level.value; i++) {
      total += xpForLevel(i)
    }
    return xp.value - total
  })

  const xpToNextLevel = computed(() => xpForLevel(level.value))

  const levelProgress = computed(() =>
    xpForCurrentLevel.value / xpToNextLevel.value
  )

  const addXP = async (amount: number, source: string) => {
    const previousLevel = level.value
    xp.value += amount

    // Log XP gain
    await db.xpHistory.add({
      amount,
      source,
      timestamp: new Date(),
      totalXP: xp.value
    })

    // Check level up
    if (level.value > previousLevel) {
      emit('levelUp', { newLevel: level.value, previousLevel })
    }

    // Persist
    await db.stats.update('user', { xp: xp.value })
  }

  return { xp, level, xpForCurrentLevel, xpToNextLevel, levelProgress, addXP }
})
```

## Level Unlocks

| Level | Unlock |
|-------|--------|
| 1 | Practice, Flash Round |
| 5 | Speed Run |
| 10 | Survival, Time Attack |
| 15 | Daily Challenge |
| 20 | Rhythm Mode |
| 25 | Memory Match |
| 30 | Blind Mode |
| 40 | Boss Battle |
| 50 | Endless Mode |

## Acceptance Criteria

- XP gained correctly
- Level calculated accurately
- Level-up triggers celebration
- Progress bar accurate
- Unlocks work per level
- XP persists across sessions
