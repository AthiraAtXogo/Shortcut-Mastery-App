/** Memory mnemonics and stories to help users remember shortcuts */

export interface ShortcutStory {
  shortcutId: string
  mnemonic: string
  story?: string
  visualAid?: string
  etymology?: string
}

export const BUILT_IN_STORIES: ShortcutStory[] = [
  // Universal
  { shortcutId: 'vscode-save', mnemonic: 'S = Save. Safety first!', story: 'Press Ctrl+S after every change — S stands for Safe.', visualAid: '💾', etymology: 'S is the first letter of Save' },
  { shortcutId: 'vscode-copy', mnemonic: 'C = Copy, Clone, Carbon copy', story: 'Think of making a photocopy — you\'re creating a Clone with C!', visualAid: '📋', etymology: 'C is the first letter of Copy' },
  { shortcutId: 'vscode-paste', mnemonic: 'V points down like an arrow dropping content in', story: 'The V shape is like a funnel — content pours down into place.', visualAid: '📌', etymology: 'V was placed next to C for easy one-handed use' },
  { shortcutId: 'vscode-undo', mnemonic: 'Z = Zap it away! Last letter = last action', story: 'Z is at the end of the alphabet — go back to the end of your history.', visualAid: '⏪', etymology: 'Z ends the alphabet like Undo ends the action chain' },

  // VS Code — General
  { shortcutId: 'vscode-command-palette', mnemonic: 'P = Power Palette — your command center', story: 'Shift+P opens the Power Palette. Any command, one keystroke away.', visualAid: '⚡', etymology: 'P stands for Palette' },
  { shortcutId: 'vscode-quick-open', mnemonic: 'P without Shift = Plain file search', story: 'No Shift = simpler — just find a file by name.', visualAid: '🔍', etymology: 'P for file Picker' },
  { shortcutId: 'vscode-close-tab', mnemonic: 'W = Wipe out this tab (like closing a window)', story: 'W closes the tab. Think: W = Window closed.', visualAid: '❌', etymology: 'W from close Window' },
  { shortcutId: 'vscode-sidebar', mnemonic: 'B = Blinds — open/close the side panel like window blinds', story: 'Ctrl+B toggles the sidebar like opening the Blinds.', visualAid: '🪟', etymology: 'B for sidebar (also Bold in text editors)' },
  { shortcutId: 'vscode-terminal', mnemonic: 'Backtick = code prompt — the shell lives in backtick', story: 'The backtick ` looks like a small cursor — perfect for the terminal.', visualAid: '💻', etymology: 'Backtick visually represents a command prompt' },
  { shortcutId: 'vscode-split-editor', mnemonic: 'Backslash \\ = dividing line splitting the editor', story: 'The backslash character literally cuts the screen in two.', visualAid: '⚡', etymology: 'Backslash represents a visual divider' },

  // VS Code — Editing
  { shortcutId: 'vscode-comment-line', mnemonic: '/ = slash like // in code comments', story: 'Press the same character used to write comments — Ctrl+/.', visualAid: '💬', etymology: '/ is the start of // comment syntax' },
  { shortcutId: 'vscode-format', mnemonic: 'F = Format, tidy up your mess', story: 'Alt+Shift+F = Fully Formatted code.', visualAid: '✨', etymology: 'F for Format' },
  { shortcutId: 'vscode-delete-line', mnemonic: 'K = Kill the line (Unix tradition)', story: 'K was used in Unix terminals to "kill" (delete) a line.', visualAid: '🗡️', etymology: 'K from the Unix kill-line shortcut' },
  { shortcutId: 'vscode-duplicate-line', mnemonic: 'Alt+Shift+Down = push a copy downward', story: 'Shift means MORE — more lines! Push the duplicate down with the arrow.', visualAid: '📄', etymology: 'Arrow direction = where the copy goes' },
  { shortcutId: 'vscode-move-line-down', mnemonic: 'Alt+Down = nudge line down', story: 'Alt lifts the line, arrow steers it. No Shift = just move, no copy.', visualAid: '⬇️', etymology: 'Arrow keys indicate direction of movement' },
  { shortcutId: 'vscode-move-line-up', mnemonic: 'Alt+Up = nudge line up', story: 'Alt lifts the line, arrow steers it upward.', visualAid: '⬆️', etymology: 'Arrow keys indicate direction of movement' },

  // VS Code — Navigation
  { shortcutId: 'vscode-go-to-line', mnemonic: 'G = Go! Jump to a line number', story: 'Ctrl+G = Go to line. G for Go.', visualAid: '🚀', etymology: 'G for Go to line' },
  { shortcutId: 'vscode-go-to-definition', mnemonic: 'F12 = Follow the definition — like pressing a doorbell', story: 'F12 takes you to where the function was born.', visualAid: '🔗', etymology: 'F12 is a conventional IDE standard' },
  { shortcutId: 'vscode-find', mnemonic: 'F = Find what you\'re looking For', story: 'Ctrl+F opens the Find bar. F = Find.', visualAid: '🔎', etymology: 'F for Find' },
  { shortcutId: 'vscode-find-replace', mnemonic: 'H = Hunting and replacing', story: 'H opens Find+Replace — Hunt down and swap text.', visualAid: '🔄', etymology: 'H follows F alphabetically, like Replace follows Find' },

  // VS Code — Multi-cursor
  { shortcutId: 'vscode-select-word', mnemonic: 'D = Double-click to select (keyboard version)', story: 'Ctrl+D selects the current word then the next match — like a smart double-click.', visualAid: '🎯', etymology: 'D for select unDer cursor' },

  // Chrome
  { shortcutId: 'chrome-new-tab', mnemonic: 'T = Tab. Open a new Tab!', story: 'Ctrl+T = new Tab. T = Tab. Done.', visualAid: '➕', etymology: 'T for Tab' },
  { shortcutId: 'chrome-close-tab', mnemonic: 'W = Wipe out this tab', story: 'W closes the tab. Consistent across browsers and VS Code.', visualAid: '❌', etymology: 'W from close Window' },
  { shortcutId: 'chrome-reopen-tab', mnemonic: 'Shift+T = bring back the Tab you just killed', story: 'Shift reverses the action — Ctrl+T opened a tab, Ctrl+Shift+T reopens the last one.', visualAid: '↩️', etymology: 'Shift = reverse of the base action' },
  { shortcutId: 'chrome-new-window', mnemonic: 'N = New window appears', story: 'Ctrl+N = New window. N = New.', visualAid: '🪟', etymology: 'N for New' },
  { shortcutId: 'chrome-address-bar', mnemonic: 'L = Location bar (the URL is the location)', story: 'Ctrl+L focuses the address bar — L for Location.', visualAid: '📍', etymology: 'L for Location/URL bar' },
  { shortcutId: 'chrome-find', mnemonic: 'F = Find on this page', story: 'Ctrl+F = Find. Same key as VS Code Find.', visualAid: '🔍', etymology: 'F for Find — universal' },

  // Figma
  { shortcutId: 'figma-frame', mnemonic: 'F = Frame tool — F creates Frames', story: 'Press F to grab the Frame tool. F = Frame.', visualAid: '🖼️', etymology: 'F for Frame' },
  { shortcutId: 'figma-zoom-fit', mnemonic: 'Shift+1 = zoom to fit everything (1 = one view)', story: 'Shift+1 = zoom out to see the whole picture at once.', visualAid: '🔭', etymology: '1 represents 100% or "one whole view"' },

  // Windows
  { shortcutId: 'windows-lock', mnemonic: 'Win+L = Lock it! L = Lock', story: 'Win+L locks your screen. Always lock when stepping away.', visualAid: '🔒', etymology: 'L for Lock' },
  { shortcutId: 'windows-desktop', mnemonic: 'Win+D = Drop everything to Desktop', story: 'Win+D = show Desktop. All windows hide instantly.', visualAid: '🏠', etymology: 'D for Desktop' }
]

