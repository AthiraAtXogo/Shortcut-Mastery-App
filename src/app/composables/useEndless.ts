import type { Shortcut } from '~/types/shortcut'
import { ALL_SHORTCUTS } from '~/data/shortcuts'

export function useEndless() {
  // #region state
  const shortcuts = ref<Shortcut[]>([])
  const currentIndex = ref(0)
  const score = ref(0)
  const streak = ref(0)
  const bestStreak = ref(0)
  const totalCorrect = ref(0)
  const isRunning = ref(false)
  // #endregion

  // #region computed
  const currentShortcut = computed<Shortcut | null>(
    () => shortcuts.value[currentIndex.value % Math.max(shortcuts.value.length, 1)] ?? null
  )

  /** Difficulty scales with totalCorrect */
  const currentDifficulty = computed(() => {
    if (totalCorrect.value >= 30) return 'hard'
    if (totalCorrect.value >= 15) return 'medium'
    return 'easy'
  })

  const multiplier = computed(() => {
    if (streak.value >= 20) return 4
    if (streak.value >= 10) return 3
    if (streak.value >= 5) return 2
    return 1
  })
  // #endregion

  // #region methods
  function buildPool(): Shortcut[] {
    let pool = [...ALL_SHORTCUTS]
    const diff = currentDifficulty.value
    // Bias toward current difficulty but include all
    const prioritized = pool.filter(s => s.difficulty === diff)
    const rest = pool.filter(s => s.difficulty !== diff)
    pool = [...prioritized, ...rest]
    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    return pool
  }

  function start(app?: string) {
    let pool = buildPool()
    if (app) pool = pool.filter(s => s.app === app)
    shortcuts.value = pool
    currentIndex.value = 0
    score.value = 0
    streak.value = 0
    bestStreak.value = 0
    totalCorrect.value = 0
    isRunning.value = true
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
      score.value += 100 * multiplier.value
      totalCorrect.value++
      // Rebuild pool every 10 to adjust difficulty
      if (totalCorrect.value % 10 === 0) {
        shortcuts.value = buildPool()
        currentIndex.value = 0
      } else {
        currentIndex.value++
      }
    } else if (held.length >= expected.length) {
      streak.value = 0
    }

    return isCorrect
  }

  function stop() {
    isRunning.value = false
  }

  function reset() {
    shortcuts.value = []
    currentIndex.value = 0
    score.value = 0
    streak.value = 0
    bestStreak.value = 0
    totalCorrect.value = 0
    isRunning.value = false
  }
  // #endregion

  return {
    currentShortcut,
    score: readonly(score),
    streak: readonly(streak),
    bestStreak: readonly(bestStreak),
    totalCorrect: readonly(totalCorrect),
    currentDifficulty,
    multiplier,
    isRunning: readonly(isRunning),
    start,
    submitAnswer,
    stop,
    reset
  }
}
