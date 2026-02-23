/**
 * High contrast theme — applies CSS class to <html> and overrides
 * color tokens via CSS custom properties for WCAG AA contrast ratios.
 */

export type ContrastMode = 'normal' | 'high' | 'ultra'

const CONTRAST_TOKENS: Record<ContrastMode, Record<string, string>> = {
  normal: {},
  high: {
    '--bg-primary': '#000000',
    '--bg-secondary': '#0a0a0a',
    '--bg-tertiary': '#111111',
    '--bg-card': '#0d0d0d',
    '--text-primary': '#ffffff',
    '--text-secondary': '#e2e8f0',
    '--text-muted': '#94a3b8',
    '--primary-500': '#00ffff',
    '--primary-400': '#7ffff7',
    '--border-color': '#ffffff',
    '--key-bg': '#1a1a1a',
    '--key-border': '#ffffff',
    '--key-text': '#ffffff'
  },
  ultra: {
    '--bg-primary': '#000000',
    '--bg-secondary': '#000000',
    '--bg-tertiary': '#000000',
    '--bg-card': '#000000',
    '--text-primary': '#ffffff',
    '--text-secondary': '#ffffff',
    '--text-muted': '#ffffff',
    '--primary-500': '#ffff00',
    '--primary-400': '#ffff00',
    '--border-color': '#ffffff',
    '--key-bg': '#000000',
    '--key-border': '#ffff00',
    '--key-text': '#ffff00'
  }
}

export function useHighContrast() {
  // #region state
  const mode = ref<ContrastMode>('normal')
  // #endregion

  // #region computed
  const isActive = computed(() => mode.value !== 'normal')
  const tokens = computed(() => CONTRAST_TOKENS[mode.value])
  // #endregion

  // #region methods
  function setMode(newMode: ContrastMode): void {
    mode.value = newMode
    if (import.meta.client) applyToDom()
  }

  function applyToDom(): void {
    if (!import.meta.client) return

    const root = document.documentElement

    // Remove previous contrast classes
    root.classList.remove('high-contrast', 'ultra-contrast')

    if (mode.value === 'high') root.classList.add('high-contrast')
    else if (mode.value === 'ultra') root.classList.add('ultra-contrast')

    // Apply CSS token overrides
    const currentTokens = CONTRAST_TOKENS[mode.value]
    Object.entries(currentTokens).forEach(([prop, value]) => {
      root.style.setProperty(prop, value)
    })

    // Clear overrides when reverting to normal
    if (mode.value === 'normal') {
      Object.keys(CONTRAST_TOKENS.high).forEach((prop) => {
        root.style.removeProperty(prop)
      })
    }
  }

  function toggle(): void {
    setMode(mode.value === 'normal' ? 'high' : 'normal')
  }
  // #endregion

  return {
    mode: readonly(mode),
    isActive,
    tokens,
    setMode,
    toggle,
    applyToDom
  }
}
