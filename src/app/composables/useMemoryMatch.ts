import type { Shortcut } from '~/types/shortcut'
import { ALL_SHORTCUTS } from '~/data/shortcuts'

export interface MemoryCard {
  id: string
  shortcutId: string
  type: 'action' | 'keys'
  content: string
  isFlipped: boolean
  isMatched: boolean
}

export function useMemoryMatch() {
  // #region state
  const cards = ref<MemoryCard[]>([])
  const flippedIds = ref<string[]>([])
  const matchedPairs = ref(0)
  const totalPairs = ref(0)
  const moves = ref(0)
  const score = ref(0)
  const isComplete = ref(false)
  const isLocked = ref(false) // prevent flipping during check
  // #endregion

  // #region computed
  const isWon = computed(() => matchedPairs.value === totalPairs.value && totalPairs.value > 0)
  // #endregion

  // #region methods
  function buildCards(shortcuts: Shortcut[]): MemoryCard[] {
    const result: MemoryCard[] = []
    shortcuts.forEach((s) => {
      result.push({
        id: `${s.id}-action`,
        shortcutId: s.id,
        type: 'action',
        content: s.action,
        isFlipped: false,
        isMatched: false
      })
      result.push({
        id: `${s.id}-keys`,
        shortcutId: s.id,
        type: 'keys',
        content: s.keysDisplay ?? s.keys.join('+'),
        isFlipped: false,
        isMatched: false
      })
    })
    // Shuffle
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  function start(app?: string, pairCount = 6) {
    let pool = [...ALL_SHORTCUTS]
    if (app) pool = pool.filter(s => s.app === app)
    // Shuffle and pick N pairs
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    const selected = pool.slice(0, Math.min(pairCount, pool.length))

    cards.value = buildCards(selected)
    totalPairs.value = selected.length
    matchedPairs.value = 0
    flippedIds.value = []
    moves.value = 0
    score.value = 0
    isComplete.value = false
    isLocked.value = false
  }

  function flipCard(cardId: string) {
    if (isLocked.value || isComplete.value) return

    const card = cards.value.find(c => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    card.isFlipped = true
    flippedIds.value = [...flippedIds.value, cardId]

    if (flippedIds.value.length === 2) {
      moves.value++
      isLocked.value = true
      checkMatch()
    }
  }

  function checkMatch() {
    const [id1, id2] = flippedIds.value
    const card1 = cards.value.find(c => c.id === id1)
    const card2 = cards.value.find(c => c.id === id2)

    if (!card1 || !card2) return

    const isMatch = card1.shortcutId === card2.shortcutId && card1.id !== card2.id

    setTimeout(() => {
      if (isMatch) {
        card1.isMatched = true
        card2.isMatched = true
        matchedPairs.value++
        score.value += Math.max(100, 300 - moves.value * 5)
        if (matchedPairs.value === totalPairs.value) {
          isComplete.value = true
        }
      } else {
        card1.isFlipped = false
        card2.isFlipped = false
      }
      flippedIds.value = []
      isLocked.value = false
    }, 800)
  }

  function reset() {
    cards.value = []
    flippedIds.value = []
    matchedPairs.value = 0
    totalPairs.value = 0
    moves.value = 0
    score.value = 0
    isComplete.value = false
    isLocked.value = false
  }
  // #endregion

  return {
    cards: readonly(cards),
    matchedPairs: readonly(matchedPairs),
    totalPairs: readonly(totalPairs),
    moves: readonly(moves),
    score: readonly(score),
    isComplete: readonly(isComplete),
    isWon,
    start,
    flipCard,
    reset
  }
}
