import type { Shortcut } from '~/types/shortcut'
import { ALL_SHORTCUTS } from '~/data/shortcuts'

export interface SpeedRunOptions {
  app?: string
  count?: number // shortcuts to complete, default 10
}

export function useSpeedRun() {
  // #region state
  const shortcuts = ref<Shortcut[]>([])
  const currentIndex = ref(0)
  const startTime = ref<number>(0)
  const endTime = ref<number>(0)
  const isRunning = ref(false)
  const isComplete = ref(false)
  const wrongCount = ref(0)
  const elapsedMs = ref(0)
  let ticker: ReturnType<typeof setInterval> | null = null
  // #endregion

  // #region computed
  const currentShortcut = computed<Shortcut | null>(
    () => shortcuts.value[currentIndex.value] ?? null
  )

  const progress = computed(() => ({
    current: currentIndex.value,
    total: shortcuts.value.length
  }))

  const elapsedDisplay = computed(() => {
    const s = Math.floor(elapsedMs.value / 1000)
    const ms = Math.floor((elapsedMs.value % 1000) / 10)
    return `${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`
  })

  const finalTime = computed(() =>
    endTime.value > 0 ? endTime.value - startTime.value : elapsedMs.value
  )
  // #endregion

  // #region methods
  function start(options: SpeedRunOptions = {}) {
    const count = options.count ?? 10
    let pool = [...ALL_SHORTCUTS]
    if (options.app) pool = pool.filter(s => s.app === options.app)
    // Shuffle and slice
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }

    shortcuts.value = pool.slice(0, Math.min(count, pool.length))
    currentIndex.value = 0
    wrongCount.value = 0
    isComplete.value = false
    startTime.value = Date.now()
    endTime.value = 0
    isRunning.value = true
    elapsedMs.value = 0

    ticker = setInterval(() => {
      elapsedMs.value = Date.now() - startTime.value
    }, 50)
  }

  function submitAnswer(pressedKeys: string[]): boolean {
    const shortcut = currentShortcut.value
    if (!shortcut || !isRunning.value) return false

    const held = pressedKeys.map(k => k.toLowerCase()).sort()
    const expected = shortcut.keys.map(k => k.toLowerCase()).sort()
    const isCorrect = held.length === expected.length
      && held.every((k, i) => k === expected[i])

    if (isCorrect) {
      if (currentIndex.value >= shortcuts.value.length - 1) {
        endTime.value = Date.now()
        isRunning.value = false
        isComplete.value = true
        if (ticker) clearInterval(ticker)
      } else {
        currentIndex.value++
      }
    } else if (held.length >= expected.length) {
      wrongCount.value++
    }

    return isCorrect
  }

  function stop() {
    if (ticker) clearInterval(ticker)
    isRunning.value = false
  }

  function reset() {
    stop()
    shortcuts.value = []
    currentIndex.value = 0
    wrongCount.value = 0
    isComplete.value = false
    elapsedMs.value = 0
    startTime.value = 0
    endTime.value = 0
  }
  // #endregion

  onUnmounted(() => {
    if (ticker) clearInterval(ticker)
  })

  return {
    currentShortcut,
    progress,
    elapsedDisplay,
    finalTime,
    isRunning: readonly(isRunning),
    isComplete: readonly(isComplete),
    wrongCount: readonly(wrongCount),
    start,
    submitAnswer,
    stop,
    reset
  }
}
