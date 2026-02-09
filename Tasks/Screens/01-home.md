# Task: Home Screen

## Objective

Create the main hub screen with navigation to all app features.

## Requirements

- [ ] App title with animation
- [ ] 3D keyboard hero element
- [ ] Main action buttons (Quick Play, Arcade, Learn)
- [ ] Stats bar (streak, level, XP)
- [ ] Daily challenge prompt
- [ ] Quick access to achievements
- [ ] Neural network background

## Layout

```
┌─────────────────────────────────────────────────────┐
│  [Neural network background - always animating]     │
│                                                     │
│              ╔═══════════════════════════╗          │
│              ║   ⌨️ SHORTCUT MASTERY     ║          │
│              ║   [Text scramble reveal]   ║          │
│              ╚═══════════════════════════╝          │
│                                                     │
│         [3D Floating Keyboard - aurora glow]        │
│              Keys randomly illuminate               │
│              Tilts slightly with mouse              │
│                                                     │
│    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│    │ ⚡ QUICK     │ │ 🎮 ARCADE    │ │ 📚 LEARN     │
│    │    PLAY      │ │    MODE      │ │    MODE      │
│    │ [Holo card]  │ │ [Holo card]  │ │ [Holo card]  │
│    └──────────────┘ └──────────────┘ └──────────────┘
│                                                     │
│    ┌─────────────────────────────────────────────┐  │
│    │ 🔥 7 Day     │ ⭐ Level 12  │ 🏆 847 XP        │
│    │ [Fire anim]  │ [Glow pulse] │ [Counter roll]   │
│    └─────────────────────────────────────────────┘  │
│                                                     │
│    [🎯 Daily Challenge]    [🏅 Achievements]        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Component Breakdown

```vue
<template>
  <div class="home-screen">
    <!-- 3D Background -->
    <NeuralBackground />

    <!-- Title -->
    <header class="home-screen__header">
      <TextScramble text="SHORTCUT MASTERY" :trigger="mounted" />
    </header>

    <!-- Hero 3D Keyboard -->
    <Keyboard3D class="home-screen__hero" />

    <!-- Main Actions -->
    <nav class="home-screen__actions">
      <HoloCard @click="startQuickPlay">
        <span class="icon">⚡</span>
        <span>Quick Play</span>
      </HoloCard>
      <HoloCard @click="goToArcade">
        <span class="icon">🎮</span>
        <span>Arcade Mode</span>
      </HoloCard>
      <HoloCard @click="goToLearn">
        <span class="icon">📚</span>
        <span>Learn Mode</span>
      </HoloCard>
    </nav>

    <!-- Stats Bar -->
    <StatsBar
      :streak="userStore.currentStreak"
      :level="userStore.level"
      :xp="userStore.xp"
    />

    <!-- Secondary Actions -->
    <footer class="home-screen__footer">
      <GameButton variant="secondary" @click="goToDailyChallenge">
        🎯 Daily Challenge
      </GameButton>
      <GameButton variant="ghost" @click="goToAchievements">
        🏅 Achievements
      </GameButton>
    </footer>
  </div>
</template>
```

## Animations on Mount

1. Background fades in
2. Title scrambles and reveals
3. 3D keyboard floats up
4. Action cards stagger in
5. Stats bar slides up
6. Footer buttons fade in

## Acceptance Criteria

- All elements render correctly
- Animations play on mount
- Navigation works to all screens
- Stats display current values
- 3D keyboard interactive
- Responsive layout
