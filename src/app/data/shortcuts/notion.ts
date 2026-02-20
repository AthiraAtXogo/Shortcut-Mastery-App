import type { AppDefinition, Shortcut } from '~/types/shortcut'

export const notionApp: AppDefinition = {
  id: 'notion',
  name: 'Notion',
  icon: '▣',
  platform: 'both',
  categories: [
    { id: 'general', name: 'General', description: 'Common Notion shortcuts' },
    { id: 'editing', name: 'Editing', description: 'Content editing' },
    { id: 'blocks', name: 'Blocks', description: 'Block manipulation' },
    { id: 'formatting', name: 'Formatting', description: 'Text formatting' }
  ]
}

export const notionShortcuts: Shortcut[] = [
  // General
  { id: 'notion-quick-find', app: 'notion', category: 'general', action: 'Quick Find', description: 'Search across all pages', keys: ['Ctrl', 'P'], keysMac: ['Cmd', 'P'], keysDisplay: 'Ctrl + P', keysMacDisplay: '⌘P', difficulty: 'easy', tags: ['search', 'find'], frequency: 'common' },
  { id: 'notion-new-page', app: 'notion', category: 'general', action: 'New Page', description: 'Create a new page', keys: ['Ctrl', 'N'], keysMac: ['Cmd', 'N'], keysDisplay: 'Ctrl + N', keysMacDisplay: '⌘N', difficulty: 'easy', tags: ['new', 'page'], frequency: 'common' },
  { id: 'notion-toggle-sidebar', app: 'notion', category: 'general', action: 'Toggle Sidebar', description: 'Show/hide the sidebar', keys: ['Ctrl', '\\'], keysMac: ['Cmd', '\\'], keysDisplay: 'Ctrl + \\', keysMacDisplay: '⌘\\', difficulty: 'easy', tags: ['sidebar'], frequency: 'occasional' },
  { id: 'notion-undo', app: 'notion', category: 'general', action: 'Undo', description: 'Undo last action', keys: ['Ctrl', 'Z'], keysMac: ['Cmd', 'Z'], keysDisplay: 'Ctrl + Z', keysMacDisplay: '⌘Z', difficulty: 'easy', tags: ['undo'], frequency: 'common' },
  { id: 'notion-redo', app: 'notion', category: 'general', action: 'Redo', description: 'Redo last undone action', keys: ['Ctrl', 'Y'], keysMac: ['Cmd', 'Shift', 'Z'], keysDisplay: 'Ctrl + Y', keysMacDisplay: '⌘⇧Z', difficulty: 'easy', tags: ['redo'], frequency: 'common' },

  // Editing
  { id: 'notion-insert-block', app: 'notion', category: 'editing', action: 'Insert Block', description: 'Open block insert menu', keys: ['/'], keysDisplay: '/', difficulty: 'easy', tags: ['block', 'insert'], frequency: 'common' },
  { id: 'notion-duplicate-block', app: 'notion', category: 'blocks', action: 'Duplicate Block', description: 'Duplicate the selected block', keys: ['Ctrl', 'D'], keysMac: ['Cmd', 'D'], keysDisplay: 'Ctrl + D', keysMacDisplay: '⌘D', difficulty: 'easy', tags: ['duplicate'], frequency: 'occasional' },
  { id: 'notion-move-block-up', app: 'notion', category: 'blocks', action: 'Move Block Up', description: 'Move selected block up', keys: ['Ctrl', 'Shift', 'Alt', 'Up'], keysMac: ['Cmd', 'Shift', 'Alt', 'Up'], keysDisplay: 'Ctrl + Shift + Alt + ↑', keysMacDisplay: '⌘⇧⌥↑', difficulty: 'hard', tags: ['move', 'block'], frequency: 'occasional' },
  { id: 'notion-move-block-down', app: 'notion', category: 'blocks', action: 'Move Block Down', description: 'Move selected block down', keys: ['Ctrl', 'Shift', 'Alt', 'Down'], keysMac: ['Cmd', 'Shift', 'Alt', 'Down'], keysDisplay: 'Ctrl + Shift + Alt + ↓', keysMacDisplay: '⌘⇧⌥↓', difficulty: 'hard', tags: ['move', 'block'], frequency: 'occasional' },
  { id: 'notion-select-block', app: 'notion', category: 'blocks', action: 'Select Block', description: 'Select the current block', keys: ['Esc'], keysDisplay: 'Esc', difficulty: 'easy', tags: ['select', 'block'], frequency: 'common' },

  // Formatting
  { id: 'notion-bold', app: 'notion', category: 'formatting', action: 'Bold', description: 'Make text bold', keys: ['Ctrl', 'B'], keysMac: ['Cmd', 'B'], keysDisplay: 'Ctrl + B', keysMacDisplay: '⌘B', difficulty: 'easy', tags: ['bold'], frequency: 'common' },
  { id: 'notion-italic', app: 'notion', category: 'formatting', action: 'Italic', description: 'Make text italic', keys: ['Ctrl', 'I'], keysMac: ['Cmd', 'I'], keysDisplay: 'Ctrl + I', keysMacDisplay: '⌘I', difficulty: 'easy', tags: ['italic'], frequency: 'common' },
  { id: 'notion-underline', app: 'notion', category: 'formatting', action: 'Underline', description: 'Underline text', keys: ['Ctrl', 'U'], keysMac: ['Cmd', 'U'], keysDisplay: 'Ctrl + U', keysMacDisplay: '⌘U', difficulty: 'easy', tags: ['underline'], frequency: 'occasional' },
  { id: 'notion-strikethrough', app: 'notion', category: 'formatting', action: 'Strikethrough', description: 'Add strikethrough to text', keys: ['Ctrl', 'Shift', 'S'], keysMac: ['Cmd', 'Shift', 'S'], keysDisplay: 'Ctrl + Shift + S', keysMacDisplay: '⌘⇧S', difficulty: 'medium', tags: ['strikethrough'], frequency: 'occasional' },
  { id: 'notion-code-inline', app: 'notion', category: 'formatting', action: 'Inline Code', description: 'Format text as inline code', keys: ['Ctrl', 'E'], keysMac: ['Cmd', 'E'], keysDisplay: 'Ctrl + E', keysMacDisplay: '⌘E', difficulty: 'easy', tags: ['code', 'inline'], frequency: 'occasional' },
  { id: 'notion-link', app: 'notion', category: 'formatting', action: 'Add Link', description: 'Add a link to selected text', keys: ['Ctrl', 'K'], keysMac: ['Cmd', 'K'], keysDisplay: 'Ctrl + K', keysMacDisplay: '⌘K', difficulty: 'easy', tags: ['link', 'url'], frequency: 'common' },
  { id: 'notion-heading-1', app: 'notion', category: 'formatting', action: 'Heading 1', description: 'Convert to Heading 1', keys: ['Ctrl', 'Alt', '1'], keysMac: ['Cmd', 'Alt', '1'], keysDisplay: 'Ctrl + Alt + 1', keysMacDisplay: '⌘⌥1', difficulty: 'hard', tags: ['heading', 'h1'], frequency: 'occasional' },
  { id: 'notion-heading-2', app: 'notion', category: 'formatting', action: 'Heading 2', description: 'Convert to Heading 2', keys: ['Ctrl', 'Alt', '2'], keysMac: ['Cmd', 'Alt', '2'], keysDisplay: 'Ctrl + Alt + 2', keysMacDisplay: '⌘⌥2', difficulty: 'hard', tags: ['heading', 'h2'], frequency: 'occasional' },
  { id: 'notion-toggle', app: 'notion', category: 'formatting', action: 'Toggle Block', description: 'Create a toggle/collapsible block', keys: ['Ctrl', 'Alt', 'T'], keysMac: ['Cmd', 'Alt', 'T'], keysDisplay: 'Ctrl + Alt + T', keysMacDisplay: '⌘⌥T', difficulty: 'hard', tags: ['toggle', 'collapse'], frequency: 'occasional' }
]
