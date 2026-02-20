import type { Shortcut, ShortcutKey } from '~/types/shortcut'

// #region constants
const MAC_SYMBOLS: Partial<Record<ShortcutKey, string>> = {
  Ctrl: '⌃', Cmd: '⌘', Alt: '⌥', Shift: '⇧'
}

const WIN_LABELS: Partial<Record<ShortcutKey, string>> = {
  Ctrl: 'Ctrl', Alt: 'Alt', Shift: 'Shift'
}
// #endregion

// #region utils
export function formatKeys(keys: ShortcutKey[]): string {
  return keys.join(' + ')
}

export function formatKeysForPlatform(
  shortcut: Shortcut,
  platform: 'windows' | 'mac'
): string {
  const keys = platform === 'mac' && shortcut.keysMac
    ? shortcut.keysMac
    : shortcut.keys

  if (platform === 'mac') {
    return keys.map(k => MAC_SYMBOLS[k] ?? k).join('')
  }

  return keys.map(k => WIN_LABELS[k] ?? k).join(' + ')
}

export function validateShortcut(s: Shortcut): boolean {
  if (!s.id || !s.app || !s.action) return false
  if (!s.keys || s.keys.length === 0) return false
  return true
}

export function assignDifficulty(keys: ShortcutKey[]): import('~/types/shortcut').Difficulty {
  const modifiers = keys.filter(k => ['Ctrl', 'Cmd', 'Alt', 'Shift'].includes(k))
  const others = keys.filter(k => !['Ctrl', 'Cmd', 'Alt', 'Shift'].includes(k))

  if (modifiers.length <= 1 && others.length === 1) return 'easy'
  if (modifiers.length >= 2 || others.length >= 2) return 'hard'
  return 'medium'
}
// #endregion
