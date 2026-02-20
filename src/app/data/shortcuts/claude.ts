import type { AppDefinition, Shortcut } from '~/types/shortcut'

export const claudeApp: AppDefinition = {
  id: 'claude',
  name: 'Claude Code',
  icon: '◆',
  platform: 'both',
  categories: [
    { id: 'general', name: 'General', description: 'Common Claude Code shortcuts' },
    { id: 'editing', name: 'Editing', description: 'Code editing and navigation' },
    { id: 'commands', name: 'Commands', description: 'Slash commands and prompts' }
  ]
}

export const claudeShortcuts: Shortcut[] = [
  { id: 'claude-submit', app: 'claude', category: 'general', action: 'Submit Message', description: 'Submit your message to Claude', keys: ['Enter'], keysDisplay: 'Enter', difficulty: 'easy', tags: ['submit', 'send'], frequency: 'common' },
  { id: 'claude-newline', app: 'claude', category: 'general', action: 'New Line', description: 'Add a new line in message', keys: ['Shift', 'Enter'], keysDisplay: 'Shift + Enter', difficulty: 'easy', tags: ['newline'], frequency: 'common' },
  { id: 'claude-cancel', app: 'claude', category: 'general', action: 'Cancel / Stop', description: 'Cancel current generation', keys: ['Esc'], keysDisplay: 'Esc', difficulty: 'easy', tags: ['cancel', 'stop'], frequency: 'common' },
  { id: 'claude-clear', app: 'claude', category: 'general', action: 'Clear Chat', description: 'Clear the current conversation', keys: ['Ctrl', 'C'], keysMac: ['Cmd', 'C'], keysDisplay: 'Ctrl + C', keysMacDisplay: '⌘C', difficulty: 'easy', tags: ['clear', 'new chat'], frequency: 'common', context: 'Press twice to clear' },
  { id: 'claude-copy', app: 'claude', category: 'general', action: 'Copy Last Response', description: 'Copy the last response to clipboard', keys: ['Ctrl', 'Shift', 'C'], keysMac: ['Cmd', 'Shift', 'C'], keysDisplay: 'Ctrl + Shift + C', keysMacDisplay: '⌘⇧C', difficulty: 'medium', tags: ['copy', 'response'], frequency: 'common' },
  { id: 'claude-history-up', app: 'claude', category: 'editing', action: 'Previous Message', description: 'Navigate to previous message in history', keys: ['Up'], keysDisplay: '↑', difficulty: 'easy', tags: ['history', 'previous'], frequency: 'common', context: 'When input is empty' },
  { id: 'claude-history-down', app: 'claude', category: 'editing', action: 'Next Message', description: 'Navigate to next message in history', keys: ['Down'], keysDisplay: '↓', difficulty: 'easy', tags: ['history', 'next'], frequency: 'common', context: 'When navigating history' },
  { id: 'claude-vim-mode', app: 'claude', category: 'editing', action: 'Toggle Vim Mode', description: 'Enable/disable vim key bindings', keys: ['Esc'], keysDisplay: 'Esc', difficulty: 'medium', tags: ['vim', 'mode'], frequency: 'rare', context: 'Via /vim command' },
  { id: 'claude-compact', app: 'claude', category: 'commands', action: 'Compact', description: 'Compress conversation context', keys: ['Ctrl', 'K'], keysMac: ['Cmd', 'K'], keysDisplay: 'Ctrl + K', keysMacDisplay: '⌘K', difficulty: 'medium', tags: ['compact', 'context'], frequency: 'occasional' }
]
