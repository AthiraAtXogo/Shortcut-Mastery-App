/** Daily streak tracking with milestones and XP multipliers */

export interface StreakMilestone {
  days: number
  xpBonus: number
  badge?: string
}

export const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 3, xpBonus: 50 },
  { days: 7, xpBonus: 100, badge: 'Week Warrior' },
  { days: 14, xpBonus: 200 },
  { days: 30, xpBonus: 500, badge: 'Monthly Master' },
  { days: 100, xpBonus: 1000, badge: 'Century' },
  { days: 365, xpBonus: 5000, badge: 'Year of Mastery' }
]

/** XP multiplier based on current streak */
export function streakMultiplier(streak: number): number {
  if (streak >= 30) return 2.0
  if (streak >= 14) return 1.5
  if (streak >= 7) return 1.25
  if (streak >= 3) return 1.1
  return 1.0
}

export interface StreakMilestoneEvent {
  milestone: StreakMilestone
  streak: number
}

export function useStreakSystem() {
  // #region state
  const currentStreak = ref(0)
  const longestStreak = ref(0)
  const lastPlayedDate = ref<string | null>(null)
  const milestoneEvents = ref<StreakMilestoneEvent[]>([])
  // #endregion

  // #region computed
  const multiplier = computed(() => streakMultiplier(currentStreak.value))

  const nextMilestone = computed(() => {
    return STREAK_MILESTONES.find(m => m.days > currentStreak.value) ?? null
  })

  const daysToNextMilestone = computed(() => {
    const next = nextMilestone.value
    return next ? next.days - currentStreak.value : 0
  })
  // #endregion

  // #region methods
  /**
   * Call when user completes a session.
   * Returns { updated: bool, milestoneHit: StreakMilestone | null }
   */
  function recordPlay(): { updated: boolean, milestoneHit: StreakMilestone | null } {
    const today = new Date().toISOString().split('T')[0]!

    if (lastPlayedDate.value === today) {
      return { updated: false, milestoneHit: null }
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]!

    if (!lastPlayedDate.value || lastPlayedDate.value < yesterday) {
      // First time or streak broken
      currentStreak.value = 1
    } else {
      // Consecutive day
      currentStreak.value++
    }

    if (currentStreak.value > longestStreak.value) {
      longestStreak.value = currentStreak.value
    }

    lastPlayedDate.value = today

    // Check milestones
    const hit = STREAK_MILESTONES.find(m => m.days === currentStreak.value) ?? null
    if (hit) {
      milestoneEvents.value.push({ milestone: hit, streak: currentStreak.value })
    }

    return { updated: true, milestoneHit: hit }
  }

  function applyMultiplier(baseXp: number): number {
    return Math.round(baseXp * multiplier.value)
  }

  function clearMilestoneEvents() {
    milestoneEvents.value = []
  }

  function load(streak: number, longest: number, lastDate: string | null) {
    currentStreak.value = streak
    longestStreak.value = longest
    lastPlayedDate.value = lastDate
  }
  // #endregion

  return {
    currentStreak: readonly(currentStreak),
    longestStreak: readonly(longestStreak),
    lastPlayedDate: readonly(lastPlayedDate),
    multiplier,
    nextMilestone,
    daysToNextMilestone,
    milestoneEvents: readonly(milestoneEvents),
    recordPlay,
    applyMultiplier,
    clearMilestoneEvents,
    load
  }
}
