import type { Shortcut } from '~/types/shortcut'
import { ALL_SHORTCUTS } from '~/data/shortcuts'

/** Type mode: user types the key names (e.g. "Ctrl+S") rather than pressing the combo */
export function useTypeMode() {
  // #region state
  const shortcuts = ref<Shortcut[]>([])
  const currentIndex = ref(0)
  const typedInput = ref('')
  const score = ref(0)
  const streak = ref(0)
  const isRunning = ref(false)
  const lastResult = ref<'correct' | 'wrong' | null>(null)
  // #endregion

  // #region computed
  const currentShortcut = computed<Shortcut | null>(
    () => shortcuts.value[currentIndex.value % Math.max(shortcuts.value.length, 1)] ?? null
  )

  const expectedText = computed(() => {
    const s = currentShortcut.value
    return s ? s.keysDisplay ?? s.keys.join('+') : ''
  })
  // #endregion

  // #region methods
  function normalizeInput(raw: string): string {
    return raw.toLowerCase().replace(/\s+/g, '').replace(/\+/g, '+')
  }

  function start(app?: string) {
    let pool = [...ALL_SHORTCUTS]
    if (app) pool = pool.filter(s => s.app === app)
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    shortcuts.value = pool
    currentIndex.value = 0
    typedInput.value = ''
    score.value = 0
    streak.value = 0
    isRunning.value = true
    lastResult.value = null
  }

  function submitTyped(): boolean {
    const shortcut = currentShortcut.value
    if (!shortcut || !isRunning.value) return false

    const input = normalizeInput(typedInput.value)
    const expected = normalizeInput(shortcut.keysDisplay ?? shortcut.keys.join('+'))
    const isCorrect = input === expected

    if (isCorrect) {
      streak.value++
      score.value += 100
      lastResult.value = 'correct'
      typedInput.value = ''
      setTimeout(() => {
        lastResult.value = null
        currentIndex.value++
      }, 500)
    } else {
      streak.value = 0
      lastResult.value = 'wrong'
      setTimeout(() => {
        lastResult.value = null
      }, 600)
    }

    return isCorrect
  }

  function reset() {
    shortcuts.value = []
    currentIndex.value = 0
    typedInput.value = ''
    score.value = 0
    streak.value = 0
    isRunning.value = false
    lastResult.value = null
  }
  // #endregion

  return {
    currentShortcut,
    expectedText,
    typedInput,
    score: readonly(score),
    streak: readonly(streak),
    isRunning: readonly(isRunning),
    lastResult: readonly(lastResult),
    start,
    submitTyped,
    reset
  }
}
