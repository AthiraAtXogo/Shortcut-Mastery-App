# Task: Pinia State Management

## Objective

Set up Pinia stores for global state management.

## Requirements

- [ ] Configure Pinia with Nuxt
- [ ] Create game store (current game state)
- [ ] Create user store (XP, level, streaks)
- [ ] Create settings store (preferences)
- [ ] Create shortcuts store (loaded shortcuts)
- [ ] Sync with Dexie database

## Technical Details

### Stores Structure

```
stores/
├── game.ts       # Current game session state
├── user.ts       # User progress, XP, achievements
├── settings.ts   # App preferences
└── shortcuts.ts  # Shortcut data and categories
```

### Game Store

```typescript
export const useGameStore = defineStore('game', () => {
  const mode = ref<GameMode | null>(null)
  const currentShortcut = ref<Shortcut | null>(null)
  const score = ref(0)
  const combo = ref(0)
  const lives = ref(3)
  const timeRemaining = ref(0)
  const isPlaying = ref(false)
  const results = ref<GameResult[]>([])

  const startGame = (gameMode: GameMode) => { /* ... */ }
  const submitAnswer = (keys: string[]) => { /* ... */ }
  const nextShortcut = () => { /* ... */ }
  const endGame = () => { /* ... */ }

  return { mode, currentShortcut, score, combo, lives, timeRemaining, isPlaying, results, startGame, submitAnswer, nextShortcut, endGame }
})
```

### User Store

```typescript
export const useUserStore = defineStore('user', () => {
  const xp = ref(0)
  const level = ref(1)
  const currentStreak = ref(0)
  const achievements = ref<string[]>([])

  const addXP = (amount: number) => { /* ... */ }
  const checkLevelUp = () => { /* ... */ }
  const updateStreak = () => { /* ... */ }
  const unlockAchievement = (id: string) => { /* ... */ }

  // Sync with Dexie on changes
  watch([xp, level, currentStreak], () => {
    db.stats.put({ id: 'user', xp: xp.value, level: level.value, currentStreak: currentStreak.value })
  })

  return { xp, level, currentStreak, achievements, addXP, checkLevelUp, updateStreak, unlockAchievement }
})
```

## Acceptance Criteria

- All stores created and functional
- State persists via Dexie
- Reactivity works correctly
- Stores composable with each other

## Notes

Pinia + Dexie = reactive state that persists offline.
