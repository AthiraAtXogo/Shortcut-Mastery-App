import type { Shortcut } from '~/types/shortcut'

/** Analyse user performance to identify weak areas and generate recommendations */

export interface ShortcutStats {
  shortcutId: string
  app: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  keys: string[]
  accuracy: number // 0–1
  avgTimeMs: number // average answer time in ms
  totalAttempts: number
  lastPracticed: number // timestamp ms
}

export interface WeaknessPattern {
  type: 'modifier' | 'app' | 'complexity' | 'category'
  description: string
  shortcutIds: string[]
  severity: number // 0–1, higher = worse
}

export interface WeaknessReport {
  overallAccuracy: number
  weakestShortcuts: Array<{ shortcutId: string, score: number }>
  patterns: WeaknessPattern[]
  strengths: string[]
  recommendations: string[]
}

/** Weakness score formula from task spec — higher = needs more practice */
export function calculateWeaknessScore(stats: ShortcutStats): number {
  let score = 0

  // Low accuracy = high weakness (weight: 40)
  score += (1 - stats.accuracy) * 40

  // Slow speed = weakness — normalised to 3000ms max (weight: 20)
  const speedScore = Math.min(stats.avgTimeMs / 3000, 1)
  score += speedScore * 20

  // Haven't practiced recently = weakness (weight: 20)
  const daysSince = (Date.now() - stats.lastPracticed) / 86400000
  score += Math.min(daysSince / 7, 1) * 20

  // Hard difficulty + low accuracy = extra weakness (weight: 20)
  if (stats.difficulty === 'hard' && stats.accuracy < 0.7) {
    score += 20
  }

  return Math.min(score, 100)
}

function average(nums: number[]): number {
  if (nums.length === 0) return 0
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>()
  items.forEach((item) => {
    const k = key(item)
    if (!map.has(k)) map.set(k, [])
    map.get(k)!.push(item)
  })
  return map
}

export function useWeaknessAnalysis() {
  function analyzePatterns(stats: ShortcutStats[]): WeaknessPattern[] {
    const patterns: WeaknessPattern[] = []

    // By app
    const byApp = groupBy(stats, s => s.app)
    byApp.forEach((group, app) => {
      const avg = average(group.map(s => s.accuracy))
      if (avg < 0.7) {
        patterns.push({
          type: 'app',
          description: `Need more practice with ${app} shortcuts (${Math.round(avg * 100)}% accuracy)`,
          shortcutIds: group.map(s => s.shortcutId),
          severity: 1 - avg
        })
      }
    })

    // By modifier combination (Ctrl+Shift vs Alt+Shift, etc.)
    const byModifier = groupBy(stats, (s) => {
      const mods = s.keys.filter(k => ['Ctrl', 'Alt', 'Shift', 'Cmd'].includes(k)).sort()
      return mods.join('+') || 'single'
    })
    byModifier.forEach((group, modCombo) => {
      if (modCombo === 'single' || group.length < 2) return
      const avg = average(group.map(s => s.accuracy))
      if (avg < 0.7) {
        patterns.push({
          type: 'modifier',
          description: `Struggling with ${modCombo} combinations (${Math.round(avg * 100)}% accuracy)`,
          shortcutIds: group.map(s => s.shortcutId),
          severity: 1 - avg
        })
      }
    })

    // Three-key complexity
    const threeKey = stats.filter(s => s.keys.length >= 3)
    if (threeKey.length >= 2) {
      const avg = average(threeKey.map(s => s.accuracy))
      if (avg < 0.6) {
        patterns.push({
          type: 'complexity',
          description: `Three-key combinations need work (${Math.round(avg * 100)}% accuracy)`,
          shortcutIds: threeKey.map(s => s.shortcutId),
          severity: 1 - avg
        })
      }
    }

    // By category
    const byCategory = groupBy(stats, s => s.category)
    byCategory.forEach((group, category) => {
      if (group.length < 2) return
      const avg = average(group.map(s => s.accuracy))
      if (avg < 0.65) {
        patterns.push({
          type: 'category',
          description: `${category} category needs practice (${Math.round(avg * 100)}% accuracy)`,
          shortcutIds: group.map(s => s.shortcutId),
          severity: 1 - avg
        })
      }
    })

    return patterns.sort((a, b) => b.severity - a.severity)
  }

  function generateReport(stats: ShortcutStats[]): WeaknessReport {
    if (stats.length === 0) {
      return {
        overallAccuracy: 0,
        weakestShortcuts: [],
        patterns: [],
        strengths: [],
        recommendations: ['Start practicing to see your weakness analysis!']
      }
    }

    const overallAccuracy = average(stats.map(s => s.accuracy))
    const patterns = analyzePatterns(stats)

    // Weakest individual shortcuts
    const scored = stats
      .map(s => ({ shortcutId: s.shortcutId, score: calculateWeaknessScore(s) }))
      .sort((a, b) => b.score - a.score)
    const weakestShortcuts = scored.slice(0, 10)

    // Strengths — categories/apps with >85% accuracy
    const strengths: string[] = []
    const byApp = groupBy(stats, s => s.app)
    byApp.forEach((group, app) => {
      const avg = average(group.map(s => s.accuracy))
      if (avg >= 0.85) strengths.push(`${app} shortcuts (${Math.round(avg * 100)}%)`)
    })

    // Recommendations
    const recommendations: string[] = []
    if (patterns.length > 0) {
      const top = patterns[0]!
      recommendations.push(`Focus on: ${top.description}`)
    }
    if (weakestShortcuts.length > 0) {
      recommendations.push(`Practice your ${weakestShortcuts.length} weakest shortcuts first`)
    }
    if (overallAccuracy < 0.7) {
      recommendations.push('Try Practice Mode daily to build muscle memory')
    } else if (overallAccuracy >= 0.9) {
      recommendations.push('Excellent accuracy! Try Speed Run or Time Attack to increase speed')
    }

    return { overallAccuracy, weakestShortcuts, patterns, strengths, recommendations }
  }

  /** Build ShortcutStats from raw shortcut + progress data */
  function buildStats(
    shortcuts: Shortcut[],
    progress: Array<{
      shortcutId: string
      correctCount: number
      incorrectCount: number
      avgTimeMs?: number
      lastSeen?: Date | null
    }>
  ): ShortcutStats[] {
    const progressMap = new Map(progress.map(p => [p.shortcutId, p]))

    return shortcuts
      .filter(s => progressMap.has(s.id))
      .map((s) => {
        const p = progressMap.get(s.id)!
        const total = p.correctCount + p.incorrectCount
        return {
          shortcutId: s.id,
          app: s.app,
          category: s.category,
          difficulty: s.difficulty,
          keys: s.keys,
          accuracy: total === 0 ? 0 : p.correctCount / total,
          avgTimeMs: p.avgTimeMs ?? 2000,
          totalAttempts: total,
          lastPracticed: p.lastSeen ? p.lastSeen.getTime() : 0
        }
      })
  }

  return { calculateWeaknessScore, analyzePatterns, generateReport, buildStats }
}
