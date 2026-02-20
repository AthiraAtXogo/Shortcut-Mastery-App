import type { AppDefinition, Shortcut } from '~/types/shortcut'

export const vscodeApp: AppDefinition = {
  id: 'vscode',
  name: 'VS Code',
  icon: '{}',
  platform: 'both',
  categories: [
    { id: 'general', name: 'General', description: 'File, window, and settings' },
    { id: 'editing', name: 'Editing', description: 'Text manipulation and code editing' },
    { id: 'navigation', name: 'Navigation', description: 'Moving around the editor' },
    { id: 'search', name: 'Search', description: 'Find and replace' },
    { id: 'multicursor', name: 'Multi-cursor', description: 'Multiple selections and cursors' },
    { id: 'terminal', name: 'Terminal', description: 'Integrated terminal' },
    { id: 'debug', name: 'Debug', description: 'Debugging shortcuts' }
  ]
}

export const vscodeShortcuts: Shortcut[] = [
  // General
  { id: 'vscode-command-palette', app: 'vscode', category: 'general', action: 'Command Palette', description: 'Open the command palette to run any command', keys: ['Ctrl', 'Shift', 'P'], keysMac: ['Cmd', 'Shift', 'P'], keysDisplay: 'Ctrl + Shift + P', keysMacDisplay: '⌘⇧P', difficulty: 'easy', tags: ['command', 'palette'], frequency: 'common' },
  { id: 'vscode-quick-open', app: 'vscode', category: 'general', action: 'Quick Open File', description: 'Quickly open any file by name', keys: ['Ctrl', 'P'], keysMac: ['Cmd', 'P'], keysDisplay: 'Ctrl + P', keysMacDisplay: '⌘P', difficulty: 'easy', tags: ['file', 'open', 'search'], frequency: 'common' },
  { id: 'vscode-save', app: 'vscode', category: 'general', action: 'Save File', description: 'Save the current file', keys: ['Ctrl', 'S'], keysMac: ['Cmd', 'S'], keysDisplay: 'Ctrl + S', keysMacDisplay: '⌘S', difficulty: 'easy', tags: ['save'], frequency: 'common' },
  { id: 'vscode-close-tab', app: 'vscode', category: 'general', action: 'Close Tab', description: 'Close the current editor tab', keys: ['Ctrl', 'W'], keysMac: ['Cmd', 'W'], keysDisplay: 'Ctrl + W', keysMacDisplay: '⌘W', difficulty: 'easy', tags: ['close', 'tab'], frequency: 'common' },
  { id: 'vscode-new-file', app: 'vscode', category: 'general', action: 'New File', description: 'Create a new file', keys: ['Ctrl', 'N'], keysMac: ['Cmd', 'N'], keysDisplay: 'Ctrl + N', keysMacDisplay: '⌘N', difficulty: 'easy', tags: ['new', 'file'], frequency: 'common' },
  { id: 'vscode-settings', app: 'vscode', category: 'general', action: 'Open Settings', description: 'Open VS Code settings', keys: ['Ctrl', ','], keysMac: ['Cmd', ','], keysDisplay: 'Ctrl + ,', keysMacDisplay: '⌘,', difficulty: 'easy', tags: ['settings'], frequency: 'occasional' },
  { id: 'vscode-sidebar', app: 'vscode', category: 'general', action: 'Toggle Sidebar', description: 'Show/hide the sidebar', keys: ['Ctrl', 'B'], keysMac: ['Cmd', 'B'], keysDisplay: 'Ctrl + B', keysMacDisplay: '⌘B', difficulty: 'easy', tags: ['sidebar', 'toggle'], frequency: 'common' },
  { id: 'vscode-terminal', app: 'vscode', category: 'terminal', action: 'Toggle Terminal', description: 'Open/close the integrated terminal', keys: ['Ctrl', '`'], keysMac: ['Ctrl', '`'], keysDisplay: 'Ctrl + `', keysMacDisplay: '⌃`', difficulty: 'easy', tags: ['terminal'], frequency: 'common' },
  { id: 'vscode-new-terminal', app: 'vscode', category: 'terminal', action: 'New Terminal', description: 'Create a new terminal instance', keys: ['Ctrl', 'Shift', '`'], keysMac: ['Ctrl', 'Shift', '`'], keysDisplay: 'Ctrl + Shift + `', keysMacDisplay: '⌃⇧`', difficulty: 'medium', tags: ['terminal', 'new'], frequency: 'common' },
  { id: 'vscode-split-editor', app: 'vscode', category: 'general', action: 'Split Editor', description: 'Split the editor to the right', keys: ['Ctrl', '\\'], keysMac: ['Cmd', '\\'], keysDisplay: 'Ctrl + \\', keysMacDisplay: '⌘\\', difficulty: 'medium', tags: ['split', 'editor'], frequency: 'occasional' },
  { id: 'vscode-zen-mode', app: 'vscode', category: 'general', action: 'Zen Mode', description: 'Enter distraction-free zen mode', keys: ['Ctrl', 'K', 'Z'], keysMac: ['Cmd', 'K', 'Z'], keysDisplay: 'Ctrl + K Z', keysMacDisplay: '⌘KZ', difficulty: 'hard', tags: ['zen', 'focus'], frequency: 'rare' },

  // Editing
  { id: 'vscode-duplicate-line', app: 'vscode', category: 'editing', action: 'Duplicate Line', description: 'Copy line down', keys: ['Alt', 'Shift', 'Down'], keysMac: ['Alt', 'Shift', 'Down'], keysDisplay: 'Alt + Shift + ↓', keysMacDisplay: '⌥⇧↓', difficulty: 'medium', tags: ['duplicate', 'line'], frequency: 'common' },
  { id: 'vscode-move-line-up', app: 'vscode', category: 'editing', action: 'Move Line Up', description: 'Move current line up', keys: ['Alt', 'Up'], keysMac: ['Alt', 'Up'], keysDisplay: 'Alt + ↑', keysMacDisplay: '⌥↑', difficulty: 'medium', tags: ['move', 'line'], frequency: 'common' },
  { id: 'vscode-move-line-down', app: 'vscode', category: 'editing', action: 'Move Line Down', description: 'Move current line down', keys: ['Alt', 'Down'], keysMac: ['Alt', 'Down'], keysDisplay: 'Alt + ↓', keysMacDisplay: '⌥↓', difficulty: 'medium', tags: ['move', 'line'], frequency: 'common' },
  { id: 'vscode-delete-line', app: 'vscode', category: 'editing', action: 'Delete Line', description: 'Delete the current line', keys: ['Ctrl', 'Shift', 'K'], keysMac: ['Cmd', 'Shift', 'K'], keysDisplay: 'Ctrl + Shift + K', keysMacDisplay: '⌘⇧K', difficulty: 'medium', tags: ['delete', 'line'], frequency: 'common' },
  { id: 'vscode-comment-line', app: 'vscode', category: 'editing', action: 'Toggle Comment', description: 'Comment/uncomment current line', keys: ['Ctrl', '/'], keysMac: ['Cmd', '/'], keysDisplay: 'Ctrl + /', keysMacDisplay: '⌘/', difficulty: 'easy', tags: ['comment'], frequency: 'common' },
  { id: 'vscode-block-comment', app: 'vscode', category: 'editing', action: 'Block Comment', description: 'Add block comment', keys: ['Alt', 'Shift', 'A'], keysMac: ['Alt', 'Shift', 'A'], keysDisplay: 'Alt + Shift + A', keysMacDisplay: '⌥⇧A', difficulty: 'hard', tags: ['comment', 'block'], frequency: 'occasional' },
  { id: 'vscode-format', app: 'vscode', category: 'editing', action: 'Format Document', description: 'Format the entire document', keys: ['Alt', 'Shift', 'F'], keysMac: ['Alt', 'Shift', 'F'], keysDisplay: 'Alt + Shift + F', keysMacDisplay: '⌥⇧F', difficulty: 'medium', tags: ['format', 'prettier'], frequency: 'common' },
  { id: 'vscode-indent', app: 'vscode', category: 'editing', action: 'Indent Line', description: 'Indent the current line', keys: ['Tab'], keysDisplay: 'Tab', difficulty: 'easy', tags: ['indent'], frequency: 'common' },
  { id: 'vscode-outdent', app: 'vscode', category: 'editing', action: 'Outdent Line', description: 'Outdent the current line', keys: ['Shift', 'Tab'], keysDisplay: 'Shift + Tab', difficulty: 'easy', tags: ['outdent', 'indent'], frequency: 'common' },
  { id: 'vscode-rename-symbol', app: 'vscode', category: 'editing', action: 'Rename Symbol', description: 'Rename a symbol across the project', keys: ['F2'], keysDisplay: 'F2', difficulty: 'medium', tags: ['rename', 'refactor'], frequency: 'common' },

  // Navigation
  { id: 'vscode-go-to-line', app: 'vscode', category: 'navigation', action: 'Go to Line', description: 'Jump to a specific line number', keys: ['Ctrl', 'G'], keysMac: ['Ctrl', 'G'], keysDisplay: 'Ctrl + G', keysMacDisplay: '⌃G', difficulty: 'easy', tags: ['navigate', 'line'], frequency: 'common' },
  { id: 'vscode-go-to-symbol', app: 'vscode', category: 'navigation', action: 'Go to Symbol', description: 'Navigate to a symbol in file', keys: ['Ctrl', 'Shift', 'O'], keysMac: ['Cmd', 'Shift', 'O'], keysDisplay: 'Ctrl + Shift + O', keysMacDisplay: '⌘⇧O', difficulty: 'medium', tags: ['symbol', 'navigate'], frequency: 'common' },
  { id: 'vscode-go-definition', app: 'vscode', category: 'navigation', action: 'Go to Definition', description: 'Jump to symbol definition', keys: ['F12'], keysDisplay: 'F12', difficulty: 'easy', tags: ['definition', 'navigate'], frequency: 'common' },
  { id: 'vscode-peek-definition', app: 'vscode', category: 'navigation', action: 'Peek Definition', description: 'Inline view of definition', keys: ['Alt', 'F12'], keysDisplay: 'Alt + F12', difficulty: 'medium', tags: ['definition', 'peek'], frequency: 'occasional' },
  { id: 'vscode-back', app: 'vscode', category: 'navigation', action: 'Navigate Back', description: 'Go back in navigation history', keys: ['Alt', 'Left'], keysMac: ['Ctrl', '-'], keysDisplay: 'Alt + ←', keysMacDisplay: '⌃-', difficulty: 'medium', tags: ['back', 'history'], frequency: 'common' },
  { id: 'vscode-forward', app: 'vscode', category: 'navigation', action: 'Navigate Forward', description: 'Go forward in navigation history', keys: ['Alt', 'Right'], keysMac: ['Ctrl', 'Shift', '-'], keysDisplay: 'Alt + →', keysMacDisplay: '⌃⇧-', difficulty: 'medium', tags: ['forward', 'history'], frequency: 'occasional' },
  { id: 'vscode-next-tab', app: 'vscode', category: 'navigation', action: 'Next Tab', description: 'Switch to next editor tab', keys: ['Ctrl', 'Tab'], keysDisplay: 'Ctrl + Tab', difficulty: 'easy', tags: ['tab', 'switch'], frequency: 'common' },

  // Search
  { id: 'vscode-find', app: 'vscode', category: 'search', action: 'Find', description: 'Open find in current file', keys: ['Ctrl', 'F'], keysMac: ['Cmd', 'F'], keysDisplay: 'Ctrl + F', keysMacDisplay: '⌘F', difficulty: 'easy', tags: ['find', 'search'], frequency: 'common' },
  { id: 'vscode-replace', app: 'vscode', category: 'search', action: 'Find & Replace', description: 'Open find and replace', keys: ['Ctrl', 'H'], keysMac: ['Cmd', 'H'], keysDisplay: 'Ctrl + H', keysMacDisplay: '⌘H', difficulty: 'easy', tags: ['replace', 'find'], frequency: 'common' },
  { id: 'vscode-find-all', app: 'vscode', category: 'search', action: 'Find in Files', description: 'Search across all files', keys: ['Ctrl', 'Shift', 'F'], keysMac: ['Cmd', 'Shift', 'F'], keysDisplay: 'Ctrl + Shift + F', keysMacDisplay: '⌘⇧F', difficulty: 'medium', tags: ['find', 'files', 'global'], frequency: 'common' },
  { id: 'vscode-replace-all', app: 'vscode', category: 'search', action: 'Replace in Files', description: 'Replace across all files', keys: ['Ctrl', 'Shift', 'H'], keysMac: ['Cmd', 'Shift', 'H'], keysDisplay: 'Ctrl + Shift + H', keysMacDisplay: '⌘⇧H', difficulty: 'medium', tags: ['replace', 'files', 'global'], frequency: 'occasional' },

  // Multi-cursor
  { id: 'vscode-multicursor-above', app: 'vscode', category: 'multicursor', action: 'Add Cursor Above', description: 'Add cursor to line above', keys: ['Ctrl', 'Alt', 'Up'], keysMac: ['Cmd', 'Alt', 'Up'], keysDisplay: 'Ctrl + Alt + ↑', keysMacDisplay: '⌘⌥↑', difficulty: 'hard', tags: ['multicursor', 'cursor'], frequency: 'occasional' },
  { id: 'vscode-multicursor-below', app: 'vscode', category: 'multicursor', action: 'Add Cursor Below', description: 'Add cursor to line below', keys: ['Ctrl', 'Alt', 'Down'], keysMac: ['Cmd', 'Alt', 'Down'], keysDisplay: 'Ctrl + Alt + ↓', keysMacDisplay: '⌘⌥↓', difficulty: 'hard', tags: ['multicursor', 'cursor'], frequency: 'occasional' },
  { id: 'vscode-select-all-occurrences', app: 'vscode', category: 'multicursor', action: 'Select All Occurrences', description: 'Select all occurrences of current word', keys: ['Ctrl', 'Shift', 'L'], keysMac: ['Cmd', 'Shift', 'L'], keysDisplay: 'Ctrl + Shift + L', keysMacDisplay: '⌘⇧L', difficulty: 'hard', tags: ['select', 'occurrences'], frequency: 'occasional' },
  { id: 'vscode-next-occurrence', app: 'vscode', category: 'multicursor', action: 'Select Next Occurrence', description: 'Add selection to next occurrence', keys: ['Ctrl', 'D'], keysMac: ['Cmd', 'D'], keysDisplay: 'Ctrl + D', keysMacDisplay: '⌘D', difficulty: 'medium', tags: ['select', 'occurrence'], frequency: 'common' },

  // Debug
  { id: 'vscode-debug-start', app: 'vscode', category: 'debug', action: 'Start Debugging', description: 'Start or continue debugging', keys: ['F5'], keysDisplay: 'F5', difficulty: 'easy', tags: ['debug', 'start'], frequency: 'common' },
  { id: 'vscode-debug-stop', app: 'vscode', category: 'debug', action: 'Stop Debugging', description: 'Stop the debugger', keys: ['Shift', 'F5'], keysDisplay: 'Shift + F5', difficulty: 'easy', tags: ['debug', 'stop'], frequency: 'common' },
  { id: 'vscode-debug-step-over', app: 'vscode', category: 'debug', action: 'Step Over', description: 'Step over current line', keys: ['F10'], keysDisplay: 'F10', difficulty: 'easy', tags: ['debug', 'step'], frequency: 'common' },
  { id: 'vscode-debug-step-into', app: 'vscode', category: 'debug', action: 'Step Into', description: 'Step into function call', keys: ['F11'], keysDisplay: 'F11', difficulty: 'easy', tags: ['debug', 'step'], frequency: 'common' },
  { id: 'vscode-debug-step-out', app: 'vscode', category: 'debug', action: 'Step Out', description: 'Step out of current function', keys: ['Shift', 'F11'], keysDisplay: 'Shift + F11', difficulty: 'medium', tags: ['debug', 'step'], frequency: 'occasional' },
  { id: 'vscode-toggle-breakpoint', app: 'vscode', category: 'debug', action: 'Toggle Breakpoint', description: 'Add or remove breakpoint', keys: ['F9'], keysDisplay: 'F9', difficulty: 'easy', tags: ['breakpoint', 'debug'], frequency: 'common' }
]
