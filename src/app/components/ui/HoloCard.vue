<script setup lang="ts">
// #region setup
interface Props {
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  glowColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  interactive: true,
  glowColor: 'rgba(0, 212, 255, 0.3)'
})
// #endregion

// #region state
const cardRef = ref<HTMLElement>()
const tiltX = ref(0)
const tiltY = ref(0)
const shineX = ref(50)
const shineY = ref(50)
const isHovering = ref(false)
// #endregion

// #region composables
// SSR-safe reduced motion check
const prefersReducedMotion = ref(false)
if (process.client) {
  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches
  })
}
// #endregion

// #region computed
const cardStyle = computed(() => {
  if (prefersReducedMotion.value || !props.interactive) {
    return {}
  }
  return {
    transform: `perspective(1000px) rotateX(${tiltX.value}deg) rotateY(${tiltY.value}deg)`
  }
})

const shineStyle = computed(() => ({
  background: `radial-gradient(circle at ${shineX.value}% ${shineY.value}%, rgba(255,255,255,0.25), transparent 50%)`
}))

const glowStyle = computed(() => {
  if (!isHovering.value) return {}
  return {
    boxShadow: `0 0 30px ${props.glowColor}`
  }
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'p-3 rounded-lg',
    md: 'p-4 rounded-xl',
    lg: 'p-6 rounded-2xl'
  }
  return sizes[props.size]
})
// #endregion

// #region handlers
function handleMouseMove(e: MouseEvent) {
  if (prefersReducedMotion.value || !props.interactive) return

  const rect = cardRef.value?.getBoundingClientRect()
  if (!rect) return

  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height

  tiltX.value = (y - 0.5) * 12
  tiltY.value = (x - 0.5) * -12
  shineX.value = x * 100
  shineY.value = y * 100
}

function handleMouseEnter() {
  isHovering.value = true
}

function handleMouseLeave() {
  isHovering.value = false
  tiltX.value = 0
  tiltY.value = 0
  shineX.value = 50
  shineY.value = 50
}
// #endregion
</script>

<template>
  <div
    ref="cardRef"
    class="holo-card"
    :class="sizeClasses"
    :style="[cardStyle, glowStyle]"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Rainbow gradient overlay -->
    <div class="holo-card__rainbow" />

    <!-- Shine effect -->
    <div class="holo-card__shine" :style="shineStyle" />

    <!-- Content -->
    <div class="holo-card__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.holo-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
  transition: transform 0.15s ease-out, box-shadow 0.3s ease;
  will-change: transform;
}

.holo-card__rainbow {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 0, 150, 0.08) 0%,
    rgba(0, 212, 255, 0.08) 25%,
    rgba(150, 0, 255, 0.08) 50%,
    rgba(0, 255, 150, 0.08) 75%,
    rgba(255, 150, 0, 0.08) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.holo-card:hover .holo-card__rainbow {
  opacity: 1;
}

.holo-card__shine {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.holo-card:hover .holo-card__shine {
  opacity: 1;
}

.holo-card__content {
  position: relative;
  z-index: 1;
}

/* Hover border glow */
.holo-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(0, 212, 255, 0.3),
    rgba(168, 85, 247, 0.3),
    rgba(0, 212, 255, 0.3)
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.holo-card:hover::after {
  opacity: 1;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .holo-card {
    transition: box-shadow 0.3s ease;
  }
}
</style>
