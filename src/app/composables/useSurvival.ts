import type { Shortcut } from '~/types/shortcut'
import { ALL_SHORTCUTS } from '~/data/shortcuts'

export interface SurvivalOptions {
  app?: string
  lives?: number // default 3
}

export function useSurvival() {
  // #region state
  const shortcuts = ref<Shortcut[]>([])
  const currentIndex = ref(0)
  const lives = ref(3)
  const maxLives = ref(3)
  const streak = ref(0)
  const bestStreak = ref(0)
  const score = ref(0)
  const isRunning = ref(false)
  const isGameOver = ref(false)
  // #endregion

  // #region computed
  const currentShortcut = computed<Shortcut | null>(
    () => shortcuts.value[currentIndex.value % Math.max(shortcuts.value.length, 1)] ?? null
  )
  // #endregion

  // #region methods
  function start(options: SurvivalOptions = {}) {
    let pool = [...ALL_SHORTCUTS]
    if (options.app) pool = pool.filter(s => s.app === options.app)
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }

    shortcuts.value = pool
    currentIndex.value = 0
    maxLives.value = options.lives ?? 3
    lives.value = maxLives.value
    streak.value = 0
    bestStreak.value = 0
    score.value = 0
    isRunning.value = true
    isGameOver.value = false
  }

  function submitAnswer(pressedKeys: string[]): boolean {
    const shortcut = currentShortcut.value
    if (!shortcut || !isRunning.value) return false

    const held = pressedKeys.map(k => k.toLowerCase()).sort()
    const expected = shortcut.keys.map(k => k.toLowerCase()).sort()
    const isCorrect = held.length === expected.length
      && held.every((k, i) => k === expected[i])

    if (isCorrect) {
      streak.value++
      if (streak.value > bestStreak.value) bestStreak.value = streak.value
      score.value += 100 * Math.max(1, Math.floor(streak.value / 5) + 1)
      currentIndex.value++
    } else if (held.length >= expected.length) {
      streak.value = 0
      lives.value--
      if (lives.value <= 0) {
        isRunning.value = false
        isGameOver.value = true
      }
    }

    return isCorrect
  }

  function reset() {
    shortcuts.value = []
    currentIndex.value = 0
    lives.value = 3
    streak.value = 0
    bestStreak.value = 0
    score.value = 0
    isRunning.value = false
    isGameOver.value = false
  }
  // #endregion

  return {
    currentShortcut,
    lives: readonly(lives),
    maxLives: readonly(maxLives),
    streak: readonly(streak),
    bestStreak: readonly(bestStreak),
    score: readonly(score),
    isRunning: readonly(isRunning),
    isGameOver: readonly(isGameOver),
    start,
    submitAnswer,
    reset
  }
}
