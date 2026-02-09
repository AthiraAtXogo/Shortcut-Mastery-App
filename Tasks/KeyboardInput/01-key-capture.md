# Task: Key Capture System

## Objective

Create a global keyboard event capture system that tracks all key presses during gameplay.

## Requirements

- [ ] Create useKeyCapture composable
- [ ] Capture keydown/keyup events globally
- [ ] Track currently pressed keys
- [ ] Normalize key codes across browsers
- [ ] Prevent default for game shortcuts
- [ ] Enable/disable capture (menu vs game)

## Technical Details

### Key Normalization

```typescript
// Map browser key codes to consistent names
const KEY_MAP: Record<string, string> = {
  'Control': 'Ctrl',
  'Meta': 'Cmd',      // Mac Command key
  'Alt': 'Alt',
  'Shift': 'Shift',
  'Escape': 'Esc',
  'Backspace': 'Backspace',
  'Delete': 'Delete',
  'Enter': 'Enter',
  'Tab': 'Tab',
  'Space': 'Space',
  'ArrowUp': 'Up',
  'ArrowDown': 'Down',
  'ArrowLeft': 'Left',
  'ArrowRight': 'Right',
  // Letters and numbers pass through as-is
}
```

### Implementation

```typescript
// composables/useKeyCapture.ts
export function useKeyCapture() {
  const pressedKeys = ref<Set<string>>(new Set())
  const isCapturing = ref(false)
  const lastKeyCombo = ref<string[]>([])

  const normalizeKey = (e: KeyboardEvent): string => {
    const key = e.key
    return KEY_MAP[key] ?? key.toUpperCase()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isCapturing.value) return

    const key = normalizeKey(e)
    pressedKeys.value.add(key)

    // Prevent default for non-system shortcuts during gameplay
    if (pressedKeys.value.has('Ctrl') || pressedKeys.value.has('Cmd')) {
      e.preventDefault()
    }

    // Emit current combo
    lastKeyCombo.value = Array.from(pressedKeys.value)
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    if (!isCapturing.value) return

    const key = normalizeKey(e)
    pressedKeys.value.delete(key)
  }

  const startCapture = () => {
    isCapturing.value = true
    pressedKeys.value.clear()
  }

  const stopCapture = () => {
    isCapturing.value = false
    pressedKeys.value.clear()
  }

  const getCurrentCombo = (): string[] => {
    // Return in consistent order: modifiers first, then key
    const modifiers = ['Ctrl', 'Cmd', 'Alt', 'Shift']
    const pressed = Array.from(pressedKeys.value)

    const mods = pressed.filter(k => modifiers.includes(k)).sort()
    const keys = pressed.filter(k => !modifiers.includes(k))

    return [...mods, ...keys]
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    // Clear on window blur (user switches away)
    window.addEventListener('blur', () => pressedKeys.value.clear())
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  })

  return {
    pressedKeys: readonly(pressedKeys),
    isCapturing: readonly(isCapturing),
    lastKeyCombo: readonly(lastKeyCombo),
    startCapture,
    stopCapture,
    getCurrentCombo
  }
}
```

### Usage

```vue
<script setup>
const { pressedKeys, startCapture, stopCapture, getCurrentCombo } = useKeyCapture()

const startGame = () => {
  startCapture()
}

const checkAnswer = () => {
  const combo = getCurrentCombo()
  console.log('User pressed:', combo.join('+'))
}
</script>
```

## Acceptance Criteria

- All keys captured correctly
- Key names normalized consistently
- Modifiers tracked properly
- Browser shortcuts prevented during game
- Capture can be toggled on/off
- No memory leaks

## Notes

Foundation for all keyboard interaction - test thoroughly.
