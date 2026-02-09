import type { Shortcut, GameMode } from '~/types'

export const useGameStore = defineStore('game', () => {
  // State
  const mode = ref<GameMode>('practice')
  const score = ref(0)
  const streak = ref(0)
  const bestStreak = ref(0)
  const isPlaying = ref(false)
  const isPaused = ref(false)
  const currentShortcut = ref<Shortcut | null>(null)
  const shortcutsAttempted = ref(0)
  const shortcutsCorrect = ref(0)
  const startTime = ref<Date | null>(null)
  const timeRemaining = ref(0) // For timed modes

  // Computed
  const multiplier = computed(() => {
    if (streak.value >= 20) return 4
    if (streak.value >= 10) return 3
    if (streak.value >= 5) return 2
    return 1
  })

  const accuracy = computed(() => {
    if (shortcutsAttempted.value === 0) return 0
    return Math.round((shortcutsCorrect.value / shortcutsAttempted.value) * 100)
  })

  const elapsedTime = computed(() => {
    if (!startTime.value) return 0
    return Date.now() - startTime.value.getTime()
  })

  // Actions
  function startGame(gameMode: GameMode, options?: { timeLimit?: number }) {
    mode.value = gameMode
    score.value = 0
    streak.value = 0
    bestStreak.value = 0
    shortcutsAttempted.value = 0
    shortcutsCorrect.value = 0
    isPlaying.value = true
    isPaused.value = false
    startTime.value = new Date()
    timeRemaining.value = options?.timeLimit ?? 0
  }

  function correctAnswer() {
    streak.value++
    if (streak.value > bestStreak.value) {
      bestStreak.value = streak.value
    }
    shortcutsAttempted.value++
    shortcutsCorrect.value++

    // Calculate score with multiplier
    const baseScore = 100
    score.value += baseScore * multiplier.value
  }

  function wrongAnswer() {
    streak.value = 0
    shortcutsAttempted.value++
  }

  function setCurrentShortcut(shortcut: Shortcut | null) {
    currentShortcut.value = shortcut
  }

  function pauseGame() {
    isPaused.value = true
  }

  function resumeGame() {
    isPaused.value = false
  }

  function endGame() {
    isPlaying.value = false
    isPaused.value = false
  }

  function updateTimeRemaining(time: number) {
    timeRemaining.value = time
  }

  function reset() {
    mode.value = 'practice'
    score.value = 0
    streak.value = 0
    bestStreak.value = 0
    isPlaying.value = false
    isPaused.value = false
    currentShortcut.value = null
    shortcutsAttempted.value = 0
    shortcutsCorrect.value = 0
    startTime.value = null
    timeRemaining.value = 0
  }

  return {
    // State
    mode,
    score,
    streak,
    bestStreak,
    isPlaying,
    isPaused,
    currentShortcut,
    shortcutsAttempted,
    shortcutsCorrect,
    startTime,
    timeRemaining,
    // Computed
    multiplier,
    accuracy,
    elapsedTime,
    // Actions
    startGame,
    correctAnswer,
    wrongAnswer,
    setCurrentShortcut,
    pauseGame,
    resumeGame,
    endGame,
    updateTimeRemaining,
    reset
  }
})
