import type { AppDefinition, Shortcut } from '~/types/shortcut'

export const chatgptApp: AppDefinition = {
  id: 'chatgpt',
  name: 'ChatGPT',
  icon: '◎',
  platform: 'web',
  categories: [
    { id: 'general', name: 'General', description: 'Common ChatGPT shortcuts' },
    { id: 'editing', name: 'Editing', description: 'Message editing' }
  ]
}

export const chatgptShortcuts: Shortcut[] = [
  { id: 'chatgpt-submit', app: 'chatgpt', category: 'general', action: 'Submit Message', description: 'Send your message', keys: ['Enter'], keysDisplay: 'Enter', difficulty: 'easy', tags: ['submit', 'send'], frequency: 'common' },
  { id: 'chatgpt-newline', app: 'chatgpt', category: 'general', action: 'New Line', description: 'Insert a new line in message', keys: ['Shift', 'Enter'], keysDisplay: 'Shift + Enter', difficulty: 'easy', tags: ['newline'], frequency: 'common' },
  { id: 'chatgpt-stop', app: 'chatgpt', category: 'general', action: 'Stop Generation', description: 'Stop the current response', keys: ['Shift', 'Esc'], keysDisplay: 'Shift + Esc', difficulty: 'easy', tags: ['stop', 'cancel'], frequency: 'common' },
  { id: 'chatgpt-new-chat', app: 'chatgpt', category: 'general', action: 'New Chat', description: 'Start a new conversation', keys: ['Ctrl', 'Shift', 'O'], keysMac: ['Cmd', 'Shift', 'O'], keysDisplay: 'Ctrl + Shift + O', keysMacDisplay: '⌘⇧O', difficulty: 'medium', tags: ['new', 'chat'], frequency: 'common' },
  { id: 'chatgpt-focus-input', app: 'chatgpt', category: 'general', action: 'Focus Input', description: 'Focus the message input field', keys: ['Shift', 'Esc'], keysDisplay: 'Shift + Esc', difficulty: 'easy', tags: ['focus', 'input'], frequency: 'occasional' },
  { id: 'chatgpt-copy-last', app: 'chatgpt', category: 'general', action: 'Copy Last Response', description: 'Copy the last response', keys: ['Ctrl', 'Shift', 'C'], keysMac: ['Cmd', 'Shift', 'C'], keysDisplay: 'Ctrl + Shift + C', keysMacDisplay: '⌘⇧C', difficulty: 'medium', tags: ['copy', 'response'], frequency: 'common' },
  { id: 'chatgpt-search-chats', app: 'chatgpt', category: 'general', action: 'Search Chats', description: 'Search through past conversations', keys: ['Ctrl', 'Shift', 'S'], keysMac: ['Cmd', 'Shift', 'S'], keysDisplay: 'Ctrl + Shift + S', keysMacDisplay: '⌘⇧S', difficulty: 'medium', tags: ['search', 'history'], frequency: 'occasional' },
  { id: 'chatgpt-history-up', app: 'chatgpt', category: 'editing', action: 'Previous Message', description: 'Go to previous message in history', keys: ['Up'], keysDisplay: '↑', difficulty: 'easy', tags: ['history'], frequency: 'occasional', context: 'When input is empty' },
  { id: 'chatgpt-toggle-sidebar', app: 'chatgpt', category: 'general', action: 'Toggle Sidebar', description: 'Show/hide the chat sidebar', keys: ['Ctrl', 'Shift', 'S'], keysMac: ['Cmd', 'Shift', 'S'], keysDisplay: 'Ctrl + Shift + S', keysMacDisplay: '⌘⇧S', difficulty: 'medium', tags: ['sidebar'], frequency: 'occasional' }
]
