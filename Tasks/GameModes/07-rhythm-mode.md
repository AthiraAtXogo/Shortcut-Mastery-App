# Task: Rhythm Mode

## Objective

Shortcuts fall from the top to a beat, user must press them when they reach the hit zone.

## Requirements

- [ ] Background music with consistent BPM
- [ ] Shortcuts fall in sync with beat
- [ ] Hit zone at bottom
- [ ] Timing judgment (Perfect/Great/Good/Miss)
- [ ] Combo system
- [ ] Visual feedback on hits

## Game Flow

```
1. Select song/BPM
2. Music starts
3. Shortcuts fall from top
4. User presses when shortcut reaches hit zone
5. Judged on timing accuracy
6. Continue for song duration
7. Show results
```

## Timing Windows

| Judgment | Window | Score | Combo |
|----------|--------|-------|-------|
| Perfect | ±50ms | 100 | Continue |
| Great | ±100ms | 75 | Continue |
| Good | ±150ms | 50 | Continue |
| Miss | >150ms | 0 | Break |

## Implementation

```typescript
export function useRhythmMode() {
  const bpm = ref(120)
  const beatInterval = computed(() => 60000 / bpm.value)

  const notes = ref<RhythmNote[]>([])
  const score = ref(0)
  const combo = ref(0)
  const judgments = ref<Judgment[]>([])

  interface RhythmNote {
    id: string
    shortcut: Shortcut
    targetTime: number  // When it should be hit
    position: number    // Y position (0-100)
    hit: boolean
  }

  const spawnNote = (shortcut: Shortcut, targetTime: number) => {
    notes.value.push({
      id: crypto.randomUUID(),
      shortcut,
      targetTime,
      position: 0,
      hit: false
    })
  }

  // Animation loop - move notes down
  const updateNotes = (currentTime: number) => {
    const fallDuration = 2000 // 2 seconds to fall

    notes.value.forEach(note => {
      const timeUntilHit = note.targetTime - currentTime
      note.position = 100 - (timeUntilHit / fallDuration) * 100

      // Remove if missed and off screen
      if (note.position > 110 && !note.hit) {
        onMiss(note)
      }
    })

    // Clean up old notes
    notes.value = notes.value.filter(n => n.position < 120)
  }

  const onKeyPress = (pressedKeys: string[], currentTime: number) => {
    // Find closest unhit note that matches
    const matchingNote = notes.value
      .filter(n => !n.hit && arraysEqual(n.shortcut.keys, pressedKeys))
      .sort((a, b) => Math.abs(a.targetTime - currentTime) - Math.abs(b.targetTime - currentTime))
      [0]

    if (!matchingNote) return

    const timing = Math.abs(matchingNote.targetTime - currentTime)
    const judgment = getJudgment(timing)

    matchingNote.hit = true
    applyJudgment(judgment)
  }

  const getJudgment = (timing: number): 'perfect' | 'great' | 'good' | 'miss' => {
    if (timing <= 50) return 'perfect'
    if (timing <= 100) return 'great'
    if (timing <= 150) return 'good'
    return 'miss'
  }
}
```

## Visual Design

```
┌─────────────────────────────┐
│  ♪ Rhythm Mode ♪            │
│  Score: 2,450   Combo: x23  │
│                             │
│      [Ctrl+S]  ↓            │
│                             │
│           [Ctrl+C]  ↓       │
│                             │
│  ════════════════════════   │  ← Hit Zone
│        PERFECT!             │
│                             │
└─────────────────────────────┘
```

## Acceptance Criteria

- Notes sync to beat
- Timing judgments accurate
- Visual feedback immediate
- Combo tracks correctly
- Music and gameplay sync
- Fun to play!
