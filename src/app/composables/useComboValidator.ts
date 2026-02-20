// #region setup
const MODIFIER_ORDER = ['Ctrl', 'Cmd', 'Alt', 'Shift'] as const
type Modifier = typeof MODIFIER_ORDER[number]

export interface ValidationResult {
  isCorrect: boolean
  isPartial: boolean
  isTimeout: boolean
  pressedKeys: string[]
  expectedKeys: string[]
  missingKeys: string[]
  extraKeys: string[]
  timing: number
}

interface ValidateOptions {
  allowPartial?: boolean
}
// #endregion

export function useComboValidator() {
  // #region composables
  const { isMac } = useModifiers()
  // #endregion

  // #region methods
  function normalizeCombo(keys: string[]): string[] {
    const normalized = keys.map((k) => {
      if (k === 'Ctrl/Cmd') return isMac.value ? 'Cmd' : 'Ctrl'
      return k
    })

    return normalized.sort((a, b) => {
      const ai = MODIFIER_ORDER.indexOf(a as Modifier)
      const bi = MODIFIER_ORDER.indexOf(b as Modifier)
      if (ai !== -1 && bi !== -1) return ai - bi
      if (ai !== -1) return -1
      if (bi !== -1) return 1
      return a.localeCompare(b)
    })
  }

  function arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false
    return a.every((val, i) => val === b[i])
  }

  function validate(
    pressed: string[],
    expected: string[],
    options: ValidateOptions = {}
  ): ValidationResult {
    const normalizedExpected = normalizeCombo(expected)
    const normalizedPressed = normalizeCombo(pressed)

    const isCorrect = arraysEqual(normalizedPressed, normalizedExpected)

    const isPartial = !isCorrect
      && (options.allowPartial ?? false)
      && normalizedPressed.length > 0
      && normalizedPressed.length < normalizedExpected.length
      && normalizedPressed.every(k => normalizedExpected.includes(k))

    const missingKeys = normalizedExpected.filter(k => !normalizedPressed.includes(k))
    const extraKeys = normalizedPressed.filter(k => !normalizedExpected.includes(k))

    return {
      isCorrect,
      isPartial,
      isTimeout: false,
      pressedKeys: normalizedPressed,
      expectedKeys: normalizedExpected,
      missingKeys,
      extraKeys,
      timing: 0
    }
  }

  function validateWithTimeout(
    expected: string[],
    timeoutMs: number
  ): Promise<ValidationResult> {
    return new Promise((resolve) => {
      const startTime = Date.now()
      let resolved = false
      const heldKeys = new Set<string>()

      const KEY_MAP: Record<string, string> = {
        'Control': 'Ctrl', 'Meta': 'Cmd', 'Alt': 'Alt', 'Shift': 'Shift',
        'Escape': 'Esc', 'Backspace': 'Backspace', 'Delete': 'Delete',
        'Enter': 'Enter', 'Tab': 'Tab', ' ': 'Space',
        'ArrowUp': 'Up', 'ArrowDown': 'Down', 'ArrowLeft': 'Left', 'ArrowRight': 'Right'
      }

      function normalizeKey(e: KeyboardEvent): string {
        if (e.key.length === 1) return e.key.toUpperCase()
        return KEY_MAP[e.key] ?? e.key
      }

      function getCombo(): string[] {
        const MODS = ['Ctrl', 'Cmd', 'Alt', 'Shift']
        const all = Array.from(heldKeys)
        const mods = all.filter(k => MODS.includes(k))
          .sort((a, b) => MODS.indexOf(a) - MODS.indexOf(b))
        const rest = all.filter(k => !MODS.includes(k)).sort()
        return [...mods, ...rest]
      }

      const finish = (result: ValidationResult) => {
        if (resolved) return
        resolved = true
        clearTimeout(timeoutId)
        globalThis.removeEventListener('keydown', onKeyDown)
        globalThis.removeEventListener('keyup', onKeyUp)
        resolve(result)
      }

      const onKeyDown = (e: KeyboardEvent) => {
        heldKeys.add(normalizeKey(e))
        const result = validate(getCombo(), expected, { allowPartial: true })
        if (result.isCorrect) {
          finish({ ...result, timing: Date.now() - startTime })
        }
      }

      const onKeyUp = (e: KeyboardEvent) => {
        heldKeys.delete(normalizeKey(e))
      }

      globalThis.addEventListener('keydown', onKeyDown)
      globalThis.addEventListener('keyup', onKeyUp)

      const timeoutId = setTimeout(() => {
        finish({
          ...validate(getCombo(), expected),
          isTimeout: true,
          timing: timeoutMs
        })
      }, timeoutMs)
    })
  }
  // #endregion

  return {
    validate,
    normalizeCombo,
    validateWithTimeout
  }
}
