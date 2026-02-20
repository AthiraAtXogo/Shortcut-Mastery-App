import type { Shortcut } from '~/types/shortcut'
import { ALL_SHORTCUTS } from '~/data/shortcuts'

export interface PracticeOptions {
  app?: string
  category?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export interface PracticeResult {
  correct: boolean
  attempts: number
}

export function usePracticeMode() {
  // #region state
  const shortcuts = ref<Shortcut[]>([])
  const currentIndex = ref(0)
  const attempts = ref(0)
  const showHint = ref(false)
  const showAnswer = ref(false)
  const isComplete = ref(false)
  const correctCount = ref(0)
  const skippedCount = ref(0)
  // #endregion

  // #region computed
  const currentShortcut = computed<Shortcut | null>(
    () => shortcuts.value[currentIndex.value] ?? null
  )

  const progress = computed(() => ({
    current: currentIndex.value + 1,
    total: shortcuts.value.length,
    correct: correctCount.value,
    skipped: skippedCount.value
  }))

  const isLastShortcut = computed(
    () => currentIndex.value >= shortcuts.value.length - 1
  )
  // #endregion

  // #region methods
  function start(options: PracticeOptions = {}) {
    let pool = [...ALL_SHORTCUTS]

    if (options.app) {
      pool = pool.filter(s => s.app === options.app)
    }
    if (options.category) {
      pool = pool.filter(s => s.category === options.category)
    }
    if (options.difficulty) {
      pool = pool.filter(s => s.difficulty === options.difficulty)
    }

    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }

    shortcuts.value = pool
    currentIndex.value = 0
    attempts.value = 0
    showHint.value = false
    showAnswer.value = false
    isComplete.value = false
    correctCount.value = 0
    skippedCount.value = 0
  }

  function submitAnswer(pressedKeys: string[]): PracticeResult {
    const shortcut = currentShortcut.value
    if (!shortcut) return { correct: false, attempts: attempts.value }

    const held = pressedKeys.map(k => k.toLowerCase()).sort()
    const expected = shortcut.keys.map(k => k.toLowerCase()).sort()
    const isCorrect = held.length === expected.length
      && held.every((k, i) => k === expected[i])

    if (isCorrect) {
      correctCount.value++
      return { correct: true, attempts: attempts.value }
    }

    attempts.value++
    if (attempts.value >= 2) showHint.value = true
    if (attempts.value >= 5) showAnswer.value = true

    return { correct: false, attempts: attempts.value }
  }

  function next() {
    if (isLastShortcut.value) {
      isComplete.value = true
      return
    }
    currentIndex.value++
    attempts.value = 0
    showHint.value = false
    showAnswer.value = false
  }

  function skip() {
    skippedCount.value++
    next()
  }

  function revealHint() {
    showHint.value = true
  }

  function revealAnswer() {
    showAnswer.value = true
  }

  function reset() {
    shortcuts.value = []
    currentIndex.value = 0
    attempts.value = 0
    showHint.value = false
    showAnswer.value = false
    isComplete.value = false
    correctCount.value = 0
    skippedCount.value = 0
  }
  // #endregion

  return {
    // State
    shortcuts: readonly(shortcuts),
    currentIndex: readonly(currentIndex),
    attempts: readonly(attempts),
    showHint: readonly(showHint),
    showAnswer: readonly(showAnswer),
    isComplete: readonly(isComplete),
    // Computed
    currentShortcut,
    progress,
    isLastShortcut,
    // Methods
    start,
    submitAnswer,
    next,
    skip,
    revealHint,
    revealAnswer,
    reset
  }
}
