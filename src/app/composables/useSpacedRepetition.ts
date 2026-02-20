import type { Shortcut } from '~/types/shortcut'

/**
 * SM-2 Spaced Repetition algorithm
 * https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method
 */

export interface SM2Card {
  shortcutId: string
  interval: number // Days until next review
  repetitions: number // Number of successful reviews
  easeFactor: number // Difficulty factor (≥1.3)
  nextReview: Date
  lastReview: Date | null
}

const MIN_EASE = 1.3
const DEFAULT_EASE = 2.5

/**
 * SM-2 quality ratings:
 * 0 - complete blackout
 * 1 - wrong, correct felt familiar
 * 2 - wrong but correct was easy to recall
 * 3 - correct with serious difficulty
 * 4 - correct after hesitation
 * 5 - perfect recall
 */
export type SM2Quality = 0 | 1 | 2 | 3 | 4 | 5

function sm2Update(card: SM2Card, quality: SM2Quality): SM2Card {
  const updated = { ...card }

  if (quality >= 3) {
    // Successful recall
    if (updated.repetitions === 0) {
      updated.interval = 1
    } else if (updated.repetitions === 1) {
      updated.interval = 6
    } else {
      updated.interval = Math.round(updated.interval * updated.easeFactor)
    }
    updated.repetitions++
  } else {
    // Failed recall — reset
    updated.repetitions = 0
    updated.interval = 1
  }

  // Update ease factor
  updated.easeFactor = Math.max(
    MIN_EASE,
    updated.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  const now = new Date()
  updated.lastReview = now
  updated.nextReview = new Date(now.getTime() + updated.interval * 86400000)

  return updated
}

function qualityFromResult(correct: boolean, attempts: number): SM2Quality {
  if (!correct) return attempts <= 1 ? 2 : 0
  if (attempts === 0) return 5
  if (attempts === 1) return 4
  return 3
}

export function useSpacedRepetition() {
  // #region state
  const cards = ref<Map<string, SM2Card>>(new Map())
  // #endregion

  // #region computed
  const dueCards = computed(() => {
    const now = new Date()
    const due: SM2Card[] = []
    cards.value.forEach((card) => {
      if (card.nextReview <= now) due.push(card)
    })
    return due.sort((a, b) => a.nextReview.getTime() - b.nextReview.getTime())
  })

  const dueCount = computed(() => dueCards.value.length)

  const reviewedToday = computed(() => {
    const today = new Date().toISOString().split('T')[0]!
    let count = 0
    cards.value.forEach((card) => {
      if (card.lastReview?.toISOString().split('T')[0] === today) count++
    })
    return count
  })
  // #endregion

  // #region methods
  function getOrCreate(shortcutId: string): SM2Card {
    if (!cards.value.has(shortcutId)) {
      cards.value.set(shortcutId, {
        shortcutId,
        interval: 0,
        repetitions: 0,
        easeFactor: DEFAULT_EASE,
        nextReview: new Date(),
        lastReview: null
      })
    }
    return cards.value.get(shortcutId)!
  }

  /**
   * Record a review result.
   * @param correct - whether the answer was correct
   * @param attempts - how many attempts were needed (0 = first try)
   */
  function recordReview(shortcutId: string, correct: boolean, attempts: number = 0) {
    const card = getOrCreate(shortcutId)
    const quality = qualityFromResult(correct, attempts)
    const updated = sm2Update(card, quality)
    cards.value.set(shortcutId, updated)
    return updated
  }

  /**
   * Get shortcuts that are due for review, sorted by urgency.
   */
  function getDueShortcuts(shortcuts: Shortcut[], limit?: number): Shortcut[] {
    const dueIds = new Set(dueCards.value.map(c => c.shortcutId))
    const due = shortcuts.filter(s => dueIds.has(s.id))
    return limit ? due.slice(0, limit) : due
  }

  function getCard(shortcutId: string): SM2Card | null {
    return cards.value.get(shortcutId) ?? null
  }

  function getDaysUntilReview(shortcutId: string): number {
    const card = cards.value.get(shortcutId)
    if (!card) return 0
    const diff = card.nextReview.getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / 86400000))
  }

  function loadAll(cardList: SM2Card[]) {
    const map = new Map<string, SM2Card>()
    cardList.forEach((c) => {
      map.set(c.shortcutId, {
        ...c,
        nextReview: new Date(c.nextReview),
        lastReview: c.lastReview ? new Date(c.lastReview) : null
      })
    })
    cards.value = map
  }

  function getAllCards(): SM2Card[] {
    return Array.from(cards.value.values())
  }
  // #endregion

  return {
    cards: readonly(cards),
    dueCards,
    dueCount,
    reviewedToday,
    getOrCreate,
    recordReview,
    getDueShortcuts,
    getCard,
    getDaysUntilReview,
    loadAll,
    getAllCards
  }
}
