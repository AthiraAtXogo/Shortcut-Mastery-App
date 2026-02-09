# Task: Streak System

## Objective

Track daily play streaks to encourage consistent practice.

## Requirements

- [ ] Detect daily play
- [ ] Increment streak on consecutive days
- [ ] Reset streak on missed day
- [ ] Streak freeze item (optional)
- [ ] Streak milestones with rewards
- [ ] Visual streak display

## Streak Logic

```typescript
const updateStreak = async () => {
  const today = new Date().toISOString().split('T')[0]
  const lastPlayed = await db.stats.get('lastPlayedDate')

  if (!lastPlayed) {
    // First time playing
    await db.stats.update('user', {
      currentStreak: 1,
      lastPlayedDate: today
    })
    return
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  if (lastPlayed === today) {
    // Already played today
    return
  }

  if (lastPlayed === yesterday) {
    // Consecutive day!
    const newStreak = (await db.stats.get('currentStreak')) + 1
    await db.stats.update('user', {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, await db.stats.get('longestStreak')),
      lastPlayedDate: today
    })

    checkStreakMilestone(newStreak)
  } else {
    // Streak broken
    await db.stats.update('user', {
      currentStreak: 1,
      lastPlayedDate: today
    })
  }
}
```

## Streak Milestones

| Streak | Reward |
|--------|--------|
| 3 days | +50 XP |
| 7 days | +100 XP, "Week Warrior" badge |
| 14 days | +200 XP |
| 30 days | +500 XP, "Monthly Master" badge |
| 100 days | +1000 XP, "Century" badge |
| 365 days | "Year of Mastery" badge |

## Streak Multiplier

Applies to all XP gains:

| Streak | Multiplier |
|--------|------------|
| 1-2 | x1.0 |
| 3-6 | x1.1 |
| 7-13 | x1.25 |
| 14-29 | x1.5 |
| 30+ | x2.0 |

## Acceptance Criteria

- Streak increments on consecutive days
- Streak resets on missed day
- Milestones trigger rewards
- Multiplier applies correctly
- Visual indicator shows streak
- Longest streak tracked