export interface CustomStory {
  shortcutId: string
  mnemonic: string
  addedAt: Date
}

export function useShortcutStories() {
  // #region state
  const customStories = ref<Map<string, CustomStory>>(new Map())
  // #endregion

  // #region methods
  function getStory(shortcutId: string): ShortcutStory | null {
    return BUILT_IN_STORIES.find(s => s.shortcutId === shortcutId) ?? null
  }

  function getCustomStory(shortcutId: string): CustomStory | null {
    return customStories.value.get(shortcutId) ?? null
  }

  function addCustomStory(shortcutId: string, mnemonic: string): void {
    customStories.value.set(shortcutId, {
      shortcutId,
      mnemonic,
      addedAt: new Date()
    })
  }

  function removeCustomStory(shortcutId: string): void {
    customStories.value.delete(shortcutId)
  }

  /** Returns built-in story first, falls back to custom */
  function getBestStory(shortcutId: string): { mnemonic: string, isCustom: boolean } | null {
    const builtin = getStory(shortcutId)
    if (builtin) return { mnemonic: builtin.mnemonic, isCustom: false }

    const custom = getCustomStory(shortcutId)
    if (custom) return { mnemonic: custom.mnemonic, isCustom: true }

    return null
  }

  function hasStory(shortcutId: string): boolean {
    return getStory(shortcutId) !== null || customStories.value.has(shortcutId)
  }

  function loadCustomStories(stories: CustomStory[]): void {
    const map = new Map<string, CustomStory>()
    stories.forEach(s => map.set(s.shortcutId, s))
    customStories.value = map
  }

  function getAllCustomStories(): CustomStory[] {
    return Array.from(customStories.value.values())
  }
  // #endregion

  return {
    customStories: readonly(customStories),
    getStory,
    getCustomStory,
    addCustomStory,
    removeCustomStory,
    getBestStory,
    hasStory,
    loadCustomStories,
    getAllCustomStories
  }
}
