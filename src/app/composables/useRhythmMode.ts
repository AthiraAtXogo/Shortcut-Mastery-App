import type { Shortcut } from '~/types/shortcut'
import { ALL_SHORTCUTS } from '~/data/shortcuts'

export interface RhythmBeat {
  shortcut: Shortcut
  beatIndex: number
  hit: boolean | null // null = pending, true = hit, false = missed
}

/** Rhythm mode: shortcuts arrive on a beat, press in time for bonus */
export function useRhythmMode() {
  // #region state
  const beats = ref<RhythmBeat[]>([])
  const currentBeat = ref(0)
  const bpm = ref(60) // beats per minute
  const score = ref(0)
  const streak = ref(0)
  const isRunning = ref(false)
  const beatProgress = ref(0) // 0-100 within current beat window
  let beatTimer: ReturnType<typeof setInterval> | null = null
  let progressTimer: ReturnType<typeof setInterval> | null = null
  // #endregion

  // #region computed
  const currentShortcut = computed<Shortcut | null>(
    () => beats.value[currentBeat.value]?.shortcut ?? null
  )

  const beatMs = computed(() => Math.round(60_000 / bpm.value))
  // #endregion

  // #region methods
  function buildBeats(count: number, app?: string): RhythmBeat[] {
    let pool = [...ALL_SHORTCUTS]
    if (app) pool = pool.filter(s => s.app === app)
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    return pool.slice(0, count).map((s, i) => ({
      shortcut: s,
      beatIndex: i,
      hit: null
    }))
  }

  function clearTimers() {
    if (beatTimer) clearInterval(beatTimer)
    if (progressTimer) clearInterval(progressTimer)
    beatTimer = null
    progressTimer = null
  }

  function advanceBeat() {
    if (currentBeat.value >= beats.value.length - 1) {
      clearTimers()
      isRunning.value = false
      return
    }

    // Mark current beat as missed if not hit
    const beat = beats.value[currentBeat.value]
    if (beat && beat.hit === null) {
      beat.hit = false
      streak.value = 0
    }

    currentBeat.value++
    beatProgress.value = 0
  }

  function start(app?: string, beatCount = 20, targetBpm = 60) {
    clearTimers()
    bpm.value = targetBpm
    beats.value = buildBeats(beatCount, app)
    currentBeat.value = 0
    score.value = 0
    streak.value = 0
    beatProgress.value = 0
    isRunning.value = true

    beatTimer = setInterval(advanceBeat, beatMs.value)
    progressTimer = setInterval(() => {
      beatProgress.value = Math.min(100, beatProgress.value + (100 / (beatMs.value / 50)))
    }, 50)
  }

  function submitAnswer(pressedKeys: string[]): boolean {
    const beat = beats.value[currentBeat.value]
    if (!beat || beat.hit !== null || !isRunning.value) return false

    const shortcut = beat.shortcut
    const held = pressedKeys.map(k => k.toLowerCase()).sort()
    const expected = shortcut.keys.map(k => k.toLowerCase()).sort()
    const isCorrect = held.length === expected.length
      && held.every((k, i) => k === expected[i])

    if (isCorrect) {
      beat.hit = true
      streak.value++
      // Bonus for hitting in the sweet spot (50-80% of beat window)
      const inRhythm = beatProgress.value >= 40 && beatProgress.value <= 90
      score.value += inRhythm ? 200 + streak.value * 10 : 100
    } else if (held.length >= expected.length) {
      beat.hit = false
      streak.value = 0
    }

    return isCorrect
  }

  function stop() {
    clearTimers()
    isRunning.value = false
  }

  function reset() {
    clearTimers()
    beats.value = []
    currentBeat.value = 0
    score.value = 0
    streak.value = 0
    beatProgress.value = 0
    isRunning.value = false
  }
  // #endregion

  onUnmounted(() => clearTimers())

  return {
    beats: readonly(beats),
    currentBeat: readonly(currentBeat),
    currentShortcut,
    bpm: readonly(bpm),
    score: readonly(score),
    streak: readonly(streak),
    isRunning: readonly(isRunning),
    beatProgress: readonly(beatProgress),
    start,
    submitAnswer,
    stop,
    reset
  }
}
