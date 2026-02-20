import type { AppDefinition, Shortcut } from '~/types/shortcut'

export const macosApp: AppDefinition = {
  id: 'macos',
  name: 'macOS',
  icon: '',
  platform: 'mac',
  categories: [
    { id: 'general', name: 'General', description: 'Common macOS shortcuts' },
    { id: 'window', name: 'Window Management', description: 'Manage windows and spaces' },
    { id: 'finder', name: 'Finder', description: 'File and folder operations' },
    { id: 'text', name: 'Text Editing', description: 'Text selection and editing' },
    { id: 'system', name: 'System', description: 'System shortcuts' }
  ]
}

export const macosShortcuts: Shortcut[] = [
  // General
  { id: 'mac-copy', app: 'macos', category: 'general', action: 'Copy', description: 'Copy selected item', keys: ['Cmd', 'C'], keysDisplay: '⌘C', difficulty: 'easy', tags: ['copy', 'clipboard'], frequency: 'common' },
  { id: 'mac-cut', app: 'macos', category: 'general', action: 'Cut', description: 'Cut selected item', keys: ['Cmd', 'X'], keysDisplay: '⌘X', difficulty: 'easy', tags: ['cut', 'clipboard'], frequency: 'common' },
  { id: 'mac-paste', app: 'macos', category: 'general', action: 'Paste', description: 'Paste from clipboard', keys: ['Cmd', 'V'], keysDisplay: '⌘V', difficulty: 'easy', tags: ['paste', 'clipboard'], frequency: 'common' },
  { id: 'mac-undo', app: 'macos', category: 'general', action: 'Undo', description: 'Undo last action', keys: ['Cmd', 'Z'], keysDisplay: '⌘Z', difficulty: 'easy', tags: ['undo'], frequency: 'common' },
  { id: 'mac-redo', app: 'macos', category: 'general', action: 'Redo', description: 'Redo last undone action', keys: ['Cmd', 'Shift', 'Z'], keysDisplay: '⌘⇧Z', difficulty: 'medium', tags: ['redo'], frequency: 'common' },
  { id: 'mac-select-all', app: 'macos', category: 'general', action: 'Select All', description: 'Select all items', keys: ['Cmd', 'A'], keysDisplay: '⌘A', difficulty: 'easy', tags: ['select'], frequency: 'common' },
  { id: 'mac-save', app: 'macos', category: 'general', action: 'Save', description: 'Save current document', keys: ['Cmd', 'S'], keysDisplay: '⌘S', difficulty: 'easy', tags: ['save'], frequency: 'common' },
  { id: 'mac-find', app: 'macos', category: 'general', action: 'Find', description: 'Open find dialog', keys: ['Cmd', 'F'], keysDisplay: '⌘F', difficulty: 'easy', tags: ['find', 'search'], frequency: 'common' },
  { id: 'mac-quit', app: 'macos', category: 'general', action: 'Quit App', description: 'Quit active application', keys: ['Cmd', 'Q'], keysDisplay: '⌘Q', difficulty: 'easy', tags: ['quit', 'close'], frequency: 'common' },
  { id: 'mac-close-window', app: 'macos', category: 'general', action: 'Close Window', description: 'Close the front window', keys: ['Cmd', 'W'], keysDisplay: '⌘W', difficulty: 'easy', tags: ['close', 'window'], frequency: 'common' },
  { id: 'mac-new', app: 'macos', category: 'general', action: 'New', description: 'Create new document/window', keys: ['Cmd', 'N'], keysDisplay: '⌘N', difficulty: 'easy', tags: ['new'], frequency: 'common' },
  { id: 'mac-open', app: 'macos', category: 'general', action: 'Open', description: 'Open file', keys: ['Cmd', 'O'], keysDisplay: '⌘O', difficulty: 'easy', tags: ['open'], frequency: 'common' },

  // Window Management
  { id: 'mac-switch-app', app: 'macos', category: 'window', action: 'Switch App', description: 'Switch between open apps', keys: ['Cmd', 'Tab'], keysDisplay: '⌘Tab', difficulty: 'easy', tags: ['switch', 'app'], frequency: 'common' },
  { id: 'mac-hide-app', app: 'macos', category: 'window', action: 'Hide App', description: 'Hide the current app', keys: ['Cmd', 'H'], keysDisplay: '⌘H', difficulty: 'easy', tags: ['hide'], frequency: 'occasional' },
  { id: 'mac-minimize', app: 'macos', category: 'window', action: 'Minimize', description: 'Minimize window to Dock', keys: ['Cmd', 'M'], keysDisplay: '⌘M', difficulty: 'easy', tags: ['minimize'], frequency: 'occasional' },
  { id: 'mac-spotlight', app: 'macos', category: 'window', action: 'Spotlight', description: 'Open Spotlight search', keys: ['Cmd', 'Space'], keysDisplay: '⌘Space', difficulty: 'easy', tags: ['spotlight', 'search'], frequency: 'common' },
  { id: 'mac-mission-control', app: 'macos', category: 'window', action: 'Mission Control', description: 'View all open windows', keys: ['Ctrl', 'Up'], keysDisplay: '⌃↑', difficulty: 'medium', tags: ['mission control', 'spaces'], frequency: 'occasional' },
  { id: 'mac-app-windows', app: 'macos', category: 'window', action: 'App Windows', description: 'View windows of current app', keys: ['Ctrl', 'Down'], keysDisplay: '⌃↓', difficulty: 'medium', tags: ['windows', 'expose'], frequency: 'occasional' },

  // Finder
  { id: 'mac-new-folder', app: 'macos', category: 'finder', action: 'New Folder', description: 'Create a new folder', keys: ['Cmd', 'Shift', 'N'], keysDisplay: '⌘⇧N', difficulty: 'medium', tags: ['folder', 'new'], frequency: 'common' },
  { id: 'mac-get-info', app: 'macos', category: 'finder', action: 'Get Info', description: 'Show file/folder info', keys: ['Cmd', 'I'], keysDisplay: '⌘I', difficulty: 'easy', tags: ['info', 'properties'], frequency: 'occasional' },
  { id: 'mac-go-home', app: 'macos', category: 'finder', action: 'Go to Home', description: 'Go to Home folder', keys: ['Cmd', 'Shift', 'H'], keysDisplay: '⌘⇧H', difficulty: 'medium', tags: ['home', 'navigate'], frequency: 'occasional' },
  { id: 'mac-empty-trash', app: 'macos', category: 'finder', action: 'Empty Trash', description: 'Empty the Trash', keys: ['Cmd', 'Shift', 'Delete'], keysDisplay: '⌘⇧⌫', difficulty: 'hard', tags: ['trash', 'delete'], frequency: 'occasional' },
  { id: 'mac-move-trash', app: 'macos', category: 'finder', action: 'Move to Trash', description: 'Move selection to Trash', keys: ['Cmd', 'Delete'], keysDisplay: '⌘⌫', difficulty: 'medium', tags: ['trash', 'delete'], frequency: 'common' },

  // Text Editing
  { id: 'mac-bold', app: 'macos', category: 'text', action: 'Bold', description: 'Make text bold', keys: ['Cmd', 'B'], keysDisplay: '⌘B', difficulty: 'easy', tags: ['bold', 'format'], frequency: 'common' },
  { id: 'mac-italic', app: 'macos', category: 'text', action: 'Italic', description: 'Make text italic', keys: ['Cmd', 'I'], keysDisplay: '⌘I', difficulty: 'easy', tags: ['italic', 'format'], frequency: 'common' },
  { id: 'mac-line-start', app: 'macos', category: 'text', action: 'Line Start', description: 'Move to start of line', keys: ['Cmd', 'Left'], keysDisplay: '⌘←', difficulty: 'medium', tags: ['home', 'line'], frequency: 'common' },
  { id: 'mac-line-end', app: 'macos', category: 'text', action: 'Line End', description: 'Move to end of line', keys: ['Cmd', 'Right'], keysDisplay: '⌘→', difficulty: 'medium', tags: ['end', 'line'], frequency: 'common' },
  { id: 'mac-word-left', app: 'macos', category: 'text', action: 'Word Left', description: 'Move cursor one word left', keys: ['Alt', 'Left'], keysDisplay: '⌥←', difficulty: 'medium', tags: ['cursor', 'word'], frequency: 'common' },
  { id: 'mac-word-right', app: 'macos', category: 'text', action: 'Word Right', description: 'Move cursor one word right', keys: ['Alt', 'Right'], keysDisplay: '⌥→', difficulty: 'medium', tags: ['cursor', 'word'], frequency: 'common' },
  { id: 'mac-delete-word', app: 'macos', category: 'text', action: 'Delete Word', description: 'Delete previous word', keys: ['Alt', 'Backspace'], keysDisplay: '⌥⌫', difficulty: 'medium', tags: ['delete', 'word'], frequency: 'common' },

  // System
  { id: 'mac-screenshot', app: 'macos', category: 'system', action: 'Screenshot', description: 'Take a screenshot', keys: ['Cmd', 'Shift', '3'], keysDisplay: '⌘⇧3', difficulty: 'medium', tags: ['screenshot'], frequency: 'common' },
  { id: 'mac-screenshot-area', app: 'macos', category: 'system', action: 'Screenshot Area', description: 'Capture selected area', keys: ['Cmd', 'Shift', '4'], keysDisplay: '⌘⇧4', difficulty: 'medium', tags: ['screenshot', 'area'], frequency: 'common' },
  { id: 'mac-force-quit', app: 'macos', category: 'system', action: 'Force Quit', description: 'Open Force Quit dialog', keys: ['Cmd', 'Alt', 'Esc'], keysDisplay: '⌘⌥Esc', difficulty: 'hard', tags: ['force quit', 'crash'], frequency: 'occasional' },
  { id: 'mac-lock-screen', app: 'macos', category: 'system', action: 'Lock Screen', description: 'Lock the screen', keys: ['Cmd', 'Ctrl', 'Q'], keysDisplay: '⌘⌃Q', difficulty: 'hard', tags: ['lock', 'security'], frequency: 'occasional' }
]
