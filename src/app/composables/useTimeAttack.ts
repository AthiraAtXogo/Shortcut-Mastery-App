import type { Shortcut } from '~/types/shortcut'
import { ALL_SHORTCUTS } from '~/data/shortcuts'

export interface TimeAttackOptions {
  app?: string
  duration?: number // seconds, default 60
}

export function useTimeAttack() {
  // #region state
  const shortcuts = ref<Shortcut[]>([])
  const currentIndex = ref(0)
  const timeLeft = ref(60)
  const score = ref(0)
  const correct = ref(0)
  const streak = ref(0)
  const isRunning = ref(false)
  const isComplete = ref(false)
  let ticker: ReturnType<typeof setInterval> | null = null
  // #endregion

  // #region computed
  const currentShortcut = computed<Shortcut | null>(
    () => shortcuts.value[currentIndex.value % Math.max(shortcuts.value.length, 1)] ?? null
  )

  const timePercent = computed(() => (timeLeft.value / 60) * 100)
  // #endregion

  // #region methods
  function start(options: TimeAttackOptions = {}) {
    let pool = [...ALL_SHORTCUTS]
    if (options.app) pool = pool.filter(s => s.app === options.app)
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }

    shortcuts.value = pool
    currentIndex.value = 0
    timeLeft.value = options.duration ?? 60
    score.value = 0
    correct.value = 0
    streak.value = 0
    isRunning.value = true
    isComplete.value = false

    ticker = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        if (ticker) clearInterval(ticker)
        isRunning.value = false
        isComplete.value = true
      }
    }, 1000)
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
      score.value += 100 + (streak.value >= 3 ? streak.value * 10 : 0)
      correct.value++
      currentIndex.value++
    } else if (held.length >= expected.length) {
      streak.value = 0
    }

    return isCorrect
  }

  function stop() {
    if (ticker) clearInterval(ticker)
    isRunning.value = false
    isComplete.value = true
  }

  function reset() {
    stop()
    shortcuts.value = []
    currentIndex.value = 0
    timeLeft.value = 60
    score.value = 0
    correct.value = 0
    streak.value = 0
    isComplete.value = false
  }
  // #endregion

  onUnmounted(() => {
    if (ticker) clearInterval(ticker)
  })

  return {
    currentShortcut,
    timeLeft: readonly(timeLeft),
    timePercent,
    score: readonly(score),
    correct: readonly(correct),
    streak: readonly(streak),
    isRunning: readonly(isRunning),
    isComplete: readonly(isComplete),
    start,
    submitAnswer,
    stop,
    reset
  }
}
