import type { Shortcut } from '~/types/shortcut'

/** Generate printable HTML cheat sheets from shortcut data */

export interface CheatsheetOptions {
  app?: string
  category?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  title?: string
  columns?: 1 | 2 | 3
  platform?: 'windows' | 'mac'
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildShortcutRows(shortcuts: Shortcut[], platform: 'windows' | 'mac'): string {
  return shortcuts
    .map((s) => {
      const keys = platform === 'mac' && s.keysMacDisplay ? s.keysMacDisplay : s.keysDisplay
      return `
        <tr>
          <td class="keys">${escapeHtml(keys ?? '')}</td>
          <td class="action">${escapeHtml(s.action)}</td>
          <td class="desc">${escapeHtml(s.description ?? '')}</td>
        </tr>`
    })
    .join('')
}

function buildCategorySection(
  category: string,
  shortcuts: Shortcut[],
  platform: 'windows' | 'mac'
): string {
  if (shortcuts.length === 0) return ''
  return `
    <section class="category">
      <h2>${escapeHtml(category)}</h2>
      <table>
        <thead><tr><th>Keys</th><th>Action</th><th>Description</th></tr></thead>
        <tbody>${buildShortcutRows(shortcuts, platform)}</tbody>
      </table>
    </section>`
}

export function useCheatsheetExport() {
  function generateHTML(shortcuts: Shortcut[], options: CheatsheetOptions = {}): string {
    const {
      title = 'Keyboard Shortcut Cheat Sheet',
      columns = 2,
      platform = 'windows'
    } = options

    // Group by category
    const byCategory = new Map<string, Shortcut[]>()
    shortcuts.forEach((s) => {
      if (!byCategory.has(s.category)) byCategory.set(s.category, [])
      byCategory.get(s.category)!.push(s)
    })

    const sections = Array.from(byCategory.entries())
      .map(([cat, items]) => buildCategorySection(cat, items, platform))
      .join('')

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: #fff;
      color: #0f172a;
      padding: 2rem;
      column-count: ${columns};
      column-gap: 2rem;
    }
    h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; column-span: all; }
    .category { break-inside: avoid; margin-bottom: 1.5rem; }
    h2 {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #64748b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.25rem;
      margin-bottom: 0.5rem;
    }
    table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
    th { text-align: left; font-size: 0.65rem; color: #94a3b8; padding: 0.2rem 0.4rem; }
    td { padding: 0.2rem 0.4rem; vertical-align: top; }
    td.keys {
      font-family: 'Courier New', monospace;
      font-weight: 600;
      white-space: nowrap;
      color: #0ea5e9;
      width: 35%;
    }
    td.action { font-weight: 500; width: 30%; }
    td.desc { color: #64748b; font-size: 0.73rem; }
    tr:hover td { background: #f8fafc; }
    @media print {
      body { padding: 0.5rem; }
      tr:hover td { background: none; }
    }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${sections}
</body>
</html>`
  }

  /** Opens the cheat sheet in a new browser tab for printing */
  function openPrintView(shortcuts: Shortcut[], options: CheatsheetOptions = {}): void {
    if (!import.meta.client) return

    const html = generateHTML(shortcuts, options)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const win = window.open(url, '_blank')

    if (win) {
      win.addEventListener('load', () => {
        win.focus()
        win.print()
        URL.revokeObjectURL(url)
      })
    }
  }

  /** Downloads the cheat sheet as an HTML file */
  function downloadHTML(shortcuts: Shortcut[], options: CheatsheetOptions = {}): void {
    if (!import.meta.client) return

    const { title = 'cheatsheet' } = options
    const html = generateHTML(shortcuts, options)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return { generateHTML, openPrintView, downloadHTML }
}
