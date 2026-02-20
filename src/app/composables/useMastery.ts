import type { Shortcut } from '~/types/shortcut'

/** Per-shortcut mastery tracking */

export type MasteryLevel = 'new' | 'learning' | 'familiar' | 'master'

export interface ShortcutMastery {
  shortcutId: string
  level: MasteryLevel
  correctCount: number
  incorrectCount: number
  lastSeen: Date | null
  /** Times this shortcut was answered correctly in a row */
  currentStreak: number
}

const MASTERY_THRESHOLDS: Record<MasteryLevel, { correct: number, streak: number }> = {
  new: { correct: 0, streak: 0 },
  learning: { correct: 1, streak: 0 },
  familiar: { correct: 5, streak: 3 },
  master: { correct: 15, streak: 7 }
}

function computeMasteryLevel(m: ShortcutMastery): MasteryLevel {
  if (
    m.correctCount >= MASTERY_THRESHOLDS.master.correct
    && m.currentStreak >= MASTERY_THRESHOLDS.master.streak
  ) return 'master'

  if (
    m.correctCount >= MASTERY_THRESHOLDS.familiar.correct
    && m.currentStreak >= MASTERY_THRESHOLDS.familiar.streak
  ) return 'familiar'

  if (m.correctCount >= MASTERY_THRESHOLDS.learning.correct) return 'learning'

  return 'new'
}

export function useMastery() {
  // #region state
  const masteryMap = ref<Map<string, ShortcutMastery>>(new Map())
  // #endregion

  // #region computed
  const masteredCount = computed(() => {
    let count = 0
    masteryMap.value.forEach((m) => {
      if (m.level === 'master') count++
    })
    return count
  })

  const stats = computed(() => {
    const result = { new: 0, learning: 0, familiar: 0, master: 0 }
    masteryMap.value.forEach(m => result[m.level]++)
    return result
  })

  const masteryPercent = computed(() => {
    const total = masteryMap.value.size
    if (total === 0) return 0
    return Math.round((masteredCount.value / total) * 100)
  })
  // #endregion

  // #region methods
  function getOrCreate(shortcutId: string): ShortcutMastery {
    if (!masteryMap.value.has(shortcutId)) {
      masteryMap.value.set(shortcutId, {
        shortcutId,
        level: 'new',
        correctCount: 0,
        incorrectCount: 0,
        lastSeen: null,
        currentStreak: 0
      })
    }
    return masteryMap.value.get(shortcutId)!
  }

  function recordCorrect(shortcutId: string): MasteryLevel {
    const m = getOrCreate(shortcutId)
    m.correctCount++
    m.currentStreak++
    m.lastSeen = new Date()
    m.level = computeMasteryLevel(m)
    masteryMap.value.set(shortcutId, m)
    return m.level
  }

  function recordIncorrect(shortcutId: string): MasteryLevel {
    const m = getOrCreate(shortcutId)
    m.incorrectCount++
    m.currentStreak = 0
    m.lastSeen = new Date()
    // Demote one level if above 'learning'
    if (m.level === 'master') m.level = 'familiar'
    else if (m.level === 'familiar') m.level = 'learning'
    masteryMap.value.set(shortcutId, m)
    return m.level
  }

  function getMastery(shortcutId: string): ShortcutMastery | null {
    return masteryMap.value.get(shortcutId) ?? null
  }

  function getMasteryLevel(shortcutId: string): MasteryLevel {
    return masteryMap.value.get(shortcutId)?.level ?? 'new'
  }

  /**
   * Returns shortcuts sorted by priority for practice:
   * new > learning > familiar (master last)
   */
  function prioritizedShortcuts(shortcuts: Shortcut[]): Shortcut[] {
    const priority: Record<MasteryLevel, number> = {
      new: 0,
      learning: 1,
      familiar: 2,
      master: 3
    }
    return [...shortcuts].sort((a, b) => {
      const ma = getMasteryLevel(a.id)
      const mb = getMasteryLevel(b.id)
      return priority[ma] - priority[mb]
    })
  }

  function loadAll(records: ShortcutMastery[]) {
    const map = new Map<string, ShortcutMastery>()
    records.forEach(r => map.set(r.shortcutId, r))
    masteryMap.value = map
  }

  function getAllMastery(): ShortcutMastery[] {
    return Array.from(masteryMap.value.values())
  }
  // #endregion

  return {
    masteryMap: readonly(masteryMap),
    masteredCount,
    stats,
    masteryPercent,
    getOrCreate,
    recordCorrect,
    recordIncorrect,
    getMastery,
    getMasteryLevel,
    prioritizedShortcuts,
    loadAll,
    getAllMastery
  }
}
