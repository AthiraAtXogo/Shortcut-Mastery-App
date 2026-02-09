export const useUserStore = defineStore('user', () => {
  // State
  const xp = ref(0)
  const level = ref(1)
  const dailyStreak = ref(0)
  const lastPlayedDate = ref<string | null>(null)
  const totalShortcutsLearned = ref(0)
  const totalTimePlayed = ref(0) // in milliseconds
  const preferredApp = ref<string | null>(null)

  // Computed
  const xpForCurrentLevel = computed(() => level.value * 1000)

  const xpProgress = computed(() => {
    const currentLevelXp = xp.value % 1000
    return (currentLevelXp / 1000) * 100
  })

  const xpToNextLevel = computed(() => {
    return xpForCurrentLevel.value - (xp.value % 1000)
  })

  const rank = computed(() => {
    if (level.value >= 50) return 'Grandmaster'
    if (level.value >= 40) return 'Master'
    if (level.value >= 30) return 'Expert'
    if (level.value >= 20) return 'Advanced'
    if (level.value >= 10) return 'Intermediate'
    if (level.value >= 5) return 'Beginner'
    return 'Novice'
  })

  // Actions
  function addXp(amount: number) {
    xp.value += amount

    // Level up check
    while (xp.value >= xpForCurrentLevel.value) {
      xp.value -= xpForCurrentLevel.value
      level.value++
    }
  }

  function updateDailyStreak() {
    const today = new Date().toISOString().split('T')[0]

    if (!lastPlayedDate.value) {
      // First time playing
      dailyStreak.value = 1
    } else {
      const lastDate = new Date(lastPlayedDate.value)
      const todayDate = new Date(today)
      const diffDays = Math.floor(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (diffDays === 0) {
        // Same day, no change
        return false
      } else if (diffDays === 1) {
        // Consecutive day
        dailyStreak.value++
      } else {
        // Streak broken
        dailyStreak.value = 1
      }
    }

    lastPlayedDate.value = today
    return true
  }

  function incrementShortcutsLearned() {
    totalShortcutsLearned.value++
  }

  function addTimePlayed(ms: number) {
    totalTimePlayed.value += ms
  }

  function setPreferredApp(app: string | null) {
    preferredApp.value = app
  }

  // Persist to IndexedDB
  async function loadFromDatabase() {
    const { getSetting } = useDatabase()

    xp.value = await getSetting('user-xp', 0)
    level.value = await getSetting('user-level', 1)
    dailyStreak.value = await getSetting('user-daily-streak', 0)
    lastPlayedDate.value = await getSetting('user-last-played', null)
    totalShortcutsLearned.value = await getSetting('user-shortcuts-learned', 0)
    totalTimePlayed.value = await getSetting('user-time-played', 0)
    preferredApp.value = await getSetting('user-preferred-app', null)
  }

  async function saveToDatabase() {
    const { setSetting } = useDatabase()

    await Promise.all([
      setSetting('user-xp', xp.value),
      setSetting('user-level', level.value),
      setSetting('user-daily-streak', dailyStreak.value),
      setSetting('user-last-played', lastPlayedDate.value),
      setSetting('user-shortcuts-learned', totalShortcutsLearned.value),
      setSetting('user-time-played', totalTimePlayed.value),
      setSetting('user-preferred-app', preferredApp.value)
    ])
  }

  return {
    // State
    xp,
    level,
    dailyStreak,
    lastPlayedDate,
    totalShortcutsLearned,
    totalTimePlayed,
    preferredApp,
    // Computed
    xpForCurrentLevel,
    xpProgress,
    xpToNextLevel,
    rank,
    // Actions
    addXp,
    updateDailyStreak,
    incrementShortcutsLearned,
    addTimePlayed,
    setPreferredApp,
    loadFromDatabase,
    saveToDatabase
  }
})
