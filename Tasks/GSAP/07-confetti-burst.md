# Task: Confetti Burst Effect

## Objective

Create a celebratory confetti animation for achievements and milestones.

## Requirements

- [ ] Create useConfetti composable
- [ ] Colorful particle burst
- [ ] Physics-based falling
- [ ] Configurable colors and intensity
- [ ] Auto-cleanup after animation
- [ ] Support reduced motion (skip)

## Technical Details

### Implementation

```typescript
// composables/useConfetti.ts
import { gsap } from 'gsap'

interface ConfettiOptions {
  count?: number
  colors?: string[]
  origin?: { x: number; y: number }
  spread?: number
  duration?: number
}

interface Particle {
  element: HTMLElement
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
}

export function useConfetti() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  let container: HTMLElement | null = null

  const createContainer = () => {
    if (container) return container

    container = document.createElement('div')
    container.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 10000;
    `
    document.body.appendChild(container)
    return container
  }

  const burst = (options: ConfettiOptions = {}) => {
    if (prefersReducedMotion.value) return Promise.resolve()

    const {
      count = 50,
      colors = ['#00d4ff', '#a855f7', '#84cc16', '#f97316', '#f43f5e'],
      origin = { x: 0.5, y: 0.5 },
      spread = 60,
      duration = 2
    } = options

    const cont = createContainer()
    const particles: Particle[] = []

    // Create particles
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div')
      const color = colors[Math.floor(Math.random() * colors.length)]
      const size = 8 + Math.random() * 8
      const shape = Math.random() > 0.5 ? '50%' : '0'

      el.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${shape};
      `
      cont.appendChild(el)

      const angle = (Math.random() - 0.5) * spread * (Math.PI / 180) - Math.PI / 2
      const velocity = 10 + Math.random() * 10

      particles.push({
        element: el,
        x: window.innerWidth * origin.x,
        y: window.innerHeight * origin.y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 20
      })
    }

    // Animate
    return new Promise<void>(resolve => {
      const gravity = 0.5
      const friction = 0.99
      let frame = 0
      const maxFrames = duration * 60

      const animate = () => {
        frame++

        particles.forEach(p => {
          p.vy += gravity
          p.vx *= friction
          p.x += p.vx
          p.y += p.vy
          p.rotation += p.rotationSpeed

          p.element.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`
          p.element.style.opacity = String(1 - frame / maxFrames)
        })

        if (frame < maxFrames) {
          requestAnimationFrame(animate)
        } else {
          // Cleanup
          particles.forEach(p => p.element.remove())
          resolve()
        }
      }

      animate()
    })
  }

  return { burst }
}
```

### Usage

```vue
<script setup>
const { burst } = useConfetti()

const onAchievementUnlocked = () => {
  burst({
    count: 80,
    origin: { x: 0.5, y: 0.3 },
    colors: ['#ffd700', '#ffec8b', '#f97316']
  })
}
</script>
```

## Acceptance Criteria

- Colorful burst effect
- Particles fall naturally
- Fades out over time
- No memory leaks (cleanup)
- Reduced motion skips entirely
- Works from any origin point

## Notes

Celebration moments deserve celebration visuals!
