import type { AppDefinition, Shortcut } from '~/types/shortcut'

import { windowsApp, windowsShortcuts } from './windows'
import { macosApp, macosShortcuts } from './macos'
import { vscodeApp, vscodeShortcuts } from './vscode'
import { chromeApp, chromeShortcuts } from './chrome'
import { claudeApp, claudeShortcuts } from './claude'
import { chatgptApp, chatgptShortcuts } from './chatgpt'
import { notionApp, notionShortcuts } from './notion'

export { windowsApp, windowsShortcuts, macosApp, macosShortcuts, vscodeApp, vscodeShortcuts }
export { chromeApp, chromeShortcuts, claudeApp, claudeShortcuts, chatgptApp, chatgptShortcuts }
export { notionApp, notionShortcuts }

export const ALL_APPS: AppDefinition[] = [
  windowsApp, macosApp, vscodeApp, chromeApp, claudeApp, chatgptApp, notionApp
]

export const ALL_SHORTCUTS: Shortcut[] = [
  ...windowsShortcuts,
  ...macosShortcuts,
  ...vscodeShortcuts,
  ...chromeShortcuts,
  ...claudeShortcuts,
  ...chatgptShortcuts,
  ...notionShortcuts
]
