// #region types
export type AppId
  = | 'windows'
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

export type ShortcutKey
  = | 'Ctrl' | 'Cmd' | 'Alt' | 'Shift'
    | 'Enter' | 'Esc' | 'Tab' | 'Space' | 'Backspace' | 'Delete'
    | 'Up' | 'Down' | 'Left' | 'Right'
    | 'Home' | 'End' | 'PageUp' | 'PageDown'
    | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6'
    | 'F7' | 'F8' | 'F9' | 'F10' | 'F11' | 'F12'
    | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
    | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
    | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
    | '[' | ']' | '\\' | ';' | '\'' | ',' | '.' | '/' | '`' | '-' | '='

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Frequency = 'common' | 'occasional' | 'rare'

export type Platform = 'windows' | 'mac' | 'both' | 'web'

export interface Shortcut {
  id: string
  app: AppId
  category: string
  action: string
  description: string
  keys: ShortcutKey[]
  keysDisplay: string
  keysMac?: ShortcutKey[]
  keysMacDisplay?: string
  difficulty: Difficulty
  tags: string[]
  frequency: Frequency
  context?: string
}

export interface AppDefinition {
  id: AppId
  name: string
  icon: string
  platform: Platform
  categories: CategoryDefinition[]
}

export interface CategoryDefinition {
  id: string
  name: string
  description: string
}
// #endregion
