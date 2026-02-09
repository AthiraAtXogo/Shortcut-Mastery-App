// Type definitions for Shortcut Mastery App

export interface Shortcut {
  id: string
  keys: string[]
  description: string
  category: string
  app: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface UserProgress {
  shortcutId: string
  masteryLevel: 'new' | 'learning' | 'familiar' | 'master'
  correctCount: number
  incorrectCount: number
  lastPracticed: Date
  nextReview: Date
}

export interface GameSession {
  mode: GameMode
  score: number
  streak: number
  startTime: Date
  endTime?: Date
}

export type GameMode =
  | 'practice'
  | 'flash-round'
  | 'speed-run'
  | 'survival'
  | 'time-attack'
  | 'daily-challenge'
  | 'rhythm'
  | 'memory-match'
  | 'type-mode'
  | 'blind'
  | 'boss-battle'
  | 'endless'
