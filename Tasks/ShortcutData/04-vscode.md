# Task: VS Code Shortcuts

## Objective

Create comprehensive VS Code shortcut database.

## Requirements

- [ ] All common VS Code shortcuts
- [ ] Categorized properly
- [ ] Difficulty assigned
- [ ] Mac alternatives noted

## Categories

1. **General** - File, window, settings
2. **Editing** - Text manipulation
3. **Navigation** - Moving around
4. **Search** - Find and replace
5. **Multi-cursor** - Multiple selections
6. **Terminal** - Integrated terminal
7. **Debug** - Debugging shortcuts

## Shortcut Data

```typescript
export const VSCODE_SHORTCUTS: Shortcut[] = [
  // === GENERAL ===
  {
    id: 'vscode-command-palette',
    app: 'vscode',
    category: 'general',
    action: 'Command Palette',
    description: 'Open the command palette to run any command',
    keys: ['Ctrl', 'Shift', 'P'],
    keysMac: ['Cmd', 'Shift', 'P'],
    keysDisplay: 'Ctrl+Shift+P',
    difficulty: 'easy',
    tags: ['command', 'palette', 'search'],
    frequency: 'common'
  },
  {
    id: 'vscode-quick-open',
    app: 'vscode',
    category: 'general',
    action: 'Quick Open File',
    description: 'Quickly open any file by name',
    keys: ['Ctrl', 'P'],
    keysMac: ['Cmd', 'P'],
    keysDisplay: 'Ctrl+P',
    difficulty: 'easy',
    tags: ['file', 'open', 'search'],
    frequency: 'common'
  },
  {
    id: 'vscode-save',
    app: 'vscode',
    category: 'general',
    action: 'Save File',
    description: 'Save the current file',
    keys: ['Ctrl', 'S'],
    keysMac: ['Cmd', 'S'],
    keysDisplay: 'Ctrl+S',
    difficulty: 'easy',
    tags: ['save', 'file'],
    frequency: 'common'
  },
  {
    id: 'vscode-save-all',
    app: 'vscode',
    category: 'general',
    action: 'Save All Files',
    keys: ['Ctrl', 'K', 'S'],
    keysMac: ['Cmd', 'Alt', 'S'],
    keysDisplay: 'Ctrl+K S',
    difficulty: 'medium',
    tags: ['save', 'file', 'all'],
    frequency: 'occasional'
  },

  // === EDITING ===
  {
    id: 'vscode-cut-line',
    app: 'vscode',
    category: 'editing',
    action: 'Cut Line',
    description: 'Cut entire line without selection',
    keys: ['Ctrl', 'X'],
    keysMac: ['Cmd', 'X'],
    keysDisplay: 'Ctrl+X',
    difficulty: 'easy',
    tags: ['cut', 'line', 'delete'],
    frequency: 'common'
  },
  {
    id: 'vscode-copy-line-down',
    app: 'vscode',
    category: 'editing',
    action: 'Copy Line Down',
    keys: ['Alt', 'Shift', 'Down'],
    keysMac: ['Alt', 'Shift', 'Down'],
    keysDisplay: 'Alt+Shift+↓',
    difficulty: 'medium',
    tags: ['copy', 'line', 'duplicate'],
    frequency: 'common'
  },
  {
    id: 'vscode-move-line-up',
    app: 'vscode',
    category: 'editing',
    action: 'Move Line Up',
    keys: ['Alt', 'Up'],
    keysMac: ['Alt', 'Up'],
    keysDisplay: 'Alt+↑',
    difficulty: 'easy',
    tags: ['move', 'line'],
    frequency: 'common'
  },
  {
    id: 'vscode-delete-line',
    app: 'vscode',
    category: 'editing',
    action: 'Delete Line',
    keys: ['Ctrl', 'Shift', 'K'],
    keysMac: ['Cmd', 'Shift', 'K'],
    keysDisplay: 'Ctrl+Shift+K',
    difficulty: 'easy',
    tags: ['delete', 'line', 'remove'],
    frequency: 'common'
  },
  {
    id: 'vscode-comment-line',
    app: 'vscode',
    category: 'editing',
    action: 'Toggle Line Comment',
    keys: ['Ctrl', '/'],
    keysMac: ['Cmd', '/'],
    keysDisplay: 'Ctrl+/',
    difficulty: 'easy',
    tags: ['comment', 'toggle'],
    frequency: 'common'
  },

  // === NAVIGATION ===
  {
    id: 'vscode-go-to-line',
    app: 'vscode',
    category: 'navigation',
    action: 'Go to Line',
    keys: ['Ctrl', 'G'],
    keysMac: ['Ctrl', 'G'],
    keysDisplay: 'Ctrl+G',
    difficulty: 'easy',
    tags: ['goto', 'line', 'jump'],
    frequency: 'common'
  },
  {
    id: 'vscode-go-to-definition',
    app: 'vscode',
    category: 'navigation',
    action: 'Go to Definition',
    keys: ['F12'],
    keysDisplay: 'F12',
    difficulty: 'easy',
    tags: ['definition', 'jump', 'code'],
    frequency: 'common'
  },

  // === SEARCH ===
  {
    id: 'vscode-find',
    app: 'vscode',
    category: 'search',
    action: 'Find',
    keys: ['Ctrl', 'F'],
    keysMac: ['Cmd', 'F'],
    keysDisplay: 'Ctrl+F',
    difficulty: 'easy',
    tags: ['find', 'search'],
    frequency: 'common'
  },
  {
    id: 'vscode-find-replace',
    app: 'vscode',
    category: 'search',
    action: 'Find and Replace',
    keys: ['Ctrl', 'H'],
    keysMac: ['Cmd', 'Alt', 'F'],
    keysDisplay: 'Ctrl+H',
    difficulty: 'easy',
    tags: ['find', 'replace', 'search'],
    frequency: 'common'
  },
  {
    id: 'vscode-find-in-files',
    app: 'vscode',
    category: 'search',
    action: 'Find in Files',
    keys: ['Ctrl', 'Shift', 'F'],
    keysMac: ['Cmd', 'Shift', 'F'],
    keysDisplay: 'Ctrl+Shift+F',
    difficulty: 'medium',
    tags: ['find', 'search', 'global'],
    frequency: 'common'
  },

  // === MULTI-CURSOR ===
  {
    id: 'vscode-add-cursor-above',
    app: 'vscode',
    category: 'multi-cursor',
    action: 'Add Cursor Above',
    keys: ['Ctrl', 'Alt', 'Up'],
    keysMac: ['Cmd', 'Alt', 'Up'],
    keysDisplay: 'Ctrl+Alt+↑',
    difficulty: 'medium',
    tags: ['cursor', 'multi', 'select'],
    frequency: 'occasional'
  },
  {
    id: 'vscode-select-all-occurrences',
    app: 'vscode',
    category: 'multi-cursor',
    action: 'Select All Occurrences',
    keys: ['Ctrl', 'Shift', 'L'],
    keysMac: ['Cmd', 'Shift', 'L'],
    keysDisplay: 'Ctrl+Shift+L',
    difficulty: 'medium',
    tags: ['select', 'all', 'occurrence'],
    frequency: 'occasional'
  },

  // === TERMINAL ===
  {
    id: 'vscode-toggle-terminal',
    app: 'vscode',
    category: 'terminal',
    action: 'Toggle Terminal',
    keys: ['Ctrl', '`'],
    keysMac: ['Ctrl', '`'],
    keysDisplay: 'Ctrl+`',
    difficulty: 'easy',
    tags: ['terminal', 'toggle'],
    frequency: 'common'
  },
  {
    id: 'vscode-new-terminal',
    app: 'vscode',
    category: 'terminal',
    action: 'New Terminal',
    keys: ['Ctrl', 'Shift', '`'],
    keysMac: ['Ctrl', 'Shift', '`'],
    keysDisplay: 'Ctrl+Shift+`',
    difficulty: 'medium',
    tags: ['terminal', 'new'],
    frequency: 'occasional'
  }
]
```

## Acceptance Criteria

- 30+ VS Code shortcuts
- All categories covered
- Difficulty accurately assigned
- Mac alternatives included
- Common shortcuts prioritized
