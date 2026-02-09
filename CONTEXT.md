
# Project Context

## Overview

**Shortcut Mastery App** — A premium gamified keyboard shortcut learning application with immersive 3D visuals, satisfying animations, and addictive gameplay mechanics.

## Project Structure

- **Source code**: `src/` (Nuxt 4 app)
- **Tests**: `tests/` (Vitest + Playwright)
- **Config files**: `nuxt.config.ts`, `tailwind.config.ts`
- **Generated artifacts**: `.output/`, `.nuxt/`

## Language & Tooling

- **Language**: TypeScript
- **Framework**: Nuxt 4 + Vue 3
- **UI**: Nuxt UI + Custom components
- **Styling**: Tailwind CSS + CSS Variables
- **2D Animation**: GSAP (GreenSock)
- **3D Graphics**: Three.js + @tresjs/core (Vue wrapper)
- **Audio**: Howler.js
- **Storage**: IndexedDB (Dexie.js wrapper)
- **PWA**: @vite-pwa/nuxt
- **Icons**: Iconify
- **Package manager**: pnpm

## Build & Test Entry Points

- Dev: `pnpm dev`
- Build: `pnpm build`
- Test: `pnpm test`
- Lint: `pnpm lint`

## Task Management

Tasks are stored under `Tasks/{FeatureName}/` with numbered task files.
See `.claude/commands/brain.md` for the BRAIN workflow.

---

## Visual Design System

### Theme & Colors

```
Background:     Deep dark (#0a0a0f) with neural network
Primary:        Electric blue (#00d4ff)
Secondary:      Neon purple (#a855f7)
Success:        Lime green (#84cc16)
Error:          Hot pink (#f43f5e)
Accent:         Orange spark (#f97316)
```

### Three.js Effects

| Effect | Where | Description |
|--------|-------|-------------|
| Neural Background | Global | Connected nodes, energy pulses on correct |
| Aurora Trails | Streak indicator | Flowing color ribbons |
| 3D Keyboard | Home, game | Floating keyboard, keys illuminate |
| Explosion Shards | Correct answer | Geometric shards burst outward |
| Portal Vortex | Level up | Swirling energy tunnel |
| Combo Chain | Multi-combo | Energy connects recent answers |
| Boss Avatar | Boss battle | 3D app icon (VS Code, etc.) |
| Floating Icons | Category select | App logos orbiting in 3D |

### GSAP Animations

| Animation | Where | Effect |
|-----------|-------|--------|
| Magnetic Cursor | Interactive elements | Subtle pull toward mouse |
| Text Scramble | Scores, timers | Letters scramble then reveal |
| Elastic Bounce | Buttons, cards | Satisfying overshoot |
| Stagger Cascade | Lists, menus | Ripple sequence |
| Flip Cards | Memory Match | 3D card flip |
| Shake & Flash | Wrong answer | Screen shake + red flash |
| Confetti Burst | Achievements | Particles spray |
| Counter Roll | XP, scores | Slot machine roll |
| Draw On | Progress bars | Line draws itself |

### Card Design

- Holographic shimmer on hover
- Magnetic distortion (warps toward cursor)
- Plasma animated borders
- 3D tilt effect following mouse

---

## Game Modes (12)

| Mode | Description | Difficulty |
|------|-------------|------------|
| Practice | No pressure learning | Easy |
| Flash Round | Single shortcut, 3 sec timer | Easy |
| Speed Run | 10 shortcuts, fastest time | Medium |
| Survival | Until 3 mistakes | Medium |
| Time Attack | How many in 60 seconds | Medium |
| Daily Challenge | 5 curated daily | Medium |
| Rhythm Mode | Beat-synced falling shortcuts | Medium |
| Memory Match | Flip and match pairs | Medium |
| Type Mode | Type shortcut letter by letter | Medium |
| Blind Mode | No visual keyboard | Hard |
| Boss Battle | Execute combo chains | Hard |
| Endless | Infinite, scaling difficulty | Variable |

---

## App Categories

| Category | Apps Covered |
|----------|--------------|
| OS | Windows, macOS |
| Browsers | Chrome, Edge, Firefox |
| Code Editors | VS Code, Cursor, JetBrains |
| AI Tools | Claude, ChatGPT, Copilot |
| Productivity | Notion, Slack, Discord, Figma |

---

## Gamification Features

| Feature | Description |
|---------|-------------|
| XP & Levels | 1-100 levels, unlock content |
| Streaks | Daily streaks with multiplier |
| Achievements | 50+ badges |
| Combo System | Chain answers for multiplier |
| Mastery Levels | New → Learning → Familiar → Master |
| Spaced Repetition | Weak shortcuts appear more |

---

## Learning Features

| Feature | Description |
|---------|-------------|
| Shortcut Stories | Memory tricks: "C = Copy" |
| Context GIFs | 5-sec demo in real app |
| Cheat Sheet Export | Generate PDF |
| Weakness Analysis | Identify struggle areas |
| Learning Paths | Suggested order |

---

## Social Features (Phase 2)

| Feature | Description |
|---------|-------------|
| Share Score | Shareable image |
| Challenge Link | Send to friend |
| Weekly Tournament | Compete globally |

---

## Accessibility

| Feature | Description |
|---------|-------------|
| Reduced Motion | Disable intense animations |
| High Contrast | Better visibility |
| Colorblind Modes | Multiple options |
| Screen Reader | Full ARIA support |
| Custom Timing | Adjust time limits |

---

## Constraints

- Must work fully offline (PWA)
- No backend required (IndexedDB)
- Desktop-first, mobile-friendly
- Keyboard accessible throughout
- Real keyboard input for shortcuts
- Smooth 60fps animations
- Fun and engaging — not boring flashcards
