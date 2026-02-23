/** Celebratory confetti burst with physics-based particle animation */

interface ConfettiOptions {
  count?: number
  colors?: string[]
  origin?: { x: number, y: number }
  spread?: number
  duration?: number
}

interface Particle {
  element: HTMLDivElement
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
}

export function useConfetti() {
  const prefersReducedMotion = ref(false)
  let container: HTMLDivElement | null = null

  if (import.meta.client) {
    onMounted(() => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      prefersReducedMotion.value = mq.matches
      mq.addEventListener('change', (e) => {
        prefersReducedMotion.value = e.matches
      })
    })
  }

  function getContainer(): HTMLDivElement {
    if (container && document.body.contains(container)) return container

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

  function burst(options: ConfettiOptions = {}): Promise<void> {
    if (prefersReducedMotion.value || !import.meta.client) return Promise.resolve()

    const {
      count = 50,
      colors = ['#00d4ff', '#a855f7', '#84cc16', '#f97316', '#f43f5e'],
      origin = { x: 0.5, y: 0.4 },
      spread = 60,
      duration = 2
    } = options

    const cont = getContainer()
    const particles: Particle[] = []

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div')
      const color = colors[Math.floor(Math.random() * colors.length)]!
      const size = 8 + Math.random() * 8
      const isCircle = Math.random() > 0.5

      el.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${isCircle ? '50%' : '2px'};
        top: 0;
        left: 0;
      `
      cont.appendChild(el)

      const angle = (Math.random() - 0.5) * spread * (Math.PI / 180) - Math.PI / 2
      const velocity = 10 + Math.random() * 12

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

    return new Promise<void>((resolve) => {
      const gravity = 0.5
      const friction = 0.99
      let frame = 0
      const maxFrames = Math.floor(duration * 60)

      const animate = () => {
        frame++

        particles.forEach((p) => {
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
          particles.forEach(p => p.element.remove())
          resolve()
        }
      }

      requestAnimationFrame(animate)
    })
  }

  return { burst, prefersReducedMotion: readonly(prefersReducedMotion) }
}
