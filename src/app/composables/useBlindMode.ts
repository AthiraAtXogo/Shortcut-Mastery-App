import type { Shortcut } from '~/types/shortcut'
import { ALL_SHORTCUTS } from '~/data/shortcuts'

/** Blind mode: no visual keyboard, no key highlights */
export function useBlindMode() {
  // #region state
  const shortcuts = ref<Shortcut[]>([])
  const currentIndex = ref(0)
  const score = ref(0)
  const streak = ref(0)
  const lives = ref(3)
  const isRunning = ref(false)
  const isGameOver = ref(false)
  // #endregion

  // #region computed
  const currentShortcut = computed<Shortcut | null>(
    () => shortcuts.value[currentIndex.value % Math.max(shortcuts.value.length, 1)] ?? null
  )
  // #endregion

  // #region methods
  function start(app?: string) {
    let pool = [...ALL_SHORTCUTS]
    if (app) pool = pool.filter(s => s.app === app)
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    shortcuts.value = pool
    currentIndex.value = 0
    score.value = 0
    streak.value = 0
    lives.value = 3
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
      score.value += 150 + streak.value * 10 // Higher reward for blind mode
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
    score.value = 0
    streak.value = 0
    lives.value = 3
    isRunning.value = false
    isGameOver.value = false
  }
  // #endregion

  return {
    currentShortcut,
    score: readonly(score),
    streak: readonly(streak),
    lives: readonly(lives),
    isRunning: readonly(isRunning),
    isGameOver: readonly(isGameOver),
    start,
    submitAnswer,
    reset
  }
}
