# Screens - Feature Context

## Purpose

Build all the main screens/pages of the application with consistent design and smooth transitions.

## Dependencies

- Design (all tasks)
- GSAP (for transitions)
- ThreeJS (for backgrounds)

## Tasks Overview

| Task | Description | Priority |
|------|-------------|----------|
| 01-home | Main menu and hub | P0 |
| 02-game-screen | Active gameplay screen | P0 |
| 03-results | Post-game results | P0 |
| 04-category-select | Choose app categories | P0 |
| 05-progress-dashboard | Stats and progress | P1 |
| 06-achievements-gallery | View all achievements | P1 |
| 07-settings | App preferences | P1 |
| 08-profile | User stats and history | P2 |

## Screen Flow

```
Home
├── Quick Play → Game → Results → Home
├── Arcade Mode → Category Select → Game → Results
├── Learn Mode → Practice → Home
├── Dashboard → (view only)
├── Achievements → (view only)
├── Settings → (modify)
└── Profile → (view only)
```

## Transition Guidelines

- Use GSAP for smooth page transitions
- Maintain 3D background across screens
- Stagger element animations on entry
- Keep transitions under 400ms
