# Gamification - Feature Context

## Purpose

Implement XP, levels, streaks, achievements, and other engagement systems that make learning addictive.

## Dependencies

- Core/06-dexie-database
- Core/07-state-management

## Tasks Overview

| Task | Description | Priority |
|------|-------------|----------|
| 01-xp-leveling | XP gain and level progression | P0 |
| 02-streak-system | Daily streak tracking | P0 |
| 03-achievements | Badges and unlockables | P1 |
| 04-combo-multiplier | Combo scoring system | P0 |
| 05-mastery-levels | Per-shortcut mastery | P1 |
| 06-spaced-repetition | SM-2 algorithm for review | P1 |

## XP Formula

```
Base XP per correct answer: 10
Time bonus: +5 to +25 based on speed
Streak multiplier: x1 to x3
Combo bonus: +5 per combo level
```

## Level Progression

| Level | Total XP | Unlock |
|-------|----------|--------|
| 1-10 | 0-1,000 | Basic modes |
| 11-25 | 1,000-5,000 | Advanced modes |
| 26-50 | 5,000-15,000 | All content |
| 51-100 | 15,000-50,000 | Prestige badges |
