# Task: Shortcut Stories

## Objective

Create memorable mnemonics and stories to help users remember shortcuts.

## Requirements

- [ ] Mnemonic for each shortcut
- [ ] Visual memory aids
- [ ] Etymology explanations
- [ ] User can add custom mnemonics
- [ ] Show in practice mode

## Example Stories

| Shortcut | Action | Story |
|----------|--------|-------|
| Ctrl+C | Copy | **C** = **C**opy. You're making a **C**lone! |
| Ctrl+V | Paste | **V** looks like an arrow pointing down - dropping content in |
| Ctrl+Z | Undo | **Z**ap it away! Go back in time |
| Ctrl+S | Save | **S**ave your work! **S**afety first! |
| Ctrl+F | Find | **F**ind what you're looking **F**or |
| Ctrl+Shift+P | Command Palette | **P**ower user **P**alette |
| Alt+Tab | Switch Windows | **Tab**bing through your open windows |

## Data Structure

```typescript
interface ShortcutStory {
  shortcutId: string
  mnemonic: string           // Short memory aid
  story?: string             // Longer explanation
  visualAid?: string         // Emoji or icon reference
  etymology?: string         // Why this key was chosen
  userCustom?: boolean       // User added
}

const STORIES: ShortcutStory[] = [
  {
    shortcutId: 'ctrl-c',
    mnemonic: 'C = Copy, Clone, Carbon copy',
    story: 'Think of making a photocopy - you\'re creating a Clone with C!',
    visualAid: '📋',
    etymology: 'C is the first letter of Copy'
  }
]
```

## Implementation

```typescript
// composables/useShortcutStories.ts
export function useShortcutStories() {
  const getStory = (shortcutId: string): ShortcutStory | undefined => {
    return STORIES.find(s => s.shortcutId === shortcutId)
  }

  const addCustomStory = async (shortcutId: string, mnemonic: string) => {
    await db.customStories.put({
      shortcutId,
      mnemonic,
      userCustom: true
    })
  }

  const getAllStoriesForShortcut = async (shortcutId: string) => {
    const builtIn = getStory(shortcutId)
    const custom = await db.customStories.get(shortcutId)
    return { builtIn, custom }
  }
}
```

## UI Integration

- Show mnemonic as hint in Practice mode
- Display story on hover/long press
- Allow users to add their own mnemonics
- Visual aid shown next to shortcut

## Acceptance Criteria

- Stories exist for common shortcuts
- Display in appropriate contexts
- Users can add custom mnemonics
- Helpful for memorization
