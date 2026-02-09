# Task: Reduced Motion Support

## Objective

Respect user's motion preferences and provide option to reduce/disable animations.

## Requirements

- [ ] Detect prefers-reduced-motion
- [ ] Settings toggle for reduced motion
- [ ] Disable GSAP animations when active
- [ ] Disable Three.js animations when active
- [ ] Instant state changes instead of transitions
- [ ] Keep essential feedback (color changes)

## Implementation

```typescript
// composables/useReducedMotion.ts
export function useReducedMotion() {
  const systemPreference = useMediaQuery('(prefers-reduced-motion: reduce)')
  const userPreference = useSettingsStore().reducedMotion

  const prefersReducedMotion = computed(() =>
    userPreference.value ?? systemPreference.value
  )

  return { prefersReducedMotion }
}
```

## CSS Approach

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Class-based override */
.reduced-motion *,
.reduced-motion *::before,
.reduced-motion *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}
```

## Animation Wrapper

```typescript
// All GSAP animations should check this
const animate = (target: Element, props: gsap.TweenVars) => {
  if (prefersReducedMotion.value) {
    // Instant state change
    return gsap.set(target, props)
  }
  return gsap.to(target, props)
}
```

## Acceptance Criteria

- System preference detected
- Manual toggle in settings
- Animations disabled when active
- Essential feedback preserved
- No jarring experiences
