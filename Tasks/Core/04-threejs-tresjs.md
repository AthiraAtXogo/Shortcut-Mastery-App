# Task: Three.js with TresJS Setup

## Objective

Set up Three.js using TresJS (Vue 3 wrapper) for 3D graphics and effects.

## Requirements

- [ ] Install TresJS and dependencies
- [ ] Create base 3D scene component
- [ ] Configure renderer settings
- [ ] Set up post-processing (bloom, etc.)
- [ ] Create composable for Three.js utilities
- [ ] Optimize for performance

## Technical Details

### Dependencies

```bash
pnpm add @tresjs/core @tresjs/cientos three
pnpm add -D @types/three
```

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  modules: ['@tresjs/nuxt']
})
```

### Base Scene Component

```vue
<template>
  <TresCanvas>
    <TresPerspectiveCamera :position="[0, 0, 5]" />
    <slot />
  </TresCanvas>
</template>
```

### Composable: useThree.ts

```typescript
export function useThree() {
  const createParticleSystem = () => { /* ... */ }
  const createGlowMaterial = () => { /* ... */ }
  const animateExplosion = () => { /* ... */ }

  return { createParticleSystem, createGlowMaterial, animateExplosion }
}
```

### Performance Settings

- Use `antialias: true` only on desktop
- Limit particle count on mobile
- Use `powerPreference: 'high-performance'`
- Dispose materials/geometries on unmount

## Acceptance Criteria

- TresJS canvas renders
- Camera and lighting work
- No WebGL errors in console
- Smooth 60fps on target devices
- Proper cleanup on component unmount

## Notes

Three.js handles neural background, 3D keyboard, explosions, and portal effects.
