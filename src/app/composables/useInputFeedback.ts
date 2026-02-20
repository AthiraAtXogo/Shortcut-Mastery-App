// #region setup
interface FeedbackOptions {
  sound?: boolean
  haptic?: boolean
}

const MODIFIERS = new Set(['Ctrl', 'Cmd', 'Alt', 'Shift'])
// #endregion

export function useInputFeedback(options: FeedbackOptions = {}) {
  // #region state
  const soundEnabled = ref(options.sound ?? true)
  const hapticEnabled = ref(options.haptic ?? true)

  let audioCtx: AudioContext | null = null
  // #endregion

  // #region methods
  function getAudioCtx(): AudioContext | null {
    if (!import.meta.client) return null
    if (!audioCtx) audioCtx = new AudioContext()
    return audioCtx
  }

  function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', gain = 0.15) {
    const ctx = getAudioCtx()
    if (!ctx || !soundEnabled.value) return

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc.type = type
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)

    gainNode.gain.setValueAtTime(gain, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  }

  function vibrate(pattern: number | number[]) {
    if (!import.meta.client || !hapticEnabled.value) return
    if (navigator.vibrate) navigator.vibrate(pattern)
  }

  // Brief click for any key press
  function onKeyPress(key: string, element?: HTMLElement) {
    const isModifier = MODIFIERS.has(key)
    playTone(isModifier ? 300 : 440, 0.06, 'square', 0.08)
    vibrate(10)

    if (element) {
      element.classList.add('vk-feedback-press')
      setTimeout(() => element.classList.remove('vk-feedback-press'), 150)
    }
  }

  // Green flash for correct combo
  function onCorrect(element?: HTMLElement) {
    playTone(660, 0.12, 'sine', 0.2)
    setTimeout(() => playTone(880, 0.15, 'sine', 0.15), 100)
    vibrate([50, 30, 50])

    if (element) {
      element.classList.add('vk-feedback-correct')
      setTimeout(() => element.classList.remove('vk-feedback-correct'), 600)
    }
  }

  // Red shake for wrong combo
  function onWrong(element?: HTMLElement) {
    playTone(200, 0.18, 'sawtooth', 0.15)
    setTimeout(() => playTone(150, 0.2, 'sawtooth', 0.1), 100)
    vibrate([80, 40, 80])

    if (element) {
      element.classList.add('vk-feedback-wrong')
      setTimeout(() => element.classList.remove('vk-feedback-wrong'), 500)
    }
  }

  // Rising tone for combo milestone
  function onCombo(comboLevel: number) {
    const base = 440 + comboLevel * 40
    playTone(base, 0.1, 'sine', 0.18)
    setTimeout(() => playTone(base * 1.25, 0.12, 'sine', 0.14), 80)
    vibrate(20)
  }

  // Fanfare on streak milestone
  function onStreak(streakLevel: number) {
    if (streakLevel % 5 !== 0) return
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.15, 'sine', 0.2), i * 80)
    })
    vibrate([30, 20, 30, 20, 60])
  }
  // #endregion

  // #region lifecycle
  onUnmounted(() => {
    audioCtx?.close()
    audioCtx = null
  })
  // #endregion

  return {
    soundEnabled,
    hapticEnabled,
    onKeyPress,
    onCorrect,
    onWrong,
    onCombo,
    onStreak
  }
}
