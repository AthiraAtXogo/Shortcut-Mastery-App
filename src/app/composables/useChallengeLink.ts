/**
 * Challenge link encoding — share a specific shortcut challenge
 * with friends via a URL. No backend required.
 */

import type { GameMode } from '~/types'

export interface ChallengeConfig {
  mode: GameMode
  app: string
  seed?: string // For reproducible shortcut ordering
  difficulty?: 'easy' | 'medium' | 'hard'
  category?: string
  count?: number // How many shortcuts in the challenge
  challengerScore?: number
  challengerGrade?: string
}

export interface DecodedChallenge extends ChallengeConfig {
  isValid: boolean
  expiresAt?: Date
}

const CHALLENGE_PARAM = 'challenge'
const VERSION = '1'

function encodeSeed(): string {
  return Date.now().toString(36)
}

export function useChallengeLink() {
  /**
   * Generate a shareable challenge URL.
   * Encodes all config as base64 query params — no server needed.
   */
  function generateLink(config: ChallengeConfig, baseUrl?: string): string {
    const payload: Record<string, string | number> = {
      v: VERSION,
      mode: config.mode,
      app: config.app,
      seed: config.seed ?? encodeSeed()
    }

    if (config.difficulty) payload.diff = config.difficulty
    if (config.category) payload.cat = config.category
    if (config.count) payload.n = config.count
    if (config.challengerScore !== undefined) payload.cs = config.challengerScore
    if (config.challengerGrade) payload.cg = config.challengerGrade

    const encoded = import.meta.client
      ? btoa(JSON.stringify(payload))
      : Buffer.from(JSON.stringify(payload)).toString('base64')

    const base = baseUrl ?? (import.meta.client ? window.location.origin : 'https://shortcutmastery.app')
    return `${base}/game?${CHALLENGE_PARAM}=${encoded}`
  }

  /**
   * Decode a challenge from the current URL or a given URL string.
   */
  function decodeLink(url?: string): DecodedChallenge | null {
    try {
      const searchStr = url
        ? new URL(url).search
        : (import.meta.client ? window.location.search : '')

      const params = new URLSearchParams(searchStr)
      const encoded = params.get(CHALLENGE_PARAM)
      if (!encoded) return null

      const decoded = import.meta.client
        ? atob(encoded)
        : Buffer.from(encoded, 'base64').toString()

      const payload = JSON.parse(decoded) as Record<string, string | number>

      if (payload['v'] !== VERSION) {
        return { isValid: false, mode: 'practice', app: 'vscode' }
      }

      return {
        isValid: true,
        mode: (payload['mode'] as GameMode) ?? 'practice',
        app: (payload['app'] as string) ?? 'vscode',
        seed: payload['seed'] as string | undefined,
        difficulty: payload['diff'] as 'easy' | 'medium' | 'hard' | undefined,
        category: payload['cat'] as string | undefined,
        count: payload['n'] ? Number(payload['n']) : undefined,
        challengerScore: payload['cs'] ? Number(payload['cs']) : undefined,
        challengerGrade: payload['cg'] as string | undefined
      }
    } catch {
      return null
    }
  }

  /**
   * Copy challenge link to clipboard. Returns true on success.
   */
  async function copyToClipboard(config: ChallengeConfig): Promise<boolean> {
    if (!import.meta.client) return false
    const link = generateLink(config)
    try {
      await navigator.clipboard.writeText(link)
      return true
    } catch {
      return false
    }
  }

  /**
   * Share via Web Share API or clipboard fallback.
   */
  async function shareChallenge(
    config: ChallengeConfig,
    title = 'Beat my Shortcut Mastery score!'
  ): Promise<void> {
    if (!import.meta.client) return

    const link = generateLink(config)
    const text = config.challengerScore
      ? `I scored ${config.challengerScore.toLocaleString()} in ${config.mode} mode. Can you beat it?`
      : `Try this keyboard shortcut challenge!`

    if (navigator.share) {
      await navigator.share({ title, text, url: link })
    } else {
      await navigator.clipboard.writeText(link)
    }
  }

  /** Check if the current page URL contains a challenge param */
  function hasChallenge(): boolean {
    if (!import.meta.client) return false
    return new URLSearchParams(window.location.search).has(CHALLENGE_PARAM)
  }

  return { generateLink, decodeLink, copyToClipboard, shareChallenge, hasChallenge }
}
