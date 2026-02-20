/** XP and leveling system following the task spec formula */

/** XP required to complete level N */
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5))
}

/** Derive level from total cumulative XP */
export function levelFromXP(xp: number): number {
  let level = 1
  let totalRequired = 0
  while (totalRequired + xpForLevel(level) <= xp) {
    totalRequired += xpForLevel(level)
    level++
  }
  return level
}

/** XP spent in all levels before the current one */
export function xpAtLevelStart(level: number): number {
  let total = 0
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i)
  }
  return total
}

/** Level unlocks table */
export const LEVEL_UNLOCKS: Record<number, string> = {
  1: 'Practice, Flash Round',
  5: 'Speed Run',
  10: 'Survival, Time Attack',
  15: 'Daily Challenge',
  20: 'Rhythm Mode',
  25: 'Memory Match',
  30: 'Blind Mode',
  40: 'Boss Battle',
  50: 'Endless Mode'
}

/** XP source constants */
export const XP_SOURCES = {
  CORRECT_ANSWER: 10,
  PERFECT_TIMING: 25,
  STREAK_5: 50,
  STREAK_10: 100,
  STREAK_20: 200,
  DAILY_CHALLENGE: 100,
  BOSS_DEFEATED: 250
} as const

export interface LevelUpEvent {
  previousLevel: number
  newLevel: number
  unlock?: string
}

export function useXpLeveling() {
  // #region state
  const totalXp = ref(0)
  const levelUpEvents = ref<LevelUpEvent[]>([])
  // #endregion

  // #region computed
  const level = computed(() => levelFromXP(totalXp.value))

  const xpInCurrentLevel = computed(() => {
    return totalXp.value - xpAtLevelStart(level.value)
  })

  const xpNeededForNextLevel = computed(() => xpForLevel(level.value))

  const levelProgress = computed(() => {
    return xpInCurrentLevel.value / xpNeededForNextLevel.value
  })

  const levelProgressPercent = computed(() => Math.round(levelProgress.value * 100))

  const nextUnlock = computed(() => {
    const levels = Object.keys(LEVEL_UNLOCKS)
      .map(Number)
      .sort((a, b) => a - b)
    const next = levels.find(l => l > level.value)
    return next ? { level: next, unlock: LEVEL_UNLOCKS[next]! } : null
  })
  // #endregion

  // #region methods
  function addXp(amount: number): LevelUpEvent | null {
    const previousLevel = level.value
    totalXp.value += amount
    const newLevel = level.value

    if (newLevel > previousLevel) {
      const event: LevelUpEvent = {
        previousLevel,
        newLevel,
        unlock: LEVEL_UNLOCKS[newLevel]
      }
      levelUpEvents.value.push(event)
      return event
    }

    return null
  }

  function isUnlocked(requiredLevel: number): boolean {
    return level.value >= requiredLevel
  }

  function clearLevelUpEvents() {
    levelUpEvents.value = []
  }

  function loadXp(xp: number) {
    totalXp.value = xp
  }
  // #endregion

  return {
    totalXp: readonly(totalXp),
    level,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    levelProgress,
    levelProgressPercent,
    nextUnlock,
    levelUpEvents: readonly(levelUpEvents),
    addXp,
    isUnlocked,
    clearLevelUpEvents,
    loadXp
  }
}
