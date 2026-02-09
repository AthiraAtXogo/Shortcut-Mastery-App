import Dexie, { type EntityTable } from 'dexie'

// Database types
export interface DBShortcut {
  id: string
  keys: string[]
  description: string
  category: string
  app: string
  difficulty: 'easy' | 'medium' | 'hard'
  mnemonic?: string
}

export interface DBUserProgress {
  shortcutId: string
  masteryLevel: 'new' | 'learning' | 'familiar' | 'master'
  correctCount: number
  incorrectCount: number
  lastPracticed: Date
  nextReview: Date
  easeFactor: number // For spaced repetition
}

export interface DBGameSession {
  id?: number
  mode: string
  score: number
  streak: number
  accuracy: number
  startTime: Date
  endTime: Date
  shortcutsAttempted: number
  shortcutsCorrect: number
}

export interface DBAchievement {
  id: string
  unlockedAt: Date
}

export interface DBSettings {
  key: string
  value: unknown
}

// Create database instance
const db = new Dexie('ShortcutMasteryDB') as Dexie & {
  shortcuts: EntityTable<DBShortcut, 'id'>
  progress: EntityTable<DBUserProgress, 'shortcutId'>
  sessions: EntityTable<DBGameSession, 'id'>
  achievements: EntityTable<DBAchievement, 'id'>
  settings: EntityTable<DBSettings, 'key'>
}

// Define schema
db.version(1).stores({
  shortcuts: 'id, app, category, difficulty',
  progress: 'shortcutId, masteryLevel, nextReview',
  sessions: '++id, mode, startTime',
  achievements: 'id, unlockedAt',
  settings: 'key'
})

export { db }
