/** Achievement system — definitions, unlock detection, notifications */

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export interface AchievementCondition {
  type: 'count' | 'streak' | 'time' | 'special'
  metric: string
  target: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: AchievementRarity
  xpReward: number
  condition: AchievementCondition
  secret?: boolean
}

export interface UnlockedAchievement {
  id: string
  unlockedAt: Date
}

export const ACHIEVEMENTS: Achievement[] = [
  // Progress
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first shortcut correctly',
    icon: '👶',
    rarity: 'common',
    xpReward: 25,
    condition: { type: 'count', metric: 'totalCorrect', target: 1 }
  },
  {
    id: 'century',
    name: 'Century',
    description: 'Get 100 correct answers',
    icon: '💯',
    rarity: 'uncommon',
    xpReward: 100,
    condition: { type: 'count', metric: 'totalCorrect', target: 100 }
  },
  {
    id: 'thousand-club',
    name: 'Thousand Club',
    description: 'Get 1,000 correct answers',
    icon: '🏆',
    rarity: 'rare',
    xpReward: 500,
    condition: { type: 'count', metric: 'totalCorrect', target: 1000 }
  },
  // Streaks
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    rarity: 'uncommon',
    xpReward: 150,
    condition: { type: 'streak', metric: 'dailyStreak', target: 7 }
  },
  {
    id: 'monthly-master',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '📅',
    rarity: 'epic',
    xpReward: 500,
    condition: { type: 'streak', metric: 'dailyStreak', target: 30 }
  },
  {
    id: 'century-streak',
    name: 'Century Streak',
    description: 'Maintain a 100-day streak',
    icon: '⚡',
    rarity: 'legendary',
    xpReward: 2000,
    condition: { type: 'streak', metric: 'dailyStreak', target: 100 }
  },
  // Speed
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Answer in under 500ms',
    icon: '💨',
    rarity: 'rare',
    xpReward: 100,
    condition: { type: 'time', metric: 'fastestAnswerMs', target: 500 }
  },
  // Mastery
  {
    id: 'app-master',
    name: 'App Master',
    description: 'Master 10 shortcuts from a single app',
    icon: '🎯',
    rarity: 'rare',
    xpReward: 200,
    condition: { type: 'count', metric: 'masteredShortcuts', target: 10 }
  },
  {
    id: 'shortcut-sage',
    name: 'Shortcut Sage',
    description: 'Master 50 shortcuts',
    icon: '🧙',
    rarity: 'epic',
    xpReward: 750,
    condition: { type: 'count', metric: 'masteredShortcuts', target: 50 }
  },
  // Modes
  {
    id: 'boss-slayer',
    name: 'Boss Slayer',
    description: 'Defeat your first boss',
    icon: '⚔️',
    rarity: 'epic',
    xpReward: 250,
    condition: { type: 'count', metric: 'bossesDefeated', target: 1 }
  },
  {
    id: 'boss-hunter',
    name: 'Boss Hunter',
    description: 'Defeat 10 bosses',
    icon: '🗡️',
    rarity: 'legendary',
    xpReward: 1000,
    condition: { type: 'count', metric: 'bossesDefeated', target: 10 }
  },
  // Special
  {
    id: 'combo-king',
    name: 'Combo King',
    description: 'Hit a 20-combo streak in one session',
    icon: '👑',
    rarity: 'epic',
    xpReward: 300,
    condition: { type: 'count', metric: 'maxCombo', target: 20 }
  },
  {
    id: 'level-10',
    name: 'Rising Star',
    description: 'Reach level 10',
    icon: '⭐',
    rarity: 'uncommon',
    xpReward: 200,
    condition: { type: 'count', metric: 'level', target: 10 }
  },
  {
    id: 'level-25',
    name: 'Veteran',
    description: 'Reach level 25',
    icon: '🌟',
    rarity: 'rare',
    xpReward: 500,
    condition: { type: 'count', metric: 'level', target: 25 }
  },
  {
    id: 'level-50',
    name: 'Grandmaster',
    description: 'Reach level 50',
    icon: '💎',
    rarity: 'legendary',
    xpReward: 2500,
    condition: { type: 'count', metric: 'level', target: 50 },
    secret: true
  }
]

export interface AchievementUnlockEvent {
  achievement: Achievement
  xpAwarded: number
}

function meetsCondition(value: number, condition: AchievementCondition): boolean {
  if (condition.type === 'time') {
    // For time metrics, lower is better (faster)
    return value <= condition.target && value > 0
  }
  return value >= condition.target
}

export function useAchievements() {
  // #region state
  const unlockedIds = ref<string[]>([])
  const unlockEvents = ref<AchievementUnlockEvent[]>([])
  // #endregion

  // #region computed
  const unlockedAchievements = computed(() =>
    ACHIEVEMENTS.filter(a => unlockedIds.value.includes(a.id))
  )

  const lockedAchievements = computed(() =>
    ACHIEVEMENTS.filter(a => !unlockedIds.value.includes(a.id) && !a.secret)
  )

  const visibleAchievements = computed(() =>
    ACHIEVEMENTS.filter(a => unlockedIds.value.includes(a.id) || !a.secret)
  )

  const totalXpFromAchievements = computed(() =>
    unlockedAchievements.value.reduce((sum, a) => sum + a.xpReward, 0)
  )
  // #endregion

  // #region methods
  function isUnlocked(id: string): boolean {
    return unlockedIds.value.includes(id)
  }

  /**
   * Check metrics against all locked achievements.
   * Returns array of newly unlocked achievements.
   */
  function checkAchievements(metrics: Record<string, number>): AchievementUnlockEvent[] {
    const newUnlocks: AchievementUnlockEvent[] = []

    for (const achievement of ACHIEVEMENTS) {
      if (unlockedIds.value.includes(achievement.id)) continue

      const value = metrics[achievement.condition.metric]
      if (value !== undefined && meetsCondition(value, achievement.condition)) {
        unlockedIds.value.push(achievement.id)
        const event: AchievementUnlockEvent = {
          achievement,
          xpAwarded: achievement.xpReward
        }
        newUnlocks.push(event)
        unlockEvents.value.push(event)
      }
    }

    return newUnlocks
  }

  function forceUnlock(id: string): AchievementUnlockEvent | null {
    const achievement = ACHIEVEMENTS.find(a => a.id === id)
    if (!achievement || unlockedIds.value.includes(id)) return null

    unlockedIds.value.push(id)
    const event: AchievementUnlockEvent = { achievement, xpAwarded: achievement.xpReward }
    unlockEvents.value.push(event)
    return event
  }

  function clearUnlockEvents() {
    unlockEvents.value = []
  }

  function loadUnlocked(ids: string[]) {
    unlockedIds.value = [...ids]
  }
  // #endregion

  return {
    unlockedIds: readonly(unlockedIds),
    unlockedAchievements,
    lockedAchievements,
    visibleAchievements,
    totalXpFromAchievements,
    unlockEvents: readonly(unlockEvents),
    isUnlocked,
    checkAchievements,
    forceUnlock,
    clearUnlockEvents,
    loadUnlocked
  }
}
