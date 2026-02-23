<script setup lang="ts">
// #region setup
interface KeyDef {
  code: string
  label: string
  width?: number
  row: number
}

interface Props {
  pressedKeys?: string[]
  expectedKeys?: string[]
  correctKeys?: string[]
  wrongKeys?: string[]
  size?: 'sm' | 'md' | 'lg'
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pressedKeys: () => [],
  expectedKeys: () => [],
  correctKeys: () => [],
  wrongKeys: () => [],
  size: 'md',
  clickable: false
})

const emit = defineEmits<{
  'key-click': [key: string]
}>()
// #endregion

// #region composables
const { isMac } = useModifiers()
// #endregion

// #region state
const KEYBOARD_LAYOUT: KeyDef[] = [
  // Row 0 - Esc + Function keys
  { code: 'Escape', label: 'Esc', row: 0 },
  { code: 'F1', label: 'F1', row: 0 },
  { code: 'F2', label: 'F2', row: 0 },
  { code: 'F3', label: 'F3', row: 0 },
  { code: 'F4', label: 'F4', row: 0 },
  { code: 'F5', label: 'F5', row: 0 },
  { code: 'F6', label: 'F6', row: 0 },
  { code: 'F7', label: 'F7', row: 0 },
  { code: 'F8', label: 'F8', row: 0 },
  { code: 'F9', label: 'F9', row: 0 },
  { code: 'F10', label: 'F10', row: 0 },
  { code: 'F11', label: 'F11', row: 0 },
  { code: 'F12', label: 'F12', row: 0 },

  // Row 1 - Number row
  { code: 'Backquote', label: '`', row: 1 },
  { code: 'Digit1', label: '1', row: 1 },
  { code: 'Digit2', label: '2', row: 1 },
  { code: 'Digit3', label: '3', row: 1 },
  { code: 'Digit4', label: '4', row: 1 },
  { code: 'Digit5', label: '5', row: 1 },
  { code: 'Digit6', label: '6', row: 1 },
  { code: 'Digit7', label: '7', row: 1 },
  { code: 'Digit8', label: '8', row: 1 },
  { code: 'Digit9', label: '9', row: 1 },
  { code: 'Digit0', label: '0', row: 1 },
  { code: 'Minus', label: '-', row: 1 },
  { code: 'Equal', label: '=', row: 1 },
  { code: 'Backspace', label: '⌫', width: 2, row: 1 },

  // Row 2 - QWERTY
  { code: 'Tab', label: 'Tab', width: 1.5, row: 2 },
  { code: 'KeyQ', label: 'Q', row: 2 },
  { code: 'KeyW', label: 'W', row: 2 },
  { code: 'KeyE', label: 'E', row: 2 },
  { code: 'KeyR', label: 'R', row: 2 },
  { code: 'KeyT', label: 'T', row: 2 },
  { code: 'KeyY', label: 'Y', row: 2 },
  { code: 'KeyU', label: 'U', row: 2 },
  { code: 'KeyI', label: 'I', row: 2 },
  { code: 'KeyO', label: 'O', row: 2 },
  { code: 'KeyP', label: 'P', row: 2 },
  { code: 'BracketLeft', label: '[', row: 2 },
  { code: 'BracketRight', label: ']', row: 2 },
  { code: 'Backslash', label: '\\', width: 1.5, row: 2 },

  // Row 3 - ASDF
  { code: 'CapsLock', label: 'Caps', width: 1.75, row: 3 },
  { code: 'KeyA', label: 'A', row: 3 },
  { code: 'KeyS', label: 'S', row: 3 },
  { code: 'KeyD', label: 'D', row: 3 },
  { code: 'KeyF', label: 'F', row: 3 },
  { code: 'KeyG', label: 'G', row: 3 },
  { code: 'KeyH', label: 'H', row: 3 },
  { code: 'KeyJ', label: 'J', row: 3 },
  { code: 'KeyK', label: 'K', row: 3 },
  { code: 'KeyL', label: 'L', row: 3 },
  { code: 'Semicolon', label: ';', row: 3 },
  { code: 'Quote', label: '\'', row: 3 },
  { code: 'Enter', label: 'Enter', width: 2.25, row: 3 },

  // Row 4 - ZXCV
  { code: 'ShiftLeft', label: 'Shift', width: 2.25, row: 4 },
  { code: 'KeyZ', label: 'Z', row: 4 },
  { code: 'KeyX', label: 'X', row: 4 },
  { code: 'KeyC', label: 'C', row: 4 },
  { code: 'KeyV', label: 'V', row: 4 },
  { code: 'KeyB', label: 'B', row: 4 },
  { code: 'KeyN', label: 'N', row: 4 },
  { code: 'KeyM', label: 'M', row: 4 },
  { code: 'Comma', label: ',', row: 4 },
  { code: 'Period', label: '.', row: 4 },
  { code: 'Slash', label: '/', row: 4 },
  { code: 'ShiftRight', label: 'Shift', width: 2.75, row: 4 },

  // Row 5 - Bottom modifiers
  { code: 'ControlLeft', label: 'Ctrl', width: 1.25, row: 5 },
  { code: 'MetaLeft', label: 'Win', width: 1.25, row: 5 },
  { code: 'AltLeft', label: 'Alt', width: 1.25, row: 5 },
  { code: 'Space', label: '', width: 6.25, row: 5 },
  { code: 'AltRight', label: 'Alt', width: 1.25, row: 5 },
  { code: 'MetaRight', label: 'Win', width: 1.25, row: 5 },
  { code: 'ControlRight', label: 'Ctrl', width: 1.25, row: 5 }
]

