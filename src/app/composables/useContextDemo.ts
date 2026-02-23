/** Context demo metadata — animated use-case descriptions for each shortcut */

export interface ContextDemo {
  shortcutId: string
  scenario: string // Real-world situation where this shortcut shines
  beforeState: string // What the screen looks like before
  afterState: string // What changes after pressing the shortcut
  tip: string // Expert tip or common mistake to avoid
  emoji: string // Visual for the scenario
}

export const CONTEXT_DEMOS: ContextDemo[] = [
  // VS Code — General
  {
    shortcutId: 'vscode-command-palette',
    scenario: 'You want to run "Format Document" but can\'t find it in the menu',
    beforeState: 'Unformatted messy code, no idea where the menu item is',
    afterState: 'Command Palette opens — type "format" and it appears instantly',
    tip: 'You can run ANY VS Code command here, even ones with no keybinding',
    emoji: '🎛️'
  },
  {
    shortcutId: 'vscode-quick-open',
    scenario: 'Working in a large project and need to jump to a specific file',
    beforeState: 'Dozens of folders collapsed in the explorer sidebar',
    afterState: 'Type part of the filename and press Enter — file opens instantly',
    tip: 'Use @ inside Quick Open to jump to a symbol in the current file',
    emoji: '🔍'
  },
  {
    shortcutId: 'vscode-save',
    scenario: 'You\'ve just written a function and need to save before running',
    beforeState: 'File has unsaved dot indicator in the tab title',
    afterState: 'Dot disappears — file is saved and safe',
    tip: 'Enable "Auto Save" in settings to never lose work again',
    emoji: '💾'
  },
  {
    shortcutId: 'vscode-terminal',
    scenario: 'Need to run npm install without switching windows',
    beforeState: 'Code editor open full-screen, no terminal visible',
    afterState: 'Terminal panel appears at the bottom — type your command',
    tip: 'Press again to hide the terminal — keeps your workspace clean',
    emoji: '💻'
  },
  {
    shortcutId: 'vscode-comment-line',
    scenario: 'Debugging — want to temporarily disable a line of code',
    beforeState: 'Active line of code runs and causes a bug',
    afterState: 'Line is commented out — re-run to see the bug disappear',
    tip: 'Works on multiple selected lines at once — select many, then Ctrl+/',
    emoji: '💬'
  },
  {
    shortcutId: 'vscode-format',
    scenario: 'Code is indented inconsistently after pasting from Stack Overflow',
    beforeState: 'Mixed tabs/spaces, inconsistent indentation',
    afterState: 'Prettier formats everything — clean and consistent instantly',
    tip: 'Configure Prettier in .prettierrc to match your team\'s style',
    emoji: '✨'
  },
  {
    shortcutId: 'vscode-duplicate-line',
    scenario: 'Creating a similar CSS rule for a hover state',
    beforeState: 'One CSS rule: .button { color: blue; }',
    afterState: 'Exact copy below — just change "color" to "background"',
    tip: 'Faster than Ctrl+C, Ctrl+V because you don\'t need to select first',
    emoji: '📄'
  },
  {
    shortcutId: 'vscode-find',
    scenario: 'Bug report says error is in "validateEmail" — find it fast',
    beforeState: '500 line file, no idea where the function is',
    afterState: 'All occurrences highlighted — jump between them with Enter',
    tip: 'Ctrl+H opens Find AND Replace — fix all occurrences at once',
    emoji: '🔎'
  },
  {
    shortcutId: 'vscode-select-word',
    scenario: 'Variable is named "userId" everywhere but should be "customerId"',
    beforeState: 'Cursor on the first "userId"',
    afterState: 'Ctrl+D selects it, then each press selects the next match — rename all',
    tip: 'Use Ctrl+Shift+L to select ALL occurrences at once',
    emoji: '🎯'
  },
  // Chrome
  {
    shortcutId: 'chrome-new-tab',
    scenario: 'Reading docs and want to open a link without losing your place',
    beforeState: 'Useful documentation page open',
    afterState: 'New blank tab opens — navigate away freely',
    tip: 'Ctrl+click a link to open it in a background tab instead',
    emoji: '➕'
  },
  {
    shortcutId: 'chrome-address-bar',
    scenario: 'Want to search or navigate to a new URL quickly',
    beforeState: 'Cursor somewhere in the page content',
    afterState: 'Address bar is focused and selected — type and press Enter',
    tip: 'Type a search term and press Enter — Chrome searches automatically',
    emoji: '📍'
  },
  {
    shortcutId: 'chrome-reopen-tab',
    scenario: 'Accidentally closed an important tab with Ctrl+W',
    beforeState: 'Blank space where your tab was',
    afterState: 'Closed tab instantly restored with all its history',
    tip: 'Works for multiple tabs — press repeatedly to restore more',
    emoji: '↩️'
  },
  // Windows
  {
    shortcutId: 'windows-lock',
    scenario: 'Stepping away from your desk in a public space',
    beforeState: 'Your work visible on screen, anyone could look',
    afterState: 'Lock screen shown — requires password to return',
    tip: 'Make this a habit — muscle memory protects your work automatically',
    emoji: '🔒'
  },
  {
    shortcutId: 'windows-desktop',
    scenario: 'Screen-sharing and a private window is in the way',
    beforeState: '8 windows open — something embarrassing visible',
    afterState: 'All windows minimised to taskbar instantly',
    tip: 'Press again to restore all windows to their previous state',
    emoji: '🏠'
  }
]

export function useContextDemo() {
  function getDemo(shortcutId: string): ContextDemo | null {
    return CONTEXT_DEMOS.find(d => d.shortcutId === shortcutId) ?? null
  }

  function hasDemo(shortcutId: string): boolean {
    return CONTEXT_DEMOS.some(d => d.shortcutId === shortcutId)
  }

  function getDemosForApp(app: string): ContextDemo[] {
    return CONTEXT_DEMOS.filter(d => d.shortcutId.startsWith(app + '-'))
  }

  return { getDemo, hasDemo, getDemosForApp }
}
