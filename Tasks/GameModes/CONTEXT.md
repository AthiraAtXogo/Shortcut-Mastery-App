# GameModes - Feature Context

## Purpose

Implement all 12 game modes that make learning shortcuts fun and engaging.

## Dependencies

- KeyboardInput (all tasks)
- Core/06-dexie-database
- Gamification (for scoring)

## Tasks Overview

| Task | Description | Difficulty |
|------|-------------|------------|
| 01-practice | No-pressure learning mode | Easy |
| 02-flash-round | Single shortcut, timed | Easy |
| 03-speed-run | 10 shortcuts, fastest time | Medium |
| 04-survival | Until 3 mistakes | Medium |
| 05-time-attack | Max in 60 seconds | Medium |
| 06-daily-challenge | Curated daily shortcuts | Medium |
| 07-rhythm-mode | Beat-synced gameplay | Medium |
| 08-memory-match | Card matching game | Medium |
| 09-type-mode | Type shortcut letters | Medium |
| 10-blind-mode | No visual keyboard | Hard |
| 11-boss-battle | Combo chains vs bosses | Hard |
| 12-endless | Infinite scaling | Variable |

## Game Mode Architecture

Each mode should:
1. Extend a base GameMode class/composable
2. Implement start(), pause(), resume(), end()
3. Track its own scoring rules
4. Emit events for UI updates
