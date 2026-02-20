import type { Shortcut } from '~/types/shortcut'
import { ALL_SHORTCUTS } from '~/data/shortcuts'

export function useDailyChallenge() {
  // #region state
  const shortcuts = ref<Shortcut[]>([])
  const currentIndex = ref(0)
  const score = ref(0)
  const correct = ref(0)
  const isComplete = ref(false)
  const date = ref('')
  // #endregion

  // #region computed
  const currentShortcut = computed<Shortcut | null>(
    () => shortcuts.value[currentIndex.value] ?? null
  )

  const progress = computed(() => ({
    current: currentIndex.value,
    total: shortcuts.value.length,
    correct: correct.value
  }))
  // #endregion

  // #region methods
  /** Deterministic shuffle seed from date string */
  function seededShuffle(pool: Shortcut[], seed: string): Shortcut[] {
    let s = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    const rng = () => {
      s = (s * 1664525 + 1013904223) & 0xffffffff
      return (s >>> 0) / 0x100000000
    }
    const arr = [...pool]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  function start() {
    const today = new Date().toISOString().split('T')[0]!
    date.value = today

    const shuffled = seededShuffle(ALL_SHORTCUTS, today)
    shortcuts.value = shuffled.slice(0, 10)
    currentIndex.value = 0
    score.value = 0
    correct.value = 0
    isComplete.value = false
  }

  function submitAnswer(pressedKeys: string[]): boolean {
    const shortcut = currentShortcut.value
    if (!shortcut || isComplete.value) return false

    const held = pressedKeys.map(k => k.toLowerCase()).sort()
    const expected = shortcut.keys.map(k => k.toLowerCase()).sort()
    const isCorrect = held.length === expected.length
      && held.every((k, i) => k === expected[i])

    if (isCorrect) {
      score.value += 150 // Daily bonus XP
      correct.value++
      if (currentIndex.value >= shortcuts.value.length - 1) {
        isComplete.value = true
      } else {
        currentIndex.value++
      }
    }

    return isCorrect
  }

  function reset() {
    shortcuts.value = []
    currentIndex.value = 0
    score.value = 0
    correct.value = 0
    isComplete.value = false
    date.value = ''
  }
  // #endregion

  return {
    currentShortcut,
    progress,
    score: readonly(score),
    isComplete: readonly(isComplete),
    date: readonly(date),
    start,
    submitAnswer,
    reset
  }
}
