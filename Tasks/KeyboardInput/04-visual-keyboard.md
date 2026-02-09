# Task: Visual Keyboard Component

## Objective

Create a 2D visual keyboard component that shows key states and highlights expected keys.

## Requirements

- [ ] Create VisualKeyboard.vue component
- [ ] Full QWERTY layout
- [ ] Show pressed key states
- [ ] Highlight expected keys
- [ ] Support different sizes
- [ ] Animate key presses

## Technical Details

### Keyboard Layout Data

```typescript
interface KeyDef {
  code: string       // Keyboard code
  label: string      // Display label
  width?: number     // Width multiplier (default 1)
  row: number
}

const KEYBOARD_LAYOUT: KeyDef[] = [
  // Row 0 - Function keys
  { code: 'Escape', label: 'Esc', row: 0 },
  { code: 'F1', label: 'F1', row: 0 },
  // ... F2-F12

  // Row 1 - Numbers
  { code: 'Backquote', label: '`', row: 1 },
  { code: 'Digit1', label: '1', row: 1 },
  // ... 2-0, -, =
  { code: 'Backspace', label: '⌫', width: 2, row: 1 },

  // Row 2 - QWERTY
  { code: 'Tab', label: 'Tab', width: 1.5, row: 2 },
  { code: 'KeyQ', label: 'Q', row: 2 },
  // ... W-P, [, ], \

  // Row 3 - ASDF
  { code: 'CapsLock', label: 'Caps', width: 1.75, row: 3 },
  { code: 'KeyA', label: 'A', row: 3 },
  // ... S-L, ;, '
  { code: 'Enter', label: 'Enter', width: 2.25, row: 3 },

  // Row 4 - ZXCV
  { code: 'ShiftLeft', label: 'Shift', width: 2.25, row: 4 },
  { code: 'KeyZ', label: 'Z', row: 4 },
  // ... X-M, ,, ., /
  { code: 'ShiftRight', label: 'Shift', width: 2.75, row: 4 },

  // Row 5 - Bottom
  { code: 'ControlLeft', label: 'Ctrl', width: 1.25, row: 5 },
  { code: 'MetaLeft', label: isMac ? '⌘' : 'Win', width: 1.25, row: 5 },
  { code: 'AltLeft', label: isMac ? '⌥' : 'Alt', width: 1.25, row: 5 },
  { code: 'Space', label: '', width: 6.25, row: 5 },
  // ... right side modifiers
]
```

### Component

```vue
<template>
  <div class="visual-keyboard" :class="`visual-keyboard--${size}`">
    <div
      v-for="row in rows"
      :key="row"
      class="visual-keyboard__row"
    >
      <button
        v-for="key in getRowKeys(row)"
        :key="key.code"
        class="visual-keyboard__key"
        :class="{
          'visual-keyboard__key--pressed': isPressed(key.code),
          'visual-keyboard__key--expected': isExpected(key.code),
          'visual-keyboard__key--correct': isCorrect(key.code),
          'visual-keyboard__key--wrong': isWrong(key.code)
        }"
        :style="{ width: `${(key.width ?? 1) * keySize}px` }"
        tabindex="-1"
      >
        {{ key.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  pressedKeys?: string[]
  expectedKeys?: string[]
  correctKeys?: string[]
  wrongKeys?: string[]
  size?: 'sm' | 'md' | 'lg'
}>()

const rows = [0, 1, 2, 3, 4, 5]
const keySize = computed(() => {
  const sizes = { sm: 32, md: 44, lg: 56 }
  return sizes[props.size ?? 'md']
})

const getRowKeys = (row: number) =>
  KEYBOARD_LAYOUT.filter(k => k.row === row)

const isPressed = (code: string) =>
  props.pressedKeys?.includes(codeToKey(code))

const isExpected = (code: string) =>
  props.expectedKeys?.includes(codeToKey(code))

// Map code to key name
const codeToKey = (code: string): string => {
  // Convert KeyA -> A, ControlLeft -> Ctrl, etc.
}
</script>

<style scoped>
.visual-keyboard {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.visual-keyboard__row {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.visual-keyboard__key {
  height: 44px;
  background: var(--bg-tertiary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: var(--text-secondary);
  font-size: 12px;
  font-family: var(--font-mono);
  transition: all 0.1s;
}

.visual-keyboard__key--pressed {
  background: var(--primary-500);
  color: var(--bg-primary);
  transform: translateY(2px);
  box-shadow: 0 0 10px var(--primary-500);
}

.visual-keyboard__key--expected {
  border-color: var(--primary-500);
  animation: pulse 1s infinite;
}

.visual-keyboard__key--correct {
  background: var(--success-500);
  color: white;
}

.visual-keyboard__key--wrong {
  background: var(--error-500);
  color: white;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
```

## Acceptance Criteria

- Full keyboard layout renders
- Pressed keys highlight
- Expected keys pulse
- Correct/wrong states show
- Multiple sizes work
- Responsive layout

## Notes

Important visual feedback - helps users learn key positions.
