# Task: IndexedDB with Dexie.js

## Objective

Set up Dexie.js as the IndexedDB wrapper for local data persistence.

## Requirements

- [ ] Install Dexie.js
- [ ] Design database schema
- [ ] Create database instance
- [ ] Set up tables for all data types
- [ ] Create CRUD composables
- [ ] Handle migrations

## Technical Details

### Dependencies

```bash
pnpm add dexie
```

### Database Schema

```typescript
// db.ts
import Dexie, { type Table } from 'dexie'

export interface Shortcut {
  id: string
  app: string
  category: string
  action: string
  keys: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface UserProgress {
  shortcutId: string
  masteryLevel: 'new' | 'learning' | 'familiar' | 'mastered'
  correctCount: number
  wrongCount: number
  lastPracticed: Date
  nextReview: Date
}

export interface GameSession {
  id: string
  mode: string
  startedAt: Date
  completedAt: Date
  score: number
  accuracy: number
  shortcuts: string[]
}

export interface UserStats {
  id: string
  xp: number
  level: number
  currentStreak: number
  longestStreak: number
  lastPlayedDate: string
  totalSessions: number
  totalCorrect: number
  achievements: string[]
}

export interface Settings {
  id: string
  soundEnabled: boolean
  volume: number
  reducedMotion: boolean
  theme: 'dark' | 'light'
  difficulty: 'easy' | 'medium' | 'hard'
}

export class ShortcutMasteryDB extends Dexie {
  shortcuts!: Table<Shortcut>
  progress!: Table<UserProgress>
  sessions!: Table<GameSession>
  stats!: Table<UserStats>
  settings!: Table<Settings>

  constructor() {
    super('ShortcutMasteryDB')
    this.version(1).stores({
      shortcuts: 'id, app, category, difficulty',
      progress: 'shortcutId, masteryLevel, nextReview',
      sessions: 'id, mode, startedAt',
      stats: 'id',
      settings: 'id'
    })
  }
}

export const db = new ShortcutMasteryDB()
```

## Acceptance Criteria

- Database initializes on app load
- All tables created correctly
- CRUD operations work
- Data persists across sessions
- Works offline

## Notes

All user progress is stored locally - no backend needed.
