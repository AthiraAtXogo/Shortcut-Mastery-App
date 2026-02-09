# Task: Game Screen

## Objective

Create the main gameplay screen that adapts to different game modes.

## Requirements

- [ ] Display current shortcut challenge
- [ ] Timer/progress indicator
- [ ] Visual keyboard
- [ ] Score and combo display
- [ ] Mode-specific UI elements
- [ ] Feedback animations

## Layout (Speed Run Example)

```
┌─────────────────────────────────────────────────────┐
│  [Aurora waves background]                          │
│                                                     │
│  SPEED RUN     ⏱️ 00:23.45 [scramble]      3/10    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ [draw-on progress]  │
│                                                     │
│         ┌─────────────────────────────────┐         │
│         │   [Holographic card - tilts]    │         │
│         │                                 │         │
│         │      🔍 FIND IN FILE            │         │
│         │                                 │         │
│         │      VS Code                    │         │
│         │   [Plasma border animating]     │         │
│         └─────────────────────────────────┘         │
│                                                     │
│         [Visual Keyboard - keys illuminate]         │
│         ┌─────────────────────────────────────┐     │
│         │  [Ctrl] ✨  [Shift] ✨  [F] ⏳      │     │
│         │  [Shows key states in real-time]    │     │
│         └─────────────────────────────────────┘     │
│                                                     │
│    🔥🔥🔥 x3 COMBO           Score: 2,450          │
│                                                     │
│                              [Pause Button]         │
└─────────────────────────────────────────────────────┘
```

## Component Structure

```vue
<template>
  <div class="game-screen" :class="`game-screen--${mode}`">
    <!-- Background -->
    <AuroraTrails v-if="gameStore.combo >= 3" :streak="gameStore.combo" />
    <NeuralBackground :intensity="backgroundIntensity" />

    <!-- Header -->
    <GameHeader
      :mode="mode"
      :timer="gameStore.timeRemaining"
      :progress="gameStore.progress"
      :total="gameStore.total"
    />

    <!-- Challenge Card -->
    <HoloCard class="game-screen__challenge">
      <ShortcutChallenge
        :action="currentShortcut.action"
        :app="currentShortcut.app"
        :hint="showHint ? currentShortcut.hint : undefined"
      />
    </HoloCard>

    <!-- Keyboard -->
    <VisualKeyboard
      :pressed-keys="pressedKeys"
      :expected-keys="expectedKeys"
      :correct-keys="correctKeys"
      :wrong-keys="wrongKeys"
    />

    <!-- Footer -->
    <GameFooter
      :combo="gameStore.combo"
      :score="gameStore.score"
      :lives="gameStore.lives"
    />

    <!-- Overlays -->
    <ExplosionShards ref="explosion" />
    <FeedbackPopup ref="feedback" />
    <PauseMenu v-if="isPaused" @resume="resume" @quit="quit" />
  </div>
</template>
```

## Mode Variations

| Mode | Timer | Lives | Progress | Special UI |
|------|-------|-------|----------|------------|
| Practice | None | None | Count | Hint button |
| Flash | Countdown | None | Streak | - |
| Speed Run | Count up | None | X/10 | Personal best |
| Survival | None | 3 hearts | Streak | - |
| Time Attack | 60s countdown | None | Count | - |
| Boss Battle | Combo timer | Hearts | Boss HP | Boss avatar |

## Event Handlers

```typescript
const onCorrectAnswer = async () => {
  // Visual feedback
  explosion.value.trigger({ color: comboColor })
  feedback.value.show('correct')

  // Audio
  audio.play('correct')

  // Update state
  gameStore.onCorrect()

  // Check achievements
  await achievements.check()
}

const onWrongAnswer = async () => {
  // Visual feedback
  shakeAndFlash(gameScreen.value)
  feedback.value.show('wrong')

  // Audio
  audio.play('wrong')

  // Update state
  gameStore.onWrong()
}
```

## Acceptance Criteria

- Adapts to all game modes
- Keyboard input captured
- Visual feedback immediate
- Animations smooth
- Pause/resume works
- Mode-specific UI correct
