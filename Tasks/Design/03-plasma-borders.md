# Task: Plasma Borders

## Objective

Create animated gradient borders that flow around elements continuously.

## Requirements

- [ ] Create PlasmaBorder.vue component
- [ ] Implement flowing gradient animation
- [ ] Support different border widths
- [ ] Support custom gradient colors
- [ ] Optimize for performance (CSS only where possible)
- [ ] Support reduced motion

## Technical Details

### Animation Concept

A gradient that rotates around the element's border, creating a flowing plasma effect.

### Implementation

```vue
<template>
  <div class="plasma-border" :class="{ 'plasma-border--animated': !prefersReducedMotion }">
    <div class="plasma-border__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.plasma-border {
  position: relative;
  padding: 2px;
  border-radius: 16px;
  background: linear-gradient(
    var(--plasma-angle, 0deg),
    var(--primary-500),
    var(--secondary-500),
    var(--accent-500),
    var(--primary-500)
  );
}

.plasma-border--animated {
  animation: plasma-rotate 3s linear infinite;
}

.plasma-border__content {
  background: var(--bg-secondary);
  border-radius: 14px;
  height: 100%;
}

@keyframes plasma-rotate {
  from {
    --plasma-angle: 0deg;
  }
  to {
    --plasma-angle: 360deg;
  }
}

/* Register custom property for animation */
@property --plasma-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
</style>
```

### Props

```typescript
interface Props {
  width?: 1 | 2 | 3 | 4
  colors?: string[]
  speed?: 'slow' | 'normal' | 'fast'
  animated?: boolean
}
```

## Acceptance Criteria

- Smooth gradient rotation
- No jank or stutter
- Customizable colors
- Works in all modern browsers
- Reduced motion stops animation

## Notes

Use CSS @property for smooth angle animation. Fallback for unsupported browsers.
