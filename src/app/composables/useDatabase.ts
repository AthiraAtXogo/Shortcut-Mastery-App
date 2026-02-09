import { db, type DBShortcut, type DBUserProgress, type DBGameSession, type DBAchievement } from '~/data/db'

export function useDatabase() {
  // ============ Shortcuts ============

  async function getShortcuts(filters?: { app?: string; category?: string; difficulty?: string }) {
    let query = db.shortcuts.toCollection()

    if (filters?.app) {
      query = db.shortcuts.where('app').equals(filters.app)
    }

    const shortcuts = await query.toArray()

    // Apply additional filters in memory
    return shortcuts.filter((s) => {
      if (filters?.category && s.category !== filters.category) return false
      if (filters?.difficulty && s.difficulty !== filters.difficulty) return false
      return true
    })
  }

  async function getShortcutById(id: string) {
    return db.shortcuts.get(id)
  }

  async function saveShortcuts(shortcuts: DBShortcut[]) {
    await db.shortcuts.bulkPut(shortcuts)
  }

  // ============ Progress ============

  async function getProgress(shortcutId: string) {
    return db.progress.get(shortcutId)
  }

  async function getAllProgress() {
    return db.progress.toArray()
  }

  async function saveProgress(progress: DBUserProgress) {
    await db.progress.put(progress)
  }

  async function getDueForReview(limit?: number) {
    const now = new Date()
    let query = db.progress.where('nextReview').belowOrEqual(now)

    if (limit) {
      return query.limit(limit).toArray()
    }
    return query.toArray()
  }

  async function getProgressStats() {
    const all = await db.progress.toArray()

    const stats = {
      total: all.length,
      new: 0,
      learning: 0,
      familiar: 0,
      master: 0,
      totalCorrect: 0,
      totalIncorrect: 0
    }

    all.forEach((p) => {
      stats[p.masteryLevel]++
      stats.totalCorrect += p.correctCount
      stats.totalIncorrect += p.incorrectCount
    })

    return stats
  }

  // ============ Sessions ============

  async function saveSession(session: Omit<DBGameSession, 'id'>) {
    return db.sessions.add(session as DBGameSession)
  }

  async function getRecentSessions(limit: number = 10) {
    return db.sessions.orderBy('startTime').reverse().limit(limit).toArray()
  }

  async function getSessionStats() {
    const sessions = await db.sessions.toArray()

    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalScore: 0,
        bestScore: 0,
        averageAccuracy: 0,
        totalTimePlayed: 0
      }
    }

    const totalScore = sessions.reduce((sum, s) => sum + s.score, 0)
    const bestScore = Math.max(...sessions.map((s) => s.score))
    const averageAccuracy =
      sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length
    const totalTimePlayed = sessions.reduce(
      (sum, s) => sum + (s.endTime.getTime() - s.startTime.getTime()),
      0
    )

    return {
      totalSessions: sessions.length,
      totalScore,
      bestScore,
      averageAccuracy: Math.round(averageAccuracy * 100) / 100,
      totalTimePlayed
    }
  }

  // ============ Achievements ============

  async function getAchievements() {
    return db.achievements.toArray()
  }

  async function unlockAchievement(id: string) {
    const existing = await db.achievements.get(id)
    if (existing) return false

    await db.achievements.add({ id, unlockedAt: new Date() })
    return true
  }

  async function hasAchievement(id: string) {
    const achievement = await db.achievements.get(id)
    return !!achievement
  }

  // ============ Settings ============

  async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
    const setting = await db.settings.get(key)
    return (setting?.value as T) ?? defaultValue
  }

  async function setSetting<T>(key: string, value: T) {
    await db.settings.put({ key, value })
  }

  // ============ Utilities ============

  async function clearAllData() {
    await Promise.all([
      db.shortcuts.clear(),
      db.progress.clear(),
      db.sessions.clear(),
      db.achievements.clear(),
      db.settings.clear()
    ])
  }

  return {
    db,
    // Shortcuts
    getShortcuts,
    getShortcutById,
    saveShortcuts,
    // Progress
    getProgress,
    getAllProgress,
    saveProgress,
    getDueForReview,
    getProgressStats,
    // Sessions
    saveSession,
    getRecentSessions,
    getSessionStats,
    // Achievements
    getAchievements,
    unlockAchievement,
    hasAchievement,
    // Settings
    getSetting,
    setSetting,
    // Utilities
    clearAllData
  }
}
