/**
 * Single source of truth for reduced motion preference.
 * Combines system OS preference with optional user override from settings.
 * All GSAP/Three.js composables should read from this.
 */

export function useReducedMotion() {
  // #region state
  const systemPrefers = ref(false)
  const userOverride = ref<boolean | null>(null)
  // #endregion

  // #region lifecycle
  if (import.meta.client) {
    onMounted(() => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      systemPrefers.value = mq.matches
      mq.addEventListener('change', (e) => {
        systemPrefers.value = e.matches
      })
    })
  }
  // #endregion

  // #region computed
  /**
   * True when motion should be reduced.
   * User override takes precedence over OS preference.
   */
  const prefersReducedMotion = computed(() => {
    if (userOverride.value !== null) return userOverride.value
    return systemPrefers.value
  })

  const label = computed(() => {
    if (userOverride.value !== null) {
      return userOverride.value ? 'Reduced (user)' : 'Full (user)'
    }
    return systemPrefers.value ? 'Reduced (system)' : 'Full (system)'
  })
  // #endregion

  // #region methods
  /** Set a manual user preference. Pass null to revert to system preference. */
  function setUserOverride(value: boolean | null): void {
    userOverride.value = value
  }

  /** Apply/remove the .reduced-motion class on <html> so CSS transitions are also suppressed */
  function applyToDom(): void {
    if (!import.meta.client) return
    const el = document.documentElement
    if (prefersReducedMotion.value) {
      el.classList.add('reduced-motion')
    } else {
      el.classList.remove('reduced-motion')
    }
  }
  // #endregion

  // Keep DOM in sync
  if (import.meta.client) {
    watch(prefersReducedMotion, applyToDom, { immediate: false })
  }

  return {
    systemPrefers: readonly(systemPrefers),
    userOverride: readonly(userOverride),
    prefersReducedMotion,
    label,
    setUserOverride,
    applyToDom
  }
}
