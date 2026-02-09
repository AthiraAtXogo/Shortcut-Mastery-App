import { Howl, Howler } from 'howler'

// Sound registry - persists across component lifecycles
const sounds = new Map<string, Howl>()

// Sound effect types for the game
export type SoundEffect =
  | 'keyPress'
  | 'correct'
  | 'wrong'
  | 'combo'
  | 'levelUp'
  | 'gameStart'
  | 'gameOver'
  | 'tick'
  | 'achievement'

export function useAudio() {
  const isMuted = useState('audio-muted', () => false)
  const volume = useState('audio-volume', () => 0.7)
  const sfxVolume = useState('audio-sfx-volume', () => 0.8)

  /**
   * Preload a sound for later playback
   */
  function preload(name: string, src: string | string[], options?: Partial<Howl>) {
    if (sounds.has(name)) return sounds.get(name)!

    const sound = new Howl({
      src: Array.isArray(src) ? src : [src],
      volume: sfxVolume.value,
      preload: true,
      ...options
    })

    sounds.set(name, sound)
    return sound
  }

  /**
   * Play a preloaded sound
   */
  function play(name: string, options?: { volume?: number; rate?: number }) {
    if (isMuted.value) return

    const sound = sounds.get(name)
    if (!sound) {
      console.warn(`Sound "${name}" not found. Preload it first.`)
      return
    }

    const id = sound.play()

    if (options?.volume !== undefined) {
      sound.volume(options.volume, id)
    }
    if (options?.rate !== undefined) {
      sound.rate(options.rate, id)
    }

    return id
  }

  /**
   * Stop a specific sound or all sounds
   */
  function stop(name?: string) {
    if (name) {
      sounds.get(name)?.stop()
    } else {
      sounds.forEach((sound) => sound.stop())
    }
  }

  /**
   * Toggle mute state
   */
  function toggleMute() {
    isMuted.value = !isMuted.value
    Howler.mute(isMuted.value)
  }

  /**
   * Set master volume (0-1)
   */
  function setVolume(v: number) {
    volume.value = Math.max(0, Math.min(1, v))
    Howler.volume(volume.value)
  }

  /**
   * Set SFX volume (0-1)
   */
  function setSfxVolume(v: number) {
    sfxVolume.value = Math.max(0, Math.min(1, v))
    sounds.forEach((sound) => sound.volume(sfxVolume.value))
  }

  /**
   * Preload all game sounds
   */
  function preloadGameSounds() {
    // These paths assume sounds will be in public/sounds/
    // You can replace with actual sound files later
    const gameSounds: Record<SoundEffect, string> = {
      keyPress: '/sounds/key-press.mp3',
      correct: '/sounds/correct.mp3',
      wrong: '/sounds/wrong.mp3',
      combo: '/sounds/combo.mp3',
      levelUp: '/sounds/level-up.mp3',
      gameStart: '/sounds/game-start.mp3',
      gameOver: '/sounds/game-over.mp3',
      tick: '/sounds/tick.mp3',
      achievement: '/sounds/achievement.mp3'
    }

    Object.entries(gameSounds).forEach(([name, src]) => {
      preload(name, src)
    })
  }

  /**
   * Play a game sound effect
   */
  function playSfx(effect: SoundEffect, options?: { volume?: number; rate?: number }) {
    return play(effect, options)
  }

  /**
   * Unload all sounds (cleanup)
   */
  function unloadAll() {
    sounds.forEach((sound) => sound.unload())
    sounds.clear()
  }

  return {
    isMuted: readonly(isMuted),
    volume: readonly(volume),
    sfxVolume: readonly(sfxVolume),
    preload,
    play,
    stop,
    toggleMute,
    setVolume,
    setSfxVolume,
    preloadGameSounds,
    playSfx,
    unloadAll
  }
}
