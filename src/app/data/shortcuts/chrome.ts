import type { AppDefinition, Shortcut } from '~/types/shortcut'

export const chromeApp: AppDefinition = {
  id: 'chrome',
  name: 'Chrome',
  icon: '◉',
  platform: 'both',
  categories: [
    { id: 'tabs', name: 'Tabs', description: 'Tab management' },
    { id: 'navigation', name: 'Navigation', description: 'Browser navigation' },
    { id: 'page', name: 'Page', description: 'Page interaction' },
    { id: 'devtools', name: 'DevTools', description: 'Developer tools' },
    { id: 'address', name: 'Address Bar', description: 'URL and search bar' }
  ]
}

export const chromeShortcuts: Shortcut[] = [
  // Tabs
  { id: 'chrome-new-tab', app: 'chrome', category: 'tabs', action: 'New Tab', description: 'Open a new tab', keys: ['Ctrl', 'T'], keysMac: ['Cmd', 'T'], keysDisplay: 'Ctrl + T', keysMacDisplay: '⌘T', difficulty: 'easy', tags: ['tab', 'new'], frequency: 'common' },
  { id: 'chrome-close-tab', app: 'chrome', category: 'tabs', action: 'Close Tab', description: 'Close the current tab', keys: ['Ctrl', 'W'], keysMac: ['Cmd', 'W'], keysDisplay: 'Ctrl + W', keysMacDisplay: '⌘W', difficulty: 'easy', tags: ['tab', 'close'], frequency: 'common' },
  { id: 'chrome-reopen-tab', app: 'chrome', category: 'tabs', action: 'Reopen Tab', description: 'Reopen the last closed tab', keys: ['Ctrl', 'Shift', 'T'], keysMac: ['Cmd', 'Shift', 'T'], keysDisplay: 'Ctrl + Shift + T', keysMacDisplay: '⌘⇧T', difficulty: 'medium', tags: ['tab', 'reopen'], frequency: 'common' },
  { id: 'chrome-next-tab', app: 'chrome', category: 'tabs', action: 'Next Tab', description: 'Switch to the next tab', keys: ['Ctrl', 'Tab'], keysMac: ['Cmd', 'Alt', 'Right'], keysDisplay: 'Ctrl + Tab', keysMacDisplay: '⌘⌥→', difficulty: 'easy', tags: ['tab', 'switch'], frequency: 'common' },
  { id: 'chrome-prev-tab', app: 'chrome', category: 'tabs', action: 'Previous Tab', description: 'Switch to the previous tab', keys: ['Ctrl', 'Shift', 'Tab'], keysMac: ['Cmd', 'Alt', 'Left'], keysDisplay: 'Ctrl + Shift + Tab', keysMacDisplay: '⌘⌥←', difficulty: 'medium', tags: ['tab', 'switch'], frequency: 'common' },
  { id: 'chrome-tab-1', app: 'chrome', category: 'tabs', action: 'Go to Tab 1', description: 'Jump to first tab', keys: ['Ctrl', '1'], keysMac: ['Cmd', '1'], keysDisplay: 'Ctrl + 1', keysMacDisplay: '⌘1', difficulty: 'easy', tags: ['tab'], frequency: 'occasional' },
  { id: 'chrome-last-tab', app: 'chrome', category: 'tabs', action: 'Go to Last Tab', description: 'Jump to last tab', keys: ['Ctrl', '9'], keysMac: ['Cmd', '9'], keysDisplay: 'Ctrl + 9', keysMacDisplay: '⌘9', difficulty: 'easy', tags: ['tab'], frequency: 'occasional' },
  { id: 'chrome-new-window', app: 'chrome', category: 'tabs', action: 'New Window', description: 'Open a new browser window', keys: ['Ctrl', 'N'], keysMac: ['Cmd', 'N'], keysDisplay: 'Ctrl + N', keysMacDisplay: '⌘N', difficulty: 'easy', tags: ['window', 'new'], frequency: 'common' },
  { id: 'chrome-incognito', app: 'chrome', category: 'tabs', action: 'Incognito Window', description: 'Open a new incognito window', keys: ['Ctrl', 'Shift', 'N'], keysMac: ['Cmd', 'Shift', 'N'], keysDisplay: 'Ctrl + Shift + N', keysMacDisplay: '⌘⇧N', difficulty: 'medium', tags: ['incognito', 'private'], frequency: 'occasional' },

  // Navigation
  { id: 'chrome-back', app: 'chrome', category: 'navigation', action: 'Back', description: 'Go back to previous page', keys: ['Alt', 'Left'], keysMac: ['Cmd', 'Left'], keysDisplay: 'Alt + ←', keysMacDisplay: '⌘←', difficulty: 'easy', tags: ['back', 'navigate'], frequency: 'common' },
  { id: 'chrome-forward', app: 'chrome', category: 'navigation', action: 'Forward', description: 'Go forward to next page', keys: ['Alt', 'Right'], keysMac: ['Cmd', 'Right'], keysDisplay: 'Alt + →', keysMacDisplay: '⌘→', difficulty: 'easy', tags: ['forward', 'navigate'], frequency: 'common' },
  { id: 'chrome-reload', app: 'chrome', category: 'navigation', action: 'Reload', description: 'Reload the current page', keys: ['Ctrl', 'R'], keysMac: ['Cmd', 'R'], keysDisplay: 'Ctrl + R', keysMacDisplay: '⌘R', difficulty: 'easy', tags: ['reload', 'refresh'], frequency: 'common' },
  { id: 'chrome-hard-reload', app: 'chrome', category: 'navigation', action: 'Hard Reload', description: 'Reload page bypassing cache', keys: ['Ctrl', 'Shift', 'R'], keysMac: ['Cmd', 'Shift', 'R'], keysDisplay: 'Ctrl + Shift + R', keysMacDisplay: '⌘⇧R', difficulty: 'medium', tags: ['reload', 'cache'], frequency: 'occasional' },
  { id: 'chrome-home', app: 'chrome', category: 'navigation', action: 'Go to Top', description: 'Scroll to top of page', keys: ['Ctrl', 'Home'], keysMac: ['Cmd', 'Up'], keysDisplay: 'Ctrl + Home', keysMacDisplay: '⌘↑', difficulty: 'medium', tags: ['top', 'scroll'], frequency: 'occasional' },
  { id: 'chrome-end', app: 'chrome', category: 'navigation', action: 'Go to Bottom', description: 'Scroll to bottom of page', keys: ['Ctrl', 'End'], keysMac: ['Cmd', 'Down'], keysDisplay: 'Ctrl + End', keysMacDisplay: '⌘↓', difficulty: 'medium', tags: ['bottom', 'scroll'], frequency: 'occasional' },

  // Page
  { id: 'chrome-find', app: 'chrome', category: 'page', action: 'Find in Page', description: 'Search for text on the page', keys: ['Ctrl', 'F'], keysMac: ['Cmd', 'F'], keysDisplay: 'Ctrl + F', keysMacDisplay: '⌘F', difficulty: 'easy', tags: ['find', 'search'], frequency: 'common' },
  { id: 'chrome-zoom-in', app: 'chrome', category: 'page', action: 'Zoom In', description: 'Increase page zoom level', keys: ['Ctrl', '='], keysMac: ['Cmd', '='], keysDisplay: 'Ctrl + +', keysMacDisplay: '⌘+', difficulty: 'easy', tags: ['zoom'], frequency: 'occasional' },
  { id: 'chrome-zoom-out', app: 'chrome', category: 'page', action: 'Zoom Out', description: 'Decrease page zoom level', keys: ['Ctrl', '-'], keysMac: ['Cmd', '-'], keysDisplay: 'Ctrl + -', keysMacDisplay: '⌘-', difficulty: 'easy', tags: ['zoom'], frequency: 'occasional' },
  { id: 'chrome-zoom-reset', app: 'chrome', category: 'page', action: 'Reset Zoom', description: 'Reset zoom to 100%', keys: ['Ctrl', '0'], keysMac: ['Cmd', '0'], keysDisplay: 'Ctrl + 0', keysMacDisplay: '⌘0', difficulty: 'easy', tags: ['zoom', 'reset'], frequency: 'occasional' },
  { id: 'chrome-save-page', app: 'chrome', category: 'page', action: 'Save Page', description: 'Save the current page', keys: ['Ctrl', 'S'], keysMac: ['Cmd', 'S'], keysDisplay: 'Ctrl + S', keysMacDisplay: '⌘S', difficulty: 'easy', tags: ['save', 'page'], frequency: 'rare' },
  { id: 'chrome-view-source', app: 'chrome', category: 'page', action: 'View Source', description: 'View page source code', keys: ['Ctrl', 'U'], keysMac: ['Cmd', 'U'], keysDisplay: 'Ctrl + U', keysMacDisplay: '⌘U', difficulty: 'easy', tags: ['source', 'code'], frequency: 'occasional' },
  { id: 'chrome-fullscreen', app: 'chrome', category: 'page', action: 'Fullscreen', description: 'Toggle fullscreen mode', keys: ['F11'], keysDisplay: 'F11', difficulty: 'easy', tags: ['fullscreen'], frequency: 'occasional' },
  { id: 'chrome-bookmark', app: 'chrome', category: 'page', action: 'Bookmark Page', description: 'Bookmark the current page', keys: ['Ctrl', 'D'], keysMac: ['Cmd', 'D'], keysDisplay: 'Ctrl + D', keysMacDisplay: '⌘D', difficulty: 'easy', tags: ['bookmark'], frequency: 'occasional' },

  // Address Bar
  { id: 'chrome-address-bar', app: 'chrome', category: 'address', action: 'Focus Address Bar', description: 'Focus the URL/address bar', keys: ['Ctrl', 'L'], keysMac: ['Cmd', 'L'], keysDisplay: 'Ctrl + L', keysMacDisplay: '⌘L', difficulty: 'easy', tags: ['address', 'url'], frequency: 'common' },

  // DevTools
  { id: 'chrome-devtools', app: 'chrome', category: 'devtools', action: 'Open DevTools', description: 'Open Chrome DevTools', keys: ['F12'], keysDisplay: 'F12', difficulty: 'easy', tags: ['devtools', 'inspect'], frequency: 'common' },
  { id: 'chrome-devtools-console', app: 'chrome', category: 'devtools', action: 'DevTools Console', description: 'Open DevTools on Console panel', keys: ['Ctrl', 'Shift', 'J'], keysMac: ['Cmd', 'Alt', 'J'], keysDisplay: 'Ctrl + Shift + J', keysMacDisplay: '⌘⌥J', difficulty: 'medium', tags: ['console', 'devtools'], frequency: 'common' },
  { id: 'chrome-inspect', app: 'chrome', category: 'devtools', action: 'Inspect Element', description: 'Inspect the current element', keys: ['Ctrl', 'Shift', 'I'], keysMac: ['Cmd', 'Alt', 'I'], keysDisplay: 'Ctrl + Shift + I', keysMacDisplay: '⌘⌥I', difficulty: 'medium', tags: ['inspect', 'element'], frequency: 'common' }
]
