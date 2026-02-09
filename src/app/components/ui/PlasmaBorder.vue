<script setup lang="ts">
// #region setup
interface Props {
  width?: 1 | 2 | 3 | 4
  speed?: 'slow' | 'normal' | 'fast'
  animated?: boolean
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  width: 2,
  speed: 'normal',
  animated: true,
  rounded: 'xl'
})
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
const shouldAnimate = computed(() => props.animated && !prefersReducedMotion.value)

const speedDuration = computed(() => {
  const speeds = {
    slow: '4s',
    normal: '3s',
    fast: '2s'
  }
  return speeds[props.speed]
})

const borderRadius = computed(() => {
  const radii = {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px'
  }
  return radii[props.rounded]
})

const innerRadius = computed(() => {
  const radii = {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '18px',
    full: '9999px'
  }
  return radii[props.rounded]
})

const borderStyle = computed(() => ({
  '--plasma-duration': speedDuration.value,
  '--plasma-width': `${props.width}px`,
  '--plasma-radius': borderRadius.value,
  '--plasma-inner-radius': innerRadius.value
}))
// #endregion
</script>

<template>
  <div
    class="plasma-border"
    :class="{ 'plasma-border--animated': shouldAnimate }"
    :style="borderStyle"
  >
    <div class="plasma-border__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Register custom property for smooth angle animation */
@property --plasma-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.plasma-border {
  position: relative;
  padding: var(--plasma-width, 2px);
  border-radius: var(--plasma-radius, 16px);
  background: conic-gradient(
    from var(--plasma-angle, 0deg),
    #00d4ff,
    #a855f7,
    #f97316,
    #84cc16,
    #00d4ff
  );
}

.plasma-border--animated {
  animation: plasma-rotate var(--plasma-duration, 3s) linear infinite;
}

.plasma-border__content {
  background: var(--color-surface, #12121a);
  border-radius: var(--plasma-inner-radius, 14px);
  height: 100%;
  width: 100%;
}

@keyframes plasma-rotate {
  from {
    --plasma-angle: 0deg;
  }
  to {
    --plasma-angle: 360deg;
  }
}

/* Fallback for browsers without @property support */
@supports not (background: conic-gradient(from 0deg, red, blue)) {
  .plasma-border {
    background: linear-gradient(135deg, #00d4ff, #a855f7, #f97316);
  }

  .plasma-border--animated {
    animation: plasma-fallback 3s linear infinite;
  }

  @keyframes plasma-fallback {
    0% {
      background: linear-gradient(0deg, #00d4ff, #a855f7, #f97316, #84cc16);
    }
    25% {
      background: linear-gradient(90deg, #00d4ff, #a855f7, #f97316, #84cc16);
    }
    50% {
      background: linear-gradient(180deg, #00d4ff, #a855f7, #f97316, #84cc16);
    }
    75% {
      background: linear-gradient(270deg, #00d4ff, #a855f7, #f97316, #84cc16);
    }
    100% {
      background: linear-gradient(360deg, #00d4ff, #a855f7, #f97316, #84cc16);
    }
  }
}

/* Glow effect */
.plasma-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: inherit;
  filter: blur(10px);
  opacity: 0.4;
  z-index: -1;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .plasma-border {
    animation: none;
  }
}
</style>
