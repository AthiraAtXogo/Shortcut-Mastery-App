# Task: Modifier Key Handling

## Objective

Properly track modifier keys (Ctrl, Shift, Alt, Cmd) and handle cross-platform differences.

## Requirements

- [ ] Track all modifier states
- [ ] Handle Mac vs Windows differences
- [ ] Support "either Ctrl or Cmd" matching
- [ ] Handle sticky modifier edge cases
- [ ] Display appropriate symbols per platform

## Technical Details

### Platform Detection

```typescript
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

// Display symbols
const MODIFIER_SYMBOLS = {
  Ctrl: isMac ? '⌃' : 'Ctrl',
  Cmd: '⌘',
  Alt: isMac ? '⌥' : 'Alt',
  Shift: isMac ? '⇧' : 'Shift'
}
```

### Modifier State Tracking

```typescript
// composables/useModifiers.ts
export function useModifiers() {
  const modifiers = reactive({
    ctrl: false,
    shift: false,
    alt: false,
    meta: false  // Cmd on Mac, Win on Windows
  })

  const updateFromEvent = (e: KeyboardEvent) => {
    modifiers.ctrl = e.ctrlKey
    modifiers.shift = e.shiftKey
    modifiers.alt = e.altKey
    modifiers.meta = e.metaKey
  }

  const activeModifiers = computed(() => {
    const active: string[] = []
    if (modifiers.ctrl) active.push('Ctrl')
    if (modifiers.meta) active.push('Cmd')
    if (modifiers.alt) active.push('Alt')
    if (modifiers.shift) active.push('Shift')
    return active
  })

  // For matching: Ctrl on Windows = Cmd on Mac
  const matchModifier = (expected: string, pressed: string[]): boolean => {
    if (expected === 'Ctrl/Cmd') {
      return pressed.includes('Ctrl') || pressed.includes('Cmd')
    }
    return pressed.includes(expected)
  }

  return { modifiers, updateFromEvent, activeModifiers, matchModifier }
}
```

### Cross-Platform Shortcut Definition

```typescript
interface Shortcut {
  id: string
  action: string
  // Platform-specific keys
  windows: string[]  // ['Ctrl', 'C']
  mac: string[]      // ['Cmd', 'C']
  // Or use generic
  keys: string[]     // ['Ctrl/Cmd', 'C'] - matches either
}

// Helper to get correct keys for current platform
const getShortcutKeys = (shortcut: Shortcut): string[] => {
  if (shortcut.keys) return shortcut.keys
  return isMac ? shortcut.mac : shortcut.windows
}
```

### Sticky Modifier Fix

```typescript
// Modifiers can get "stuck" if user switches windows while holding
const resetModifiersOnBlur = () => {
  window.addEventListener('blur', () => {
    modifiers.ctrl = false
    modifiers.shift = false
    modifiers.alt = false
    modifiers.meta = false
  })
}

// Also reset on visibility change
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Reset all modifiers
  }
})
```

## Acceptance Criteria

- All modifiers tracked accurately
- Mac/Windows differences handled
- "Ctrl/Cmd" matching works
- Sticky modifiers don't break gameplay
- Correct symbols displayed per platform

## Notes

Cross-platform modifier handling is tricky - test on both OS.
