# ThreeJS - Feature Context

## Purpose

Create immersive 3D effects using Three.js and TresJS including the neural network background, 3D keyboard, particle explosions, and portal effects.

## Dependencies

- Core/04-threejs-tresjs (TresJS setup)
- Design/01-design-tokens (colors)

## Tasks Overview

| Task | Description | Priority |
|------|-------------|----------|
| 01-neural-background | Connected nodes with energy pulses | P0 |
| 02-aurora-trails | Flowing color ribbons for streaks | P1 |
| 03-3d-keyboard | Floating keyboard with illuminating keys | P0 |
| 04-explosion-shards | Geometric burst on correct answers | P1 |
| 05-portal-vortex | Swirling tunnel for level ups | P2 |
| 06-combo-chains | Energy connecting combo answers | P2 |
| 07-boss-avatars | 3D app icons for boss battles | P2 |
| 08-floating-icons | Orbiting app logos for categories | P2 |

## Technical Constraints

- Target 60fps on mid-range devices
- Graceful degradation on low-end devices
- Dispose all materials/geometries on unmount
- Use instanced meshes where possible
- Reduce particle counts on mobile
