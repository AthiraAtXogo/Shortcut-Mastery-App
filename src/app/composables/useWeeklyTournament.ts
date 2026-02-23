/**
 * Local weekly tournament — no backend required.
 * Scores stored in IndexedDB via useDatabase.
 * Resets every Monday at midnight.
 */

export interface TournamentEntry {
  id: string // UUID
  playerName: string
  score: number
  accuracy: number // 0–100
  mode: string
  app: string
  grade: string
  weekKey: string // YYYY-WW
  timestamp: number
}

export interface TournamentStanding {
  rank: number
  entry: TournamentEntry
  isCurrentPlayer: boolean
}

/** Get ISO week key e.g. "2025-W04" */
function getWeekKey(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

const STORAGE_KEY = 'tournament-entries'
const PLAYER_KEY = 'tournament-player-id'

export function useWeeklyTournament() {
  // #region state
  const entries = ref<TournamentEntry[]>([])
  const currentWeekKey = ref(getWeekKey())
  const playerId = ref<string>('')
  const isLoaded = ref(false)
  // #endregion

  // #region computed
  const currentWeekEntries = computed(() =>
    entries.value.filter(e => e.weekKey === currentWeekKey.value)
  )

  const standings = computed((): TournamentStanding[] => {
    const sorted = [...currentWeekEntries.value].sort((a, b) => b.score - a.score)
    return sorted.map((entry, i) => ({
      rank: i + 1,
      entry,
      isCurrentPlayer: entry.id.startsWith(playerId.value)
    }))
  })

  const myBestThisWeek = computed(() =>
    currentWeekEntries.value
      .filter(e => e.id.startsWith(playerId.value))
      .sort((a, b) => b.score - a.score)[0] ?? null
  )

  const myRank = computed(() => {
    const standing = standings.value.find(s => s.isCurrentPlayer)
    return standing?.rank ?? null
  })

  const topThree = computed(() => standings.value.slice(0, 3))

  const isWeekOver = computed(() => {
    const now = new Date()
    const key = getWeekKey(now)
    return key !== currentWeekKey.value
  })
  // #endregion

  // #region methods
  function load(): void {
    if (!import.meta.client) return

    // Load or generate player ID
    const stored = localStorage.getItem(PLAYER_KEY)
    if (stored) {
      playerId.value = stored
    } else {
      const newId = generateId()
      playerId.value = newId
      localStorage.setItem(PLAYER_KEY, newId)
    }

    // Load entries
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as TournamentEntry[]
        // Prune entries older than 2 weeks
        const twoWeeksAgo = getWeekKey(new Date(Date.now() - 14 * 86400000))
        entries.value = parsed.filter(e => e.weekKey >= twoWeeksAgo)
      } catch {
        entries.value = []
      }
    }

    currentWeekKey.value = getWeekKey()
    isLoaded.value = true
  }

  function save(): void {
    if (!import.meta.client) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.value))
  }

  function submitScore(
    playerName: string,
    score: number,
    accuracy: number,
    mode: string,
    app: string,
    grade: string
  ): TournamentEntry {
    const entry: TournamentEntry = {
      id: `${playerId.value}-${generateId()}`,
      playerName,
      score,
      accuracy,
      mode,
      app,
      grade,
      weekKey: getWeekKey(),
      timestamp: Date.now()
    }

    entries.value.push(entry)
    save()
    return entry
  }

  function setPlayerName(name: string): void {
    if (!import.meta.client) return
    localStorage.setItem('tournament-player-name', name)
  }

  function getPlayerName(): string {
    if (!import.meta.client) return 'Player'
    return localStorage.getItem('tournament-player-name') ?? 'Player'
  }

  function clearOldWeeks(): void {
    const currentKey = getWeekKey()
    entries.value = entries.value.filter(e => e.weekKey === currentKey)
    save()
  }
  // #endregion

  return {
    entries: readonly(entries),
    currentWeekKey: readonly(currentWeekKey),
    playerId: readonly(playerId),
    isLoaded: readonly(isLoaded),
    currentWeekEntries,
    standings,
    myBestThisWeek,
    myRank,
    topThree,
    isWeekOver,
    load,
    submitScore,
    setPlayerName,
    getPlayerName,
    clearOldWeeks
  }
}
