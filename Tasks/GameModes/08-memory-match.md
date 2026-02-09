# Task: Memory Match Mode

## Objective

Classic memory card game - flip cards to match shortcuts with their actions.

## Requirements

- [ ] Grid of face-down cards
- [ ] Flip to reveal shortcut or action
- [ ] Match pairs (shortcut ↔ action)
- [ ] Track moves count
- [ ] Timer optional
- [ ] Difficulty levels (grid size)

## Game Flow

```
1. Generate card pairs (shortcut + action)
2. Shuffle and lay out grid
3. User clicks first card (flip)
4. User clicks second card (flip)
5. If match: Cards stay revealed
6. If no match: Brief pause, flip back
7. Continue until all matched
8. Show results (moves, time)
```

## Difficulty Levels

| Level | Grid | Pairs | Cards |
|-------|------|-------|-------|
| Easy | 3x4 | 6 | 12 |
| Medium | 4x4 | 8 | 16 |
| Hard | 4x5 | 10 | 20 |
| Expert | 5x6 | 15 | 30 |

## Implementation

```typescript
export function useMemoryMatch() {
  interface Card {
    id: string
    pairId: string
    type: 'shortcut' | 'action'
    content: string      // "Ctrl+C" or "Copy"
    isFlipped: boolean
    isMatched: boolean
  }

  const cards = ref<Card[]>([])
  const flippedCards = ref<Card[]>([])
  const moves = ref(0)
  const matches = ref(0)
  const isLocked = ref(false)  // Prevent flips during animation

  const generateCards = (shortcuts: Shortcut[], gridSize: number) => {
    const selected = shortcuts.slice(0, gridSize / 2)
    const cardPairs: Card[] = []

    selected.forEach(shortcut => {
      const pairId = crypto.randomUUID()

      // Shortcut card
      cardPairs.push({
        id: crypto.randomUUID(),
        pairId,
        type: 'shortcut',
        content: shortcut.keys.join('+'),
        isFlipped: false,
        isMatched: false
      })

      // Action card
      cardPairs.push({
        id: crypto.randomUUID(),
        pairId,
        type: 'action',
        content: shortcut.action,
        isFlipped: false,
        isMatched: false
      })
    })

    // Shuffle
    cards.value = shuffleArray(cardPairs)
  }

  const flipCard = async (card: Card) => {
    if (isLocked.value || card.isFlipped || card.isMatched) return

    card.isFlipped = true
    flippedCards.value.push(card)

    if (flippedCards.value.length === 2) {
      moves.value++
      isLocked.value = true

      const [first, second] = flippedCards.value

      if (first.pairId === second.pairId) {
        // Match!
        first.isMatched = true
        second.isMatched = true
        matches.value++

        await playMatchAnimation()
      } else {
        // No match - flip back
        await sleep(1000)
        first.isFlipped = false
        second.isFlipped = false
      }

      flippedCards.value = []
      isLocked.value = false

      // Check win
      if (matches.value === cards.value.length / 2) {
        onWin()
      }
    }
  }
}
```

## Visual Design

```
┌──────────────────────────────────────┐
│  Memory Match    Moves: 12           │
│                                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
│  │ ?  │ │Copy│ │ ?  │ │ ?  │        │
│  └────┘ └────┘ └────┘ └────┘        │
│                                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
│  │ ?  │ │ ?  │ │Ctrl│ │ ?  │        │
│  │    │ │    │ │+C  │ │    │        │
│  └────┘ └────┘ └────┘ └────┘        │
│                                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
│  │ ✓  │ │ ✓  │ │ ?  │ │ ?  │        │
│  └────┘ └────┘ └────┘ └────┘        │
│                                      │
│  Pairs: 2/6                          │
└──────────────────────────────────────┘
```

## Acceptance Criteria

- Cards flip with 3D animation
- Matching works correctly
- Move counter accurate
- Matched pairs stay revealed
- Win detection works
- Multiple difficulties
