// #region setup
const KEY_MAP: Record<string, string> = {
  'Control': 'Ctrl',
  'Meta': 'Cmd',
  'Alt': 'Alt',
  'Shift': 'Shift',
  'Escape': 'Esc',
  'Backspace': 'Backspace',
  'Delete': 'Delete',
  'Enter': 'Enter',
  'Tab': 'Tab',
  ' ': 'Space',
  'ArrowUp': 'Up',
  'ArrowDown': 'Down',
  'ArrowLeft': 'Left',
  'ArrowRight': 'Right',
  'CapsLock': 'CapsLock',
  'PageUp': 'PageUp',
  'PageDown': 'PageDown',
  'Home': 'Home',
  'End': 'End',
  'Insert': 'Insert',
  'PrintScreen': 'PrtSc',
  'F1': 'F1', 'F2': 'F2', 'F3': 'F3', 'F4': 'F4',
  'F5': 'F5', 'F6': 'F6', 'F7': 'F7', 'F8': 'F8',
  'F9': 'F9', 'F10': 'F10', 'F11': 'F11', 'F12': 'F12'
}

const MODIFIERS = new Set(['Ctrl', 'Cmd', 'Alt', 'Shift'])
// #endregion

export function useKeyCapture() {
  // #region state
  const pressedKeys = ref<Set<string>>(new Set())
  const isCapturing = ref(false)
  const lastKeyCombo = ref<string[]>([])
  // #endregion

  // #region methods
  function normalizeKey(e: KeyboardEvent): string {
    // Single-char letters → uppercase
    if (e.key.length === 1) return e.key.toUpperCase()
    return KEY_MAP[e.key] ?? e.key
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!isCapturing.value) return

    const key = normalizeKey(e)
    pressedKeys.value = new Set(pressedKeys.value)
    pressedKeys.value.add(key)

    // Prevent browser from stealing Ctrl/Cmd combos during gameplay
    if (pressedKeys.value.has('Ctrl') || pressedKeys.value.has('Cmd')) {
      e.preventDefault()
    }

    lastKeyCombo.value = getCurrentCombo()
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (!isCapturing.value) return

    const key = normalizeKey(e)
    pressedKeys.value = new Set(pressedKeys.value)
    pressedKeys.value.delete(key)
  }

  function clearKeys() {
    pressedKeys.value = new Set()
    lastKeyCombo.value = []
  }

  function getCurrentCombo(): string[] {
    const pressed = Array.from(pressedKeys.value)
    const mods = pressed.filter(k => MODIFIERS.has(k))
      .sort((a, b) => {
        const order = ['Ctrl', 'Cmd', 'Alt', 'Shift']
        return order.indexOf(a) - order.indexOf(b)
      })
    const keys = pressed.filter(k => !MODIFIERS.has(k)).sort()
    return [...mods, ...keys]
  }

  function startCapture() {
    isCapturing.value = true
    clearKeys()
  }

  function stopCapture() {
    isCapturing.value = false
    clearKeys()
  }
  // #endregion

  // #region lifecycle
  onMounted(() => {
    globalThis.addEventListener('keydown', handleKeyDown)
    globalThis.addEventListener('keyup', handleKeyUp)
    globalThis.addEventListener('blur', clearKeys)
  })

  onUnmounted(() => {
    globalThis.removeEventListener('keydown', handleKeyDown)
    globalThis.removeEventListener('keyup', handleKeyUp)
    globalThis.removeEventListener('blur', clearKeys)
  })
  // #endregion

  return {
    pressedKeys: readonly(pressedKeys),
    isCapturing: readonly(isCapturing),
    lastKeyCombo: readonly(lastKeyCombo),
    startCapture,
    stopCapture,
    getCurrentCombo,
    normalizeKey
  }
}
