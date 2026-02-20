import type { AppDefinition, Shortcut } from '~/types/shortcut'

export const windowsApp: AppDefinition = {
  id: 'windows',
  name: 'Windows',
  icon: '⊞',
  platform: 'windows',
  categories: [
    { id: 'general', name: 'General', description: 'Common Windows shortcuts' },
    { id: 'window', name: 'Window Management', description: 'Manage windows and desktops' },
    { id: 'file', name: 'File Explorer', description: 'File and folder operations' },
    { id: 'text', name: 'Text Editing', description: 'Text selection and editing' },
    { id: 'system', name: 'System', description: 'System and accessibility shortcuts' }
  ]
}

export const windowsShortcuts: Shortcut[] = [
  // General
  { id: 'win-copy', app: 'windows', category: 'general', action: 'Copy', description: 'Copy selected item', keys: ['Ctrl', 'C'], keysDisplay: 'Ctrl + C', difficulty: 'easy', tags: ['copy', 'clipboard'], frequency: 'common' },
  { id: 'win-cut', app: 'windows', category: 'general', action: 'Cut', description: 'Cut selected item', keys: ['Ctrl', 'X'], keysDisplay: 'Ctrl + X', difficulty: 'easy', tags: ['cut', 'clipboard'], frequency: 'common' },
  { id: 'win-paste', app: 'windows', category: 'general', action: 'Paste', description: 'Paste from clipboard', keys: ['Ctrl', 'V'], keysDisplay: 'Ctrl + V', difficulty: 'easy', tags: ['paste', 'clipboard'], frequency: 'common' },
  { id: 'win-undo', app: 'windows', category: 'general', action: 'Undo', description: 'Undo last action', keys: ['Ctrl', 'Z'], keysDisplay: 'Ctrl + Z', difficulty: 'easy', tags: ['undo'], frequency: 'common' },
  { id: 'win-redo', app: 'windows', category: 'general', action: 'Redo', description: 'Redo last undone action', keys: ['Ctrl', 'Y'], keysDisplay: 'Ctrl + Y', difficulty: 'easy', tags: ['redo'], frequency: 'common' },
  { id: 'win-select-all', app: 'windows', category: 'general', action: 'Select All', description: 'Select all items', keys: ['Ctrl', 'A'], keysDisplay: 'Ctrl + A', difficulty: 'easy', tags: ['select'], frequency: 'common' },
  { id: 'win-save', app: 'windows', category: 'general', action: 'Save', description: 'Save current document', keys: ['Ctrl', 'S'], keysDisplay: 'Ctrl + S', difficulty: 'easy', tags: ['save'], frequency: 'common' },
  { id: 'win-print', app: 'windows', category: 'general', action: 'Print', description: 'Print current document', keys: ['Ctrl', 'P'], keysDisplay: 'Ctrl + P', difficulty: 'easy', tags: ['print'], frequency: 'occasional' },
  { id: 'win-find', app: 'windows', category: 'general', action: 'Find', description: 'Open find dialog', keys: ['Ctrl', 'F'], keysDisplay: 'Ctrl + F', difficulty: 'easy', tags: ['find', 'search'], frequency: 'common' },
  { id: 'win-new', app: 'windows', category: 'general', action: 'New', description: 'Create new document/window', keys: ['Ctrl', 'N'], keysDisplay: 'Ctrl + N', difficulty: 'easy', tags: ['new'], frequency: 'common' },
  { id: 'win-open', app: 'windows', category: 'general', action: 'Open', description: 'Open file', keys: ['Ctrl', 'O'], keysDisplay: 'Ctrl + O', difficulty: 'easy', tags: ['open'], frequency: 'common' },
  { id: 'win-close', app: 'windows', category: 'general', action: 'Close Window', description: 'Close current window', keys: ['Alt', 'F4'], keysDisplay: 'Alt + F4', difficulty: 'easy', tags: ['close'], frequency: 'common' },

  // Window Management
  { id: 'win-desktop', app: 'windows', category: 'window', action: 'Show Desktop', description: 'Minimize all windows', keys: ['Ctrl', 'D'], keysDisplay: 'Win + D', difficulty: 'easy', tags: ['desktop', 'minimize'], frequency: 'common' },
  { id: 'win-lock', app: 'windows', category: 'window', action: 'Lock Screen', description: 'Lock the computer', keys: ['Ctrl', 'L'], keysDisplay: 'Win + L', difficulty: 'easy', tags: ['lock', 'security'], frequency: 'common' },
  { id: 'win-snap-left', app: 'windows', category: 'window', action: 'Snap Left', description: 'Snap window to left half', keys: ['Ctrl', 'Left'], keysDisplay: 'Win + ←', difficulty: 'medium', tags: ['snap', 'window'], frequency: 'common' },
  { id: 'win-snap-right', app: 'windows', category: 'window', action: 'Snap Right', description: 'Snap window to right half', keys: ['Ctrl', 'Right'], keysDisplay: 'Win + →', difficulty: 'medium', tags: ['snap', 'window'], frequency: 'common' },
  { id: 'win-maximize', app: 'windows', category: 'window', action: 'Maximize', description: 'Maximize window', keys: ['Ctrl', 'Up'], keysDisplay: 'Win + ↑', difficulty: 'medium', tags: ['maximize', 'window'], frequency: 'common' },
  { id: 'win-task-view', app: 'windows', category: 'window', action: 'Task View', description: 'Open Task View / virtual desktops', keys: ['Ctrl', 'Tab'], keysDisplay: 'Win + Tab', difficulty: 'medium', tags: ['task view', 'virtual desktop'], frequency: 'occasional' },
  { id: 'win-switch-app', app: 'windows', category: 'window', action: 'Switch App', description: 'Switch between open apps', keys: ['Alt', 'Tab'], keysDisplay: 'Alt + Tab', difficulty: 'easy', tags: ['switch', 'app'], frequency: 'common' },
  { id: 'win-close-tab', app: 'windows', category: 'window', action: 'Close Tab/Window', description: 'Close current tab or window', keys: ['Ctrl', 'W'], keysDisplay: 'Ctrl + W', difficulty: 'easy', tags: ['close', 'tab'], frequency: 'common' },

  // File Explorer
  { id: 'win-explorer', app: 'windows', category: 'file', action: 'Open Explorer', description: 'Open File Explorer', keys: ['Ctrl', 'E'], keysDisplay: 'Win + E', difficulty: 'easy', tags: ['explorer', 'files'], frequency: 'common' },
  { id: 'win-rename', app: 'windows', category: 'file', action: 'Rename', description: 'Rename selected file/folder', keys: ['F2'], keysDisplay: 'F2', difficulty: 'easy', tags: ['rename'], frequency: 'common' },
  { id: 'win-delete', app: 'windows', category: 'file', action: 'Delete', description: 'Delete selected item', keys: ['Delete'], keysDisplay: 'Delete', difficulty: 'easy', tags: ['delete'], frequency: 'common' },
  { id: 'win-perm-delete', app: 'windows', category: 'file', action: 'Permanent Delete', description: 'Delete without recycle bin', keys: ['Shift', 'Delete'], keysDisplay: 'Shift + Delete', difficulty: 'medium', tags: ['delete', 'permanent'], frequency: 'occasional' },
  { id: 'win-properties', app: 'windows', category: 'file', action: 'Properties', description: 'Open file properties', keys: ['Alt', 'Enter'], keysDisplay: 'Alt + Enter', difficulty: 'medium', tags: ['properties'], frequency: 'occasional' },
  { id: 'win-back', app: 'windows', category: 'file', action: 'Navigate Back', description: 'Go back in Explorer', keys: ['Alt', 'Left'], keysDisplay: 'Alt + ←', difficulty: 'easy', tags: ['back', 'navigate'], frequency: 'common' },

  // Text Editing
  { id: 'win-bold', app: 'windows', category: 'text', action: 'Bold', description: 'Make text bold', keys: ['Ctrl', 'B'], keysDisplay: 'Ctrl + B', difficulty: 'easy', tags: ['bold', 'format'], frequency: 'common' },
  { id: 'win-italic', app: 'windows', category: 'text', action: 'Italic', description: 'Make text italic', keys: ['Ctrl', 'I'], keysDisplay: 'Ctrl + I', difficulty: 'easy', tags: ['italic', 'format'], frequency: 'common' },
  { id: 'win-underline', app: 'windows', category: 'text', action: 'Underline', description: 'Underline text', keys: ['Ctrl', 'U'], keysDisplay: 'Ctrl + U', difficulty: 'easy', tags: ['underline', 'format'], frequency: 'common' },
  { id: 'win-word-left', app: 'windows', category: 'text', action: 'Word Left', description: 'Move cursor one word left', keys: ['Ctrl', 'Left'], keysDisplay: 'Ctrl + ←', difficulty: 'medium', tags: ['cursor', 'word'], frequency: 'common' },
  { id: 'win-word-right', app: 'windows', category: 'text', action: 'Word Right', description: 'Move cursor one word right', keys: ['Ctrl', 'Right'], keysDisplay: 'Ctrl + →', difficulty: 'medium', tags: ['cursor', 'word'], frequency: 'common' },
  { id: 'win-line-start', app: 'windows', category: 'text', action: 'Line Start', description: 'Move to start of line', keys: ['Home'], keysDisplay: 'Home', difficulty: 'easy', tags: ['home', 'line'], frequency: 'common' },
  { id: 'win-line-end', app: 'windows', category: 'text', action: 'Line End', description: 'Move to end of line', keys: ['End'], keysDisplay: 'End', difficulty: 'easy', tags: ['end', 'line'], frequency: 'common' },

  // System
  { id: 'win-task-manager', app: 'windows', category: 'system', action: 'Task Manager', description: 'Open Task Manager', keys: ['Ctrl', 'Shift', 'Esc'], keysDisplay: 'Ctrl + Shift + Esc', difficulty: 'medium', tags: ['task manager', 'system'], frequency: 'occasional' },
  { id: 'win-run', app: 'windows', category: 'system', action: 'Run Dialog', description: 'Open Run dialog', keys: ['Ctrl', 'R'], keysDisplay: 'Win + R', difficulty: 'easy', tags: ['run', 'command'], frequency: 'occasional' },
  { id: 'win-settings', app: 'windows', category: 'system', action: 'Settings', description: 'Open Windows Settings', keys: ['Ctrl', 'I'], keysDisplay: 'Win + I', difficulty: 'easy', tags: ['settings'], frequency: 'occasional' },
  { id: 'win-search', app: 'windows', category: 'system', action: 'Search', description: 'Open Windows Search', keys: ['Ctrl', 'S'], keysDisplay: 'Win + S', difficulty: 'easy', tags: ['search'], frequency: 'common' },
  { id: 'win-screenshot', app: 'windows', category: 'system', action: 'Screenshot', description: 'Take a screenshot', keys: ['Shift', 'S'], keysDisplay: 'Win + Shift + S', difficulty: 'medium', tags: ['screenshot', 'snip'], frequency: 'common' },
  { id: 'win-emoji', app: 'windows', category: 'system', action: 'Emoji Picker', description: 'Open emoji picker', keys: ['Ctrl', '.'], keysDisplay: 'Win + .', difficulty: 'easy', tags: ['emoji'], frequency: 'occasional' }
]
