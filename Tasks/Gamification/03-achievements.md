# Task: Achievement System

## Objective

Create a badge/achievement system to reward milestones and special accomplishments.

## Requirements

- [ ] Achievement definitions
- [ ] Progress tracking per achievement
- [ ] Unlock detection
- [ ] Notification on unlock
- [ ] Achievement gallery UI
- [ ] Rarity tiers

## Achievement Categories

| Category | Examples |
|----------|----------|
| Progress | First shortcut, 100 correct, 1000 correct |
| Streaks | 7-day, 30-day, 100-day streak |
| Speed | Sub-1s answer, Speed Run record |
| Mastery | Master 10 shortcuts, Master all VS Code |
| Modes | Beat boss, Perfect rhythm run |
| Special | Night owl, Early bird, Weekend warrior |

## Achievement Data Structure

```typescript
interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  xpReward: number
  condition: AchievementCondition
  secret?: boolean  // Hidden until unlocked
}

interface AchievementCondition {
  type: 'count' | 'streak' | 'time' | 'special'
  metric: string
  target: number
}

// Example achievements
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first shortcut',
    icon: '👶',
    rarity: 'common',
    xpReward: 25,
    condition: { type: 'count', metric: 'totalCorrect', target: 1 }
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Answer in under 0.5 seconds',
    icon: '⚡',
    rarity: 'rare',
    xpReward: 100,
    condition: { type: 'time', metric: 'fastestAnswer', target: 500 }
  },
  {
    id: 'boss-slayer',
    name: 'Boss Slayer',
    description: 'Defeat your first boss',
    icon: '⚔️',
    rarity: 'epic',
    xpReward: 250,
    condition: { type: 'count', metric: 'bossesDefeated', target: 1 }
  }
]
```

## Implementation

```typescript
// composables/useAchievements.ts
export function useAchievements() {
  const unlockedIds = ref<string[]>([])

  const checkAchievements = async (metrics: Record<string, number>) => {
    const newUnlocks: Achievement[] = []

    for (const achievement of ACHIEVEMENTS) {
      if (unlockedIds.value.includes(achievement.id)) continue

      const { condition } = achievement
      const value = metrics[condition.metric]

      if (value !== undefined && meetsCondition(value, condition)) {
        newUnlocks.push(achievement)
        unlockedIds.value.push(achievement.id)
      }
    }

    // Process unlocks
    for (const achievement of newUnlocks) {
      await unlockAchievement(achievement)
    }

    return newUnlocks
  }

  const unlockAchievement = async (achievement: Achievement) => {
    // Save to DB
    await db.achievements.add({
      achievementId: achievement.id,
      unlockedAt: new Date()
    })

    // Award XP
    const userStore = useUserStore()
    await userStore.addXP(achievement.xpReward, `achievement:${achievement.id}`)

    // Notification
    showAchievementNotification(achievement)

    // Confetti!
    const { burst } = useConfetti()
    burst({ count: 60 })
  }
}
```

## Acceptance Criteria

- Achievements unlock correctly
- Notification appears on unlock
- XP awarded on unlock
- Gallery shows all achievements
- Progress visible for incomplete
- Secret achievements hidden until unlocked
