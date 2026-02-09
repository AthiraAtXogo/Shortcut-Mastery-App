# Task: Weakness Analysis

## Objective

Analyze user performance to identify areas that need more practice.

## Requirements

- [ ] Track performance per shortcut
- [ ] Calculate weakness scores
- [ ] Identify patterns (modifier combos, specific apps)
- [ ] Generate recommendations
- [ ] Visual weakness report

## Metrics Tracked

| Metric | Description |
|--------|-------------|
| Accuracy | Correct / Total attempts |
| Speed | Average response time |
| Consistency | Variance in performance |
| Recency | Time since last practice |
| Difficulty | Inherent shortcut complexity |

## Weakness Score Formula

```typescript
const calculateWeaknessScore = (stats: ShortcutStats): number => {
  // Higher score = needs more practice
  let score = 0

  // Low accuracy = high weakness
  score += (1 - stats.accuracy) * 40

  // Slow speed = weakness
  const speedScore = Math.min(stats.avgTime / 3000, 1)
  score += speedScore * 20

  // Haven't practiced recently = weakness
  const daysSinceLastPractice = (Date.now() - stats.lastPracticed) / 86400000
  score += Math.min(daysSinceLastPractice / 7, 1) * 20

  // High difficulty + low accuracy = extra weakness
  if (stats.difficulty === 'hard' && stats.accuracy < 0.7) {
    score += 20
  }

  return Math.min(score, 100)
}
```

## Pattern Analysis

```typescript
const analyzePatterns = (shortcuts: ShortcutStats[]): Pattern[] => {
  const patterns: Pattern[] = []

  // Group by modifier combinations
  const modifierGroups = groupBy(shortcuts, s => s.modifiers.sort().join('+'))
  for (const [modifiers, group] of Object.entries(modifierGroups)) {
    const avgAccuracy = average(group.map(s => s.accuracy))
    if (avgAccuracy < 0.7) {
      patterns.push({
        type: 'modifier',
        description: `Struggling with ${modifiers} combinations`,
        shortcuts: group.map(s => s.id),
        severity: 1 - avgAccuracy
      })
    }
  }

  // Group by app
  const appGroups = groupBy(shortcuts, s => s.app)
  for (const [app, group] of Object.entries(appGroups)) {
    const avgAccuracy = average(group.map(s => s.accuracy))
    if (avgAccuracy < 0.7) {
      patterns.push({
        type: 'app',
        description: `Need more practice with ${app}`,
        shortcuts: group.map(s => s.id),
        severity: 1 - avgAccuracy
      })
    }
  }

  // Three-key combos
  const threeKey = shortcuts.filter(s => s.keys.length >= 3)
  if (threeKey.length > 0) {
    const avgAccuracy = average(threeKey.map(s => s.accuracy))
    if (avgAccuracy < 0.6) {
      patterns.push({
        type: 'complexity',
        description: 'Three-key combinations need work',
        shortcuts: threeKey.map(s => s.id),
        severity: 1 - avgAccuracy
      })
    }
  }

  return patterns.sort((a, b) => b.severity - a.severity)
}
```

## Report UI

```
┌─────────────────────────────────────────────┐
│  📊 Weakness Analysis                       │
│                                             │
│  Overall Accuracy: 78%                      │
│  ████████████████░░░░                       │
│                                             │
│  🔴 Areas to Focus:                         │
│                                             │
│  1. Ctrl+Shift combinations (62% accuracy)  │
│     - Ctrl+Shift+P, Ctrl+Shift+F, etc.     │
│     [Practice These]                        │
│                                             │
│  2. VS Code shortcuts (68% accuracy)        │
│     - 12 shortcuts need review             │
│     [Practice These]                        │
│                                             │
│  3. Three-key combos (55% accuracy)         │
│     - Most difficult category              │
│     [Practice These]                        │
│                                             │
│  ✅ Strengths:                              │
│  - Basic copy/paste (98%)                   │
│  - Browser navigation (92%)                 │
│                                             │
└─────────────────────────────────────────────┘
```

## Acceptance Criteria

- Weakness score calculated accurately
- Patterns identified correctly
- Recommendations are actionable
- Can jump to practice weak areas
- Updates as user improves
