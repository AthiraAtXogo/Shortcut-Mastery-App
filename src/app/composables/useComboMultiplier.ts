/** Combo scoring system — tracks consecutive correct answers and applies multipliers */

export interface ComboTier {
  minCombo: number
  multiplier: number
  label: string
  color: string
}

export const COMBO_TIERS: ComboTier[] = [
  { minCombo: 1, multiplier: 1, label: '', color: '#94a3b8' },
  { minCombo: 3, multiplier: 1.5, label: 'Good!', color: '#4ade80' },
  { minCombo: 5, multiplier: 2, label: 'Great!', color: '#00d4ff' },
  { minCombo: 10, multiplier: 2.5, label: 'Amazing!', color: '#a855f7' },
  { minCombo: 20, multiplier: 3, label: 'LEGENDARY!', color: '#f59e0b' }
]

export function useComboMultiplier() {
  // #region state
  const combo = ref(0)
  const maxCombo = ref(0)
  const totalScore = ref(0)
  // #endregion

  // #region computed
  const currentTier = computed(() => {
    let tier = COMBO_TIERS[0]!
    for (const t of COMBO_TIERS) {
      if (combo.value >= t.minCombo) tier = t
    }
    return tier
  })

  const multiplier = computed(() => currentTier.value.multiplier)

  const comboLabel = computed(() => currentTier.value.label)

  const comboColor = computed(() => currentTier.value.color)

  const nextTier = computed(() => {
    return COMBO_TIERS.find(t => t.minCombo > combo.value) ?? null
  })

  const combosToNextTier = computed(() => {
    const next = nextTier.value
    return next ? next.minCombo - combo.value : 0
  })
  // #endregion

  // #region methods
  /**
   * Record a correct answer. Returns the XP awarded.
   * @param baseXp - base XP before multiplier (default 10)
   * @param speedBonus - additional flat XP from speed (0-25)
   */
  function onCorrect(baseXp: number = 10, speedBonus: number = 0): number {
    combo.value++
    if (combo.value > maxCombo.value) maxCombo.value = combo.value

    const comboBonus = Math.floor(combo.value / 5) * 5
    const xp = Math.round((baseXp + speedBonus + comboBonus) * multiplier.value)
    totalScore.value += xp
    return xp
  }

  /** Record a wrong answer — resets combo. Returns 0. */
  function onWrong(): number {
    combo.value = 0
    return 0
  }

  function reset() {
    combo.value = 0
    maxCombo.value = 0
    totalScore.value = 0
  }
  // #endregion

  return {
    combo: readonly(combo),
    maxCombo: readonly(maxCombo),
    totalScore: readonly(totalScore),
    currentTier,
    multiplier,
    comboLabel,
    comboColor,
    nextTier,
    combosToNextTier,
    onCorrect,
    onWrong,
    reset
  }
}
