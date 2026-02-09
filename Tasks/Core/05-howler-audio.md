# Task: Audio System with Howler.js

## Objective

Set up Howler.js for satisfying sound effects and audio feedback.

## Requirements

- [ ] Install Howler.js
- [ ] Create audio manager composable
- [ ] Preload all sound effects
- [ ] Support mute/volume controls
- [ ] Handle audio context unlock (user interaction)
- [ ] Add sound effect files

## Technical Details

### Dependencies

```bash
pnpm add howler
pnpm add -D @types/howler
```

### Sound Effects Needed

| Sound | Trigger | File |
|-------|---------|------|
| correct | Correct answer | correct.mp3 |
| wrong | Wrong answer | wrong.mp3 |
| combo | Combo continues | combo.mp3 |
| levelUp | Level up | level-up.mp3 |
| achievement | Badge unlocked | achievement.mp3 |
| tick | Timer tick | tick.mp3 |
| click | Button click | click.mp3 |
| whoosh | Page transition | whoosh.mp3 |
| streak | Streak milestone | streak.mp3 |

### Composable: useAudio.ts

```typescript
import { Howl } from 'howler'

export function useAudio() {
  const sounds = {
    correct: new Howl({ src: ['/sounds/correct.mp3'] }),
    wrong: new Howl({ src: ['/sounds/wrong.mp3'] }),
    // ...
  }

  const play = (name: keyof typeof sounds) => {
    if (!isMuted.value) {
      sounds[name].play()
    }
  }

  const setVolume = (level: number) => { /* ... */ }
  const toggleMute = () => { /* ... */ }

  return { play, setVolume, toggleMute, isMuted }
}
```

## Acceptance Criteria

- All sounds load without errors
- Sounds play on correct triggers
- Mute toggle works
- Volume slider works
- No audio errors on mobile
- Sounds cached offline

## Notes

Audio is critical for the satisfying "game feel". Use short, punchy sounds.
