// #region setup
const MODIFIER_ORDER = ['Ctrl', 'Cmd', 'Alt', 'Shift'] as const
type Modifier = typeof MODIFIER_ORDER[number]
// #endregion

export function useModifiers() {
  // #region state
  const isMac = computed(() => {
    if (!import.meta.client) return false
    return navigator.platform.toUpperCase().includes('MAC')
      || navigator.userAgent.toUpperCase().includes('MAC')
  })

  const modifiers = reactive({
    ctrl: false,
    shift: false,
    alt: false,
    meta: false
  })
  // #endregion

  // #region computed
  const activeModifiers = computed<Modifier[]>(() => {
    const active: Modifier[] = []
    if (modifiers.ctrl) active.push('Ctrl')
    if (modifiers.meta) active.push('Cmd')
    if (modifiers.alt) active.push('Alt')
    if (modifiers.shift) active.push('Shift')
    return active
  })

  // Display symbols for current platform
  const modifierSymbols = computed<Record<Modifier, string>>(() => ({
    Ctrl: isMac.value ? '⌃' : 'Ctrl',
    Cmd: '⌘',
    Alt: isMac.value ? '⌥' : 'Alt',
    Shift: isMac.value ? '⇧' : 'Shift'
  }))

  // The primary "control" modifier for the platform
  const primaryModifier = computed(() => isMac.value ? 'Cmd' : 'Ctrl')
  // #endregion

  // #region methods
  function updateFromEvent(e: KeyboardEvent) {
    modifiers.ctrl = e.ctrlKey
    modifiers.shift = e.shiftKey
    modifiers.alt = e.altKey
    modifiers.meta = e.metaKey
  }

  function resetAll() {
    modifiers.ctrl = false
    modifiers.shift = false
    modifiers.alt = false
    modifiers.meta = false
  }

  // Match a single expected modifier against the pressed set.
  // 'Ctrl/Cmd' matches either Ctrl (Windows) or Cmd (Mac).
  function matchModifier(expected: string, pressed: string[]): boolean {
    if (expected === 'Ctrl/Cmd') {
      return pressed.includes('Ctrl') || pressed.includes('Cmd')
    }
    // On Mac, treat Ctrl requirement as Cmd (common shortcut mapping)
    if (expected === 'Ctrl' && isMac.value) {
      return pressed.includes('Ctrl') || pressed.includes('Cmd')
    }
    return pressed.includes(expected)
  }

  // Normalize a combo for display on current platform:
  // replaces 'Ctrl/Cmd' with platform-appropriate key name
  function normalizeToPlatform(keys: string[]): string[] {
    return keys.map((k) => {
      if (k === 'Ctrl/Cmd') return isMac.value ? 'Cmd' : 'Ctrl'
      return k
    })
  }

  // Format a combo as human-readable string with platform symbols
  function formatCombo(keys: string[]): string {
    return normalizeToPlatform(keys)
      .map((k) => {
        const sym = modifierSymbols.value[k as Modifier]
        return sym ?? k
      })
      .join(isMac.value ? '' : ' + ')
  }

  // Sort keys in canonical modifier-first order
  function sortCombo(keys: string[]): string[] {
    return [...keys].sort((a, b) => {
      const ai = MODIFIER_ORDER.indexOf(a as Modifier)
      const bi = MODIFIER_ORDER.indexOf(b as Modifier)
      if (ai !== -1 && bi !== -1) return ai - bi
      if (ai !== -1) return -1
      if (bi !== -1) return 1
      return a.localeCompare(b)
    })
  }
  // #endregion

  // #region lifecycle — sticky modifier fix
  onMounted(() => {
    globalThis.addEventListener('keydown', updateFromEvent)
    globalThis.addEventListener('keyup', updateFromEvent)
    globalThis.addEventListener('blur', resetAll)
    if (import.meta.client) {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) resetAll()
      })
    }
  })

  onUnmounted(() => {
    globalThis.removeEventListener('keydown', updateFromEvent)
    globalThis.removeEventListener('keyup', updateFromEvent)
    globalThis.removeEventListener('blur', resetAll)
  })
  // #endregion

  return {
    isMac: readonly(isMac),
    modifiers: readonly(modifiers),
    activeModifiers,
    modifierSymbols,
    primaryModifier,
    matchModifier,
    normalizeToPlatform,
    formatCombo,
    sortCombo
  }
}