// Map from keyboard code → normalized key name (matching useKeyCapture output)
const CODE_TO_KEY: Record<string, string> = {
  ControlLeft: 'Ctrl', ControlRight: 'Ctrl',
  MetaLeft: 'Cmd', MetaRight: 'Cmd',
  AltLeft: 'Alt', AltRight: 'Alt',
  ShiftLeft: 'Shift', ShiftRight: 'Shift',
  Space: 'Space',
  Enter: 'Enter',
  Backspace: 'Backspace',
  Tab: 'Tab',
  CapsLock: 'CapsLock',
  Escape: 'Esc',
  Backquote: '`',
  Minus: '-',
  Equal: '=',
  BracketLeft: '[',
  BracketRight: ']',
  Backslash: '\\',
  Semicolon: ';',
  Quote: '\'',
  Comma: ',',
  Period: '.',
  Slash: '/'
}

const ROWS = [0, 1, 2, 3, 4, 5]
// #endregion

// #region computed
const keySize = computed(() => {
  const sizes = { sm: 28, md: 40, lg: 52 }
  return sizes[props.size]
})

const metaLabel = computed(() => isMac.value ? '⌘' : 'Win')
const altLabel = computed(() => isMac.value ? '⌥' : 'Alt')
// #endregion

// #region methods
function codeToKey(code: string): string {
  if (CODE_TO_KEY[code]) return CODE_TO_KEY[code]!
  // KeyA → A, Digit1 → 1, F1 → F1
  const keyMatch = code.match(/^Key([A-Z])$/)
  if (keyMatch) return keyMatch[1]!
  const digitMatch = code.match(/^Digit(\d)$/)
  if (digitMatch) return digitMatch[1]!
  return code
}

function getLabel(key: KeyDef): string {
  if (key.code === 'MetaLeft' || key.code === 'MetaRight') return metaLabel.value
  if (key.code === 'AltLeft' || key.code === 'AltRight') return altLabel.value
  return key.label
}

function getRowKeys(row: number): KeyDef[] {
  return KEYBOARD_LAYOUT.filter(k => k.row === row)
}

function isPressed(code: string): boolean {
  return props.pressedKeys.includes(codeToKey(code))
}

function isExpected(code: string): boolean {
  return props.expectedKeys.includes(codeToKey(code))
}

function isCorrect(code: string): boolean {
  return props.correctKeys.includes(codeToKey(code))
}

function isWrong(code: string): boolean {
  return props.wrongKeys.includes(codeToKey(code))
}
// #endregion
</script>

<template>
  <div
    class="visual-keyboard"
    :class="`visual-keyboard--${size}`"
  >
    <div
      v-for="row in ROWS"
      :key="row"
      class="visual-keyboard__row"
    >
      <div
        v-for="key in getRowKeys(row)"
        :key="key.code"
        class="visual-keyboard__key"
        :class="{
          'visual-keyboard__key--pressed': isPressed(key.code),
          'visual-keyboard__key--expected': isExpected(key.code),
          'visual-keyboard__key--correct': isCorrect(key.code),
          'visual-keyboard__key--wrong': isWrong(key.code),
          'visual-keyboard__key--clickable': clickable
        }"
        :style="{ width: `${(key.width ?? 1) * keySize}px`, height: `${keySize}px` }"
        @click="clickable && emit('key-click', codeToKey(key.code))"
      >
        {{ getLabel(key) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.visual-keyboard {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #12121a;
  border: 1px solid #1a1a2e;
  border-radius: 12px;
  user-select: none;
}

.visual-keyboard__row {
  display: flex;
  gap: 4px;
}

.visual-keyboard__key {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a2e;
  border: 1px solid #2a2a3e;
  border-bottom: 3px solid #111;
  border-radius: 5px;
  color: #888;
  font-size: 11px;
  font-family: monospace;
  cursor: default;
  transition: background 0.08s, color 0.08s, transform 0.08s, box-shadow 0.08s;
  white-space: nowrap;
  overflow: hidden;
  flex-shrink: 0;
}

.visual-keyboard__key--pressed {
  background: #00d4ff;
  border-color: #00d4ff;
  border-bottom-color: #0090aa;
  color: #000;
  transform: translateY(2px);
  box-shadow: 0 0 12px #00d4ff88;
}

.visual-keyboard__key--expected {
  border-color: #a855f7;
  color: #a855f7;
  animation: pulse-key 1s ease-in-out infinite;
}

.visual-keyboard__key--correct {
  background: #4ade80;
  border-color: #4ade80;
  border-bottom-color: #15803d;
  color: #000;
  box-shadow: 0 0 10px #4ade8066;
}

.visual-keyboard__key--wrong {
  background: #f87171;
  border-color: #f87171;
  border-bottom-color: #b91c1c;
  color: #000;
  box-shadow: 0 0 10px #f8717166;
}

@keyframes pulse-key {
  0%, 100% { opacity: 1; box-shadow: 0 0 6px #a855f766; }
  50% { opacity: 0.6; box-shadow: 0 0 14px #a855f7aa; }
}

.visual-keyboard__key--clickable {
  cursor: pointer;
}

.visual-keyboard__key--clickable:hover {
  background: #2e2e48;
  color: #e0e0e0;
  border-color: #4a4a6a;
}

.visual-keyboard__key--clickable:active {
  transform: translateY(2px);
  background: #3a3a5a;
}

/* Size variants */
.visual-keyboard--sm .visual-keyboard__key { font-size: 9px; border-radius: 4px; }
.visual-keyboard--lg .visual-keyboard__key { font-size: 13px; border-radius: 6px; }
</style>
