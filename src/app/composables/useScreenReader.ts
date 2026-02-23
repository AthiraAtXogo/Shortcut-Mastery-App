/**
 * Screen reader support utilities.
 * - Live region announcer for dynamic content
 * - ARIA label helpers for game elements
 * - Focus management helpers
 */

export type LiveRegionPoliteness = 'polite' | 'assertive'

let liveRegion: HTMLElement | null = null
let assertiveRegion: HTMLElement | null = null

function createLiveRegion(politeness: LiveRegionPoliteness): HTMLElement {
  const el = document.createElement('div')
  el.setAttribute('role', 'status')
  el.setAttribute('aria-live', politeness)
  el.setAttribute('aria-atomic', 'true')
  el.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `
  document.body.appendChild(el)
  return el
}

function getRegion(politeness: LiveRegionPoliteness): HTMLElement {
  if (politeness === 'assertive') {
    if (!assertiveRegion) assertiveRegion = createLiveRegion('assertive')
    return assertiveRegion
  }
  if (!liveRegion) liveRegion = createLiveRegion('polite')
  return liveRegion
}

export function useScreenReader() {
  /**
   * Announce a message to screen readers.
   * @param message - text to announce
   * @param politeness - 'polite' (waits for idle) or 'assertive' (interrupts immediately)
   */
  function announce(message: string, politeness: LiveRegionPoliteness = 'polite'): void {
    if (!import.meta.client) return

    const region = getRegion(politeness)

    // Clear first so repeat announcements trigger again
    region.textContent = ''

    // Use setTimeout to ensure DOM update cycle fires the announcement
    setTimeout(() => {
      region.textContent = message
    }, 50)
  }

  /** Announce a correct answer result */
  function announceCorrect(shortcutName: string, score: number): void {
    announce(`Correct! ${shortcutName}. +${score} points.`, 'polite')
  }

  /** Announce a wrong answer result */
  function announceWrong(shortcutName: string, correctKeys: string): void {
    announce(`Incorrect. The answer for ${shortcutName} is ${correctKeys}.`, 'assertive')
  }

  /** Announce level up */
  function announceLevelUp(newLevel: number): void {
    announce(`Level up! You are now level ${newLevel}.`, 'assertive')
  }

  /** Announce achievement unlocked */
  function announceAchievement(achievementName: string): void {
    announce(`Achievement unlocked: ${achievementName}!`, 'polite')
  }

  /** Announce game over / session end */
  function announceGameEnd(score: number, accuracy: number): void {
    announce(
      `Game over. Final score: ${score}. Accuracy: ${Math.round(accuracy)}%.`,
      'polite'
    )
  }

  /**
   * Build an ARIA label for a keyboard shortcut display.
   * e.g. ['Ctrl', 'S'] → "Control plus S"
   */
  function shortcutAriaLabel(keys: string[]): string {
    const KEY_NAMES: Record<string, string> = {
      Ctrl: 'Control',
      Cmd: 'Command',
      Alt: 'Alt',
      Shift: 'Shift',
      Meta: 'Meta',
      Enter: 'Enter',
      Escape: 'Escape',
      Tab: 'Tab',
      Space: 'Space',
      Backspace: 'Backspace',
      Delete: 'Delete',
      Up: 'Up Arrow',
      Down: 'Down Arrow',
      Left: 'Left Arrow',
      Right: 'Right Arrow'
    }
    return keys.map(k => KEY_NAMES[k] ?? k).join(' plus ')
  }

  /**
   * Move focus to an element by ref or selector.
   * Useful after dialogs open or game state changes.
   */
  function focusElement(target: HTMLElement | string): void {
    if (!import.meta.client) return

    const el = typeof target === 'string'
      ? (document.querySelector(target) as HTMLElement | null)
      : target

    if (el) {
      el.focus({ preventScroll: false })
    }
  }

  /** Trap focus within a container (for modals/dialogs) */
  function trapFocus(container: HTMLElement): () => void {
    const FOCUSABLE = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',')

    function handleKeydown(e: KeyboardEvent): void {
      if (e.key !== 'Tab') return

      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (focusable.length === 0) return

      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', handleKeydown)
    return () => container.removeEventListener('keydown', handleKeydown)
  }

  return {
    announce,
    announceCorrect,
    announceWrong,
    announceLevelUp,
    announceAchievement,
    announceGameEnd,
    shortcutAriaLabel,
    focusElement,
    trapFocus
  }
}
