# Task: Boss Battle Mode

## Objective

Execute combo chains to defeat app "bosses" in an epic battle format.

## Requirements

- [ ] Boss with HP bar
- [ ] Combo chain challenges
- [ ] Multiple phases per boss
- [ ] Player lives system
- [ ] Boss attack patterns
- [ ] Victory celebration

## Game Flow

```
1. Boss intro (VS Code Master!)
2. Phase 1: Simple combos (2-3 shortcuts)
3. Deal damage on successful combo
4. Boss "attacks" if combo broken (lose life)
5. Phase 2: Harder combos (3-4 shortcuts)
6. Phase 3: Expert combos (4-5 shortcuts)
7. Defeat boss → Victory!
8. Lose all lives → Game Over
```

## Boss Design

| Boss | App | Phases | Theme |
|------|-----|--------|-------|
| VS Code Master | VS Code | 3 | Code editing |
| Chrome Guardian | Chrome | 3 | Web browsing |
| Windows Sentinel | Windows | 3 | OS navigation |
| Terminal Titan | CLI | 3 | Command line |

## Implementation

```typescript
export function useBossBattle() {
  interface Boss {
    id: string
    name: string
    app: string
    maxHp: number
    phases: BossPhase[]
  }

  interface BossPhase {
    hpThreshold: number  // Enter phase when HP below this %
    comboLength: number
    timeLimit: number
    shortcuts: Shortcut[]
  }

  const boss = ref<Boss | null>(null)
  const bossHp = ref(100)
  const currentPhase = ref(0)
  const playerLives = ref(3)
  const currentCombo = ref<Shortcut[]>([])
  const comboProgress = ref(0)
  const comboTimer = ref(0)

  const startBattle = async (bossId: string) => {
    boss.value = await loadBoss(bossId)
    bossHp.value = 100
    currentPhase.value = 0
    playerLives.value = 3

    generateCombo()
  }

  const generateCombo = () => {
    const phase = boss.value!.phases[currentPhase.value]
    const shortcuts = getRandomFromArray(phase.shortcuts, phase.comboLength)

    currentCombo.value = shortcuts
    comboProgress.value = 0
    comboTimer.value = phase.timeLimit

    startComboTimer()
  }

  const submitAnswer = (pressedKeys: string[]) => {
    const expectedShortcut = currentCombo.value[comboProgress.value]
    const result = validateCombo(pressedKeys, expectedShortcut.keys)

    if (result.isCorrect) {
      comboProgress.value++

      if (comboProgress.value >= currentCombo.value.length) {
        // Combo complete! Damage boss
        dealDamage()
      }
      return { hit: true }
    }

    // Combo broken - boss attacks!
    bossAttack()
    return { hit: false }
  }

  const dealDamage = () => {
    const damage = 10 + currentPhase.value * 5
    bossHp.value = Math.max(0, bossHp.value - damage)

    // Check phase transition
    const phase = boss.value!.phases[currentPhase.value]
    if (bossHp.value < phase.hpThreshold && currentPhase.value < boss.value!.phases.length - 1) {
      currentPhase.value++
      // Phase transition animation
    }

    // Check defeat
    if (bossHp.value <= 0) {
      onVictory()
      return
    }

    generateCombo()
  }

  const bossAttack = () => {
    playerLives.value--

    if (playerLives.value <= 0) {
      onDefeat()
      return
    }

    // Reset combo and continue
    generateCombo()
  }
}
```

## Visual Design

```
┌─────────────────────────────────────────────┐
│          ⚔️ BOSS BATTLE ⚔️                  │
│                                             │
│        [3D VS Code Logo - glowing]          │
│           VS CODE MASTER                    │
│           Phase 2/3                         │
│                                             │
│  HP ████████████░░░░░░░░  65%              │
│                                             │
│  ❤️❤️❤️ Player Lives                        │
│                                             │
│  ══════ EXECUTE COMBO ══════               │
│                                             │
│   [Copy] → [Paste] → [Save] → [Undo]       │
│    ✅       ✅        ⏳        ○           │
│                                             │
│  ⚡ COMBO TIMER ████████░░░  3.2s          │
│                                             │
└─────────────────────────────────────────────┘
```

## Acceptance Criteria

- Boss HP decreases on hits
- Phases transition correctly
- Player loses lives on fails
- Combos must be in order
- Timer creates pressure
- Victory/defeat animations
- Epic boss battle feel!
