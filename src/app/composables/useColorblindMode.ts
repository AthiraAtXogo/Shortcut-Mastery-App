/**
 * Color vision deficiency support via CSS SVG filters.
 * Simulates or compensates for 4 common types of colour blindness.
 */

export type ColorblindMode = 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'achromatopsia'

export interface ColorblindModeInfo {
  id: ColorblindMode
  label: string
  description: string
  prevalence: string
}

export const COLORBLIND_MODES: ColorblindModeInfo[] = [
  {
    id: 'none',
    label: 'Normal vision',
    description: 'No colour vision adjustment',
    prevalence: ''
  },
  {
    id: 'deuteranopia',
    label: 'Deuteranopia',
    description: 'Red-green colour blindness (green-weak)',
    prevalence: '~5% of males'
  },
  {
    id: 'protanopia',
    label: 'Protanopia',
    description: 'Red-green colour blindness (red-weak)',
    prevalence: '~1% of males'
  },
  {
    id: 'tritanopia',
    label: 'Tritanopia',
    description: 'Blue-yellow colour blindness',
    prevalence: '~0.01% of population'
  },
  {
    id: 'achromatopsia',
    label: 'Achromatopsia',
    description: 'Complete colour blindness (greyscale)',
    prevalence: '~0.003% of population'
  }
]

// SVG filter matrices for each mode
const SVG_FILTERS: Record<ColorblindMode, string> = {
  none: '',
  deuteranopia: `
    <filter id="cb-filter">
      <feColorMatrix type="matrix" values="
        0.625 0.375 0   0 0
        0.7   0.3   0   0 0
        0     0.3   0.7 0 0
        0     0     0   1 0
      "/>
    </filter>`,
  protanopia: `
    <filter id="cb-filter">
      <feColorMatrix type="matrix" values="
        0.567 0.433 0     0 0
        0.558 0.442 0     0 0
        0     0.242 0.758 0 0
        0     0     0     1 0
      "/>
    </filter>`,
  tritanopia: `
    <filter id="cb-filter">
      <feColorMatrix type="matrix" values="
        0.95  0.05  0     0 0
        0     0.433 0.567 0 0
        0     0.475 0.525 0 0
        0     0     0     1 0
      "/>
    </filter>`,
  achromatopsia: `
    <filter id="cb-filter">
      <feColorMatrix type="matrix" values="
        0.299 0.587 0.114 0 0
        0.299 0.587 0.114 0 0
        0.299 0.587 0.114 0 0
        0     0     0     1 0
      "/>
    </filter>`
}

const SVG_NS = 'http://www.w3.org/2000/svg'

export function useColorblindMode() {
  // #region state
  const mode = ref<ColorblindMode>('none')
  // #endregion

  // #region computed
  const isActive = computed(() => mode.value !== 'none')
  const currentInfo = computed(
    () => COLORBLIND_MODES.find(m => m.id === mode.value) ?? COLORBLIND_MODES[0]!
  )
  // #endregion

  // #region methods
  function setMode(newMode: ColorblindMode): void {
    mode.value = newMode
    if (import.meta.client) applyToDom()
  }

  function applyToDom(): void {
    if (!import.meta.client) return

    const root = document.documentElement

    // Remove previous colorblind class
    root.classList.remove('colorblind-active')

    // Remove existing SVG filter element
    const existing = document.getElementById('cb-svg-filters')
    existing?.remove()

    if (mode.value === 'none') {
      root.style.removeProperty('filter')
      return
    }

    // Inject SVG filter definition into DOM
    const svg = document.createElementNS(SVG_NS, 'svg')
    svg.id = 'cb-svg-filters'
    svg.setAttribute('aria-hidden', 'true')
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'
    svg.innerHTML = SVG_FILTERS[mode.value]
    document.body.appendChild(svg)

    // Apply filter to root
    root.style.filter = 'url(#cb-filter)'
    root.classList.add('colorblind-active')
  }

  function reset(): void {
    setMode('none')
  }
  // #endregion

  return {
    mode: readonly(mode),
    isActive,
    currentInfo,
    modes: COLORBLIND_MODES,
    setMode,
    reset,
    applyToDom
  }
}
