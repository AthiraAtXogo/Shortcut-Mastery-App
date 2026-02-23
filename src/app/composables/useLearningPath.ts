import type { Shortcut } from '~/types/shortcut'
import type { MasteryLevel } from './useMastery'

/** Suggested learning paths based on mastery level, difficulty, and frequency */

export interface LearningPathItem {
  shortcut: Shortcut
  reason: string
  priority: number // Lower = higher priority
}

export interface LearningPath {
  name: string
  description: string
  items: LearningPathItem[]
}

const DIFFICULTY_ORDER: Record<string, number> = { easy: 0, medium: 1, hard: 2 }
const FREQUENCY_ORDER: Record<string, number> = { common: 0, occasional: 1, rare: 2 }
const MASTERY_ORDER: Record<MasteryLevel, number> = { new: 0, learning: 1, familiar: 2, master: 3 }

export function useLearningPath() {
  /**
   * Build a prioritised learning path.
   * Priority: new shortcuts first, then by frequency (common > occasional > rare),
   * then by difficulty (easy > medium > hard).
   */
  function buildPath(
    shortcuts: Shortcut[],
    masteryMap: Map<string, MasteryLevel>,
    options: {
      app?: string
      excludeMastered?: boolean
      limit?: number
    } = {}
  ): LearningPath {
    const { app, excludeMastered = true, limit = 20 } = options

    let pool = app ? shortcuts.filter(s => s.app === app) : shortcuts

    if (excludeMastered) {
      pool = pool.filter(s => masteryMap.get(s.id) !== 'master')
    }

    const items: LearningPathItem[] = pool.map((s) => {
      const mastery = masteryMap.get(s.id) ?? 'new'
      const masteryScore = MASTERY_ORDER[mastery]
      const diffScore = DIFFICULTY_ORDER[s.difficulty] ?? 1
      const freqScore = FREQUENCY_ORDER[s.frequency ?? 'occasional'] ?? 1

      // Priority: mastery × 100 + freq × 10 + difficulty
      const priority = masteryScore * 100 + freqScore * 10 + diffScore

      const reason = mastery === 'new'
        ? 'Never practiced — start here'
        : mastery === 'learning'
          ? 'Still learning — needs more repetition'
          : `Familiar but not mastered — ${s.frequency ?? 'occasional'} use`

      return { shortcut: s, reason, priority }
    })

    items.sort((a, b) => a.priority - b.priority)

    const limited = items.slice(0, limit)
    const label = app ? `${app} Learning Path` : 'Recommended Learning Path'

    return {
      name: label,
      description: `${limited.length} shortcuts ordered by priority — most impactful first`,
      items: limited
    }
  }

  /**
   * "Quick wins" path — easy shortcuts you haven't mastered yet.
   * Great for beginners or when time is short.
   */
  function quickWinsPath(
    shortcuts: Shortcut[],
    masteryMap: Map<string, MasteryLevel>,
    limit = 10
  ): LearningPath {
    const items = shortcuts
      .filter(s => s.difficulty === 'easy' && masteryMap.get(s.id) !== 'master')
      .filter(s => (s.frequency ?? 'occasional') === 'common')
      .slice(0, limit)
      .map((s, i) => ({
        shortcut: s,
        reason: 'Easy + common — highest impact for beginners',
        priority: i
      }))

    return {
      name: 'Quick Wins',
      description: `${items.length} easy, high-frequency shortcuts to master first`,
      items
    }
  }

  /**
   * "Challenge" path — hard shortcuts with low mastery.
   * For users who want to push their skills.
   */
  function challengePath(
    shortcuts: Shortcut[],
    masteryMap: Map<string, MasteryLevel>,
    limit = 10
  ): LearningPath {
    const items = shortcuts
      .filter(s => s.difficulty === 'hard' && (masteryMap.get(s.id) ?? 'new') !== 'master')
      .slice(0, limit)
      .map((s, i) => ({
        shortcut: s,
        reason: 'Hard shortcut — mastering this will set you apart',
        priority: i
      }))

    return {
      name: 'Challenge Mode',
      description: `${items.length} hard shortcuts to level up your skills`,
      items
    }
  }

  /**
   * "Review" path — shortcuts that are familiar but haven't been practiced recently.
   * Uses spaced repetition logic.
   */
  function reviewPath(
    shortcuts: Shortcut[],
    masteryMap: Map<string, MasteryLevel>,
    lastSeenMap: Map<string, Date | null>,
    limit = 15
  ): LearningPath {
    const now = Date.now()

    const items = shortcuts
      .filter((s) => {
        const mastery = masteryMap.get(s.id) ?? 'new'
        if (mastery === 'new') return false // Not yet started
        const lastSeen = lastSeenMap.get(s.id)
        if (!lastSeen) return true
        const daysSince = (now - lastSeen.getTime()) / 86400000
        return daysSince >= 1 // Due for review
      })
      .slice(0, limit)
      .map((s, i) => {
        const lastSeen = lastSeenMap.get(s.id)
        const days = lastSeen ? Math.floor((now - lastSeen.getTime()) / 86400000) : 999
        return {
          shortcut: s,
          reason: `Last practiced ${days === 999 ? 'never' : `${days}d ago`} — time to review`,
          priority: i
        }
      })

    return {
      name: 'Review Session',
      description: `${items.length} shortcuts due for review`,
      items
    }
  }

  return { buildPath, quickWinsPath, challengePath, reviewPath }
}
