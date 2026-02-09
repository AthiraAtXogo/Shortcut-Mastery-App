# Task: GSAP Animation Setup

## Objective

Install and configure GSAP (GreenSock Animation Platform) for smooth UI animations.

## Requirements

- [ ] Install GSAP core and plugins
- [ ] Create Vue composable for GSAP utilities
- [ ] Set up animation presets (elastic, bounce, etc.)
- [ ] Configure reduced motion support
- [ ] Create reusable animation functions

## Technical Details

### Dependencies

```bash
pnpm add gsap
```

### Composable: useGsap.ts

```typescript
import { gsap } from 'gsap'

export function useGsap() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const animate = (target: Element | string, props: gsap.TweenVars) => {
    if (prefersReducedMotion.value) {
      return gsap.set(target, props)
    }
    return gsap.to(target, props)
  }

  const textScramble = (target: Element, text: string) => { /* ... */ }
  const counterRoll = (target: Element, end: number) => { /* ... */ }
  const elasticBounce = (target: Element) => { /* ... */ }
  const shakeAndFlash = (target: Element) => { /* ... */ }
  const staggerCascade = (targets: Element[]) => { /* ... */ }

  return { animate, textScramble, counterRoll, elasticBounce, shakeAndFlash, staggerCascade }
}
```

### Animation Presets

| Name | Easing | Duration | Use Case |
|------|--------|----------|----------|
| elasticBounce | elastic.out(1, 0.3) | 0.6s | Button clicks |
| smoothReveal | power2.out | 0.4s | Page transitions |
| quickPop | back.out(1.7) | 0.3s | Notifications |
| shakeFeedback | none (keyframes) | 0.4s | Wrong answers |

## Acceptance Criteria

- GSAP imported without errors
- Composable provides animation functions
- Reduced motion respected
- Animations smooth at 60fps

## Notes

GSAP is the backbone of all 2D animations in the app.
