# ShortcutData - Feature Context

## Purpose

Define and manage the shortcut database covering Windows, macOS, VS Code, Chrome, and AI tools.

## Dependencies

- Core/06-dexie-database

## Tasks Overview

| Task | Description | Priority |
|------|-------------|----------|
| 01-data-schema | Define shortcut data structure | P0 |
| 02-windows | Windows OS shortcuts | P0 |
| 03-macos | macOS shortcuts | P1 |
| 04-vscode | VS Code shortcuts | P0 |
| 05-chrome | Chrome browser shortcuts | P0 |
| 06-claude | Claude Code shortcuts | P1 |
| 07-chatgpt | ChatGPT shortcuts | P1 |
| 08-notion | Notion shortcuts | P2 |

## Data Schema

```typescript
interface Shortcut {
  id: string
  app: string           // 'vscode', 'chrome', 'windows'
  category: string      // 'editing', 'navigation', 'general'
  action: string        // Human-readable action
  keys: string[]        // ['Ctrl', 'C']
  keysDisplay: string   // 'Ctrl+C' for display
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  description?: string
  platform?: 'windows' | 'mac' | 'both'
}
```

## Shortcut Categories per App

| App | Categories |
|-----|------------|
| Windows | General, Window Management, File Explorer, System |
| VS Code | Editing, Navigation, Search, Terminal, Debug |
| Chrome | Navigation, Tabs, Page, Developer Tools |
| Claude | Conversation, Navigation, Editing |
