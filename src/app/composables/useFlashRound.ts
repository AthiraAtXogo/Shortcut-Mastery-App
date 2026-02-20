import type { Shortcut } from '~/types/shortcut'
import { ALL_SHORTCUTS } from '~/data/shortcuts'

export interface FlashRoundOptions {
  app?: string
  timePerShortcut?: number // ms, default 3000
}

export function useFlashRound() {
  // #region state
  const shortcuts = ref<Shortcut[]>([])
  const currentIndex = ref(0)
  const streak = ref(0)
  const bestStreak = ref(0)
  const score = ref(0)
  const isRunning = ref(false)
  const timeLeft = ref(3000)
  const lastResult = ref<'correct' | 'wrong' | 'timeout' | null>(null)
  let timer: ReturnType<typeof setInterval> | null = null
  const tickInterval = 100
  // #endregion

  // #region computed
  const currentShortcut = computed<Shortcut | null>(
    () => shortcuts.value[currentIndex.value] ?? null
  )

  const timePercent = computed(() => (timeLeft.value / 3000) * 100)
  // #endregion

  // #region methods
  function buildPool(options: FlashRoundOptions): Shortcut[] {
    let pool = [...ALL_SHORTCUTS]
    if (options.app) pool = pool.filter(s => s.app === options.app)
    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    return pool
  }

  function clearTimer() {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  function startTimer(ms: number, onTimeout: () => void) {
    clearTimer()
    timeLeft.value = ms
    timer = setInterval(() => {
      timeLeft.value -= tickInterval
      if (timeLeft.value <= 0) {
        clearTimer()
        onTimeout()
      }
    }, tickInterval)
  }

  function nextShortcut(timeLimit: number) {
    currentIndex.value = (currentIndex.value + 1) % shortcuts.value.length
    lastResult.value = null
    startTimer(timeLimit, () => handleTimeout())
  }

  function handleTimeout() {
    streak.value = 0
    lastResult.value = 'timeout'
    setTimeout(() => nextShortcut(3000), 1000)
  }

  function start(options: FlashRoundOptions = {}) {
    const limit = options.timePerShortcut ?? 3000
    shortcuts.value = buildPool(options)
    currentIndex.value = 0
    streak.value = 0
    bestStreak.value = 0
    score.value = 0
    isRunning.value = true
    lastResult.value = null
    startTimer(limit, () => handleTimeout())
  }

  function submitAnswer(pressedKeys: string[]): boolean {
    const shortcut = currentShortcut.value
    if (!shortcut || !isRunning.value) return false

    const held = pressedKeys.map(k => k.toLowerCase()).sort()
    const expected = shortcut.keys.map(k => k.toLowerCase()).sort()
    const isCorrect = held.length === expected.length
      && held.every((k, i) => k === expected[i])

    clearTimer()

    if (isCorrect) {
      const speedBonus = Math.ceil((timeLeft.value / 3000) * 50)
      score.value += 100 + speedBonus
      streak.value++
      if (streak.value > bestStreak.value) bestStreak.value = streak.value
      lastResult.value = 'correct'
      setTimeout(() => nextShortcut(3000), 600)
    } else if (held.length > 0) {
      streak.value = 0
      lastResult.value = 'wrong'
      setTimeout(() => nextShortcut(3000), 800)
    } else {
      // Partial — restart timer
      startTimer(timeLeft.value, () => handleTimeout())
    }

    return isCorrect
  }

  function stop() {
    clearTimer()
    isRunning.value = false
  }

  function reset() {
    stop()
    shortcuts.value = []
    currentIndex.value = 0
    streak.value = 0
    bestStreak.value = 0
    score.value = 0
    timeLeft.value = 3000
    lastResult.value = null
  }
  // #endregion

  onUnmounted(() => clearTimer())

  return {
    currentShortcut,
    streak: readonly(streak),
    bestStreak: readonly(bestStreak),
    score: readonly(score),
    isRunning: readonly(isRunning),
    timeLeft: readonly(timeLeft),
    timePercent,
    lastResult: readonly(lastResult),
    start,
    submitAnswer,
    stop,
    reset
  }
}
