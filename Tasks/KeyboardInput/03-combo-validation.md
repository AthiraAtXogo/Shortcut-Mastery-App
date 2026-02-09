# Task: Combo Validation

## Objective

Validate that the user's pressed keys match the expected shortcut combination.

## Requirements

- [ ] Create useComboValidator composable
- [ ] Match pressed keys against expected
- [ ] Handle order-independent modifier matching
- [ ] Support partial matching (show progress)
- [ ] Handle timing (too slow = timeout)
- [ ] Return validation result with details

## Technical Details

### Validation Logic

```typescript
// composables/useComboValidator.ts

interface ValidationResult {
  isCorrect: boolean
  isPartial: boolean      // Some keys correct, waiting for more
  isTimeout: boolean
  pressedKeys: string[]
  expectedKeys: string[]
  missingKeys: string[]
  extraKeys: string[]
  timing: number          // ms taken
}

export function useComboValidator() {
  const { getCurrentCombo } = useKeyCapture()
  const { matchModifier } = useModifiers()

  const validate = (
    pressed: string[],
    expected: string[],
    options: { allowPartial?: boolean } = {}
  ): ValidationResult => {
    const normalizedExpected = normalizeCombo(expected)
    const normalizedPressed = normalizeCombo(pressed)

    // Check for exact match
    const isExactMatch = arraysEqual(normalizedPressed, normalizedExpected)

    // Check for partial match (all pressed keys are in expected)
    const isPartial = options.allowPartial &&
      normalizedPressed.every(k => normalizedExpected.includes(k)) &&
      normalizedPressed.length < normalizedExpected.length

    // Find differences
    const missingKeys = normalizedExpected.filter(k => !normalizedPressed.includes(k))
    const extraKeys = normalizedPressed.filter(k => !normalizedExpected.includes(k))

    return {
      isCorrect: isExactMatch,
      isPartial,
      isTimeout: false,
      pressedKeys: normalizedPressed,
      expectedKeys: normalizedExpected,
      missingKeys,
      extraKeys,
      timing: 0
    }
  }

  // Normalize combo for comparison
  const normalizeCombo = (keys: string[]): string[] => {
    const modifierOrder = ['Ctrl', 'Cmd', 'Alt', 'Shift']

    // Handle Ctrl/Cmd equivalence
    const normalized = keys.map(k => {
      if (k === 'Ctrl/Cmd') return isMac ? 'Cmd' : 'Ctrl'
      return k
    })

    // Sort: modifiers first (in order), then other keys alphabetically
    return normalized.sort((a, b) => {
      const aIsModifier = modifierOrder.includes(a)
      const bIsModifier = modifierOrder.includes(b)

      if (aIsModifier && bIsModifier) {
        return modifierOrder.indexOf(a) - modifierOrder.indexOf(b)
      }
      if (aIsModifier) return -1
      if (bIsModifier) return 1
      return a.localeCompare(b)
    })
  }

  const arraysEqual = (a: string[], b: string[]): boolean => {
    if (a.length !== b.length) return false
    return a.every((val, i) => val === b[i])
  }

  return { validate, normalizeCombo }
}
```

### Timed Validation

```typescript
// For game modes with time limits
const validateWithTimeout = async (
  expected: string[],
  timeoutMs: number
): Promise<ValidationResult> => {
  return new Promise((resolve) => {
    const startTime = Date.now()
    let resolved = false

    const checkCombo = () => {
      if (resolved) return

      const pressed = getCurrentCombo()
      const result = validate(pressed, expected, { allowPartial: true })

      if (result.isCorrect) {
        resolved = true
        resolve({ ...result, timing: Date.now() - startTime })
      } else if (Date.now() - startTime >= timeoutMs) {
        resolved = true
        resolve({
          ...result,
          isTimeout: true,
          timing: timeoutMs
        })
      }
    }

    // Check on each keydown
    const interval = setInterval(checkCombo, 50)

    setTimeout(() => {
      clearInterval(interval)
      if (!resolved) {
        resolved = true
        resolve({
          ...validate(getCurrentCombo(), expected),
          isTimeout: true,
          timing: timeoutMs
        })
      }
    }, timeoutMs)
  })
}
```

## Acceptance Criteria

- Exact match validation works
- Partial matching works
- Modifier equivalence handled (Ctrl/Cmd)
- Order doesn't matter for modifiers
- Timing tracked accurately
- Timeout detection works

## Notes

This is the core game logic - must be 100% accurate.
