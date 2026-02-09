# Task: Shortcut Data Schema

## Objective

Define the complete data schema for shortcuts and related metadata.

## Requirements

- [ ] Shortcut interface definition
- [ ] Category definitions
- [ ] Difficulty criteria
- [ ] Platform handling
- [ ] Validation utilities

## Data Structures

```typescript
// types/shortcut.ts

export interface Shortcut {
  id: string                    // Unique identifier
  app: AppId                    // Application identifier
  category: string              // Category within app
  action: string                // Human-readable action name
  description: string           // Detailed description
  keys: ShortcutKey[]          // Key combination
  keysDisplay: string          // Formatted display string
  keysMac?: ShortcutKey[]      // Mac-specific keys (if different)
  difficulty: Difficulty
  tags: string[]               // Searchable tags
  frequency: 'common' | 'occasional' | 'rare'
  context?: string             // When this shortcut is useful
}

export type AppId =
  | 'windows'
  | 'macos'
  | 'vscode'
  | 'chrome'
  | 'edge'
  | 'firefox'
  | 'claude'
  | 'chatgpt'
  | 'notion'
  | 'slack'
  | 'discord'
  | 'figma'

export type ShortcutKey =
  | 'Ctrl'
  | 'Cmd'
  | 'Alt'
  | 'Shift'
  | 'Enter'
  | 'Esc'
  | 'Tab'
  | 'Space'
  | 'Backspace'
  | 'Delete'
  | 'Up'
  | 'Down'
  | 'Left'
  | 'Right'
  | 'Home'
  | 'End'
  | 'PageUp'
  | 'PageDown'
  | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6'
  | 'F7' | 'F8' | 'F9' | 'F10' | 'F11' | 'F12'
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
  | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | '[' | ']' | '\\' | ';' | '\'' | ',' | '.' | '/' | '`' | '-' | '='

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface AppDefinition {
  id: AppId
  name: string
  icon: string
  categories: CategoryDefinition[]
  platform: 'windows' | 'mac' | 'both' | 'web'
}

export interface CategoryDefinition {
  id: string
  name: string
  description: string
}
```

## Difficulty Criteria

| Difficulty | Criteria |
|------------|----------|
| Easy | 2 keys, common shortcuts (Ctrl+C) |
| Medium | 2-3 keys, less common |
| Hard | 3+ keys, or uncommon combinations |

## Utility Functions

```typescript
// utils/shortcut.ts

export const formatKeys = (keys: ShortcutKey[]): string => {
  return keys.join('+')
}

export const formatKeysForPlatform = (
  shortcut: Shortcut,
  platform: 'windows' | 'mac'
): string => {
  const keys = platform === 'mac' && shortcut.keysMac
    ? shortcut.keysMac
    : shortcut.keys

  return keys
    .map(k => PLATFORM_KEY_SYMBOLS[platform][k] ?? k)
    .join('')
}

const PLATFORM_KEY_SYMBOLS = {
  windows: {
    Ctrl: 'Ctrl+',
    Alt: 'Alt+',
    Shift: 'Shift+',
  },
  mac: {
    Ctrl: '⌃',
    Cmd: '⌘',
    Alt: '⌥',
    Shift: '⇧',
  }
}

export const validateShortcut = (shortcut: Shortcut): boolean => {
  if (!shortcut.id || !shortcut.app || !shortcut.action) return false
  if (!shortcut.keys || shortcut.keys.length === 0) return false
  return true
}
```

## Acceptance Criteria

- All types defined
- Utility functions work correctly
- Schema supports all planned apps
- Platform differences handled
- Validation catches invalid data
