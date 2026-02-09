<script setup lang="ts">
import { gsap } from 'gsap'

// #region setup
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  iconLeft?: string
  iconRight?: string
  loading?: boolean
  disabled?: boolean
  sound?: boolean
  magnetic?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  sound: true,
  magnetic: true
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
// #endregion

// #region state
const buttonRef = ref<HTMLElement>()
// #endregion

// #region composables
const { playSfx } = useAudio()

// SSR-safe reduced motion check
const prefersReducedMotion = ref(false)
if (process.client) {
  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches
  })
}

// Only apply magnetic effect if enabled
if (props.magnetic) {
  useMagneticCursor(buttonRef, { strength: 0.2, radius: 80 })
}
// #endregion

// #region handlers
function handleClick(e: MouseEvent) {
  if (props.disabled || props.loading) return

  // Sound
  if (props.sound) {
    playSfx('keyPress')
  }

  // Animation
  if (!prefersReducedMotion.value && buttonRef.value) {
    gsap.fromTo(
      buttonRef.value,
      { scale: 0.95 },
      { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.3)' }
    )
  }

  emit('click', e)
}

function handleMouseEnter() {
  if (props.disabled || props.loading || prefersReducedMotion.value) return
  if (!buttonRef.value) return

  gsap.to(buttonRef.value, {
    scale: 1.02,
    duration: 0.2,
    ease: 'power2.out'
  })
}

function handleMouseLeave() {
  if (!buttonRef.value) return

  gsap.to(buttonRef.value, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  })
}
// #endregion
</script>

<template>
  <button
    ref="buttonRef"
    class="game-button"
    :class="[
      `game-button--${variant}`,
      `game-button--${size}`,
      {
        'game-button--loading': loading,
        'game-button--disabled': disabled
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Loading spinner -->
    <span v-if="loading" class="game-button__loader">
      <UIcon name="i-lucide-loader-2" class="animate-spin" />
    </span>

    <!-- Content -->
    <span v-else class="game-button__content">
      <UIcon v-if="iconLeft" :name="iconLeft" class="game-button__icon" />
      <span class="game-button__text">
        <slot />
      </span>
      <UIcon v-if="iconRight" :name="iconRight" class="game-button__icon" />
    </span>
  </button>
</template>

<style scoped>
.game-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  will-change: transform;
  border: none;
  outline: none;
}

.game-button:focus-visible {
  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-primary-500);
}

/* ============ SIZES ============ */
.game-button--sm {
  padding: 8px 16px;
  font-size: 14px;
  gap: 6px;
}

.game-button--sm .game-button__icon {
  width: 16px;
  height: 16px;
}

.game-button--md {
  padding: 12px 24px;
  font-size: 16px;
  gap: 8px;
}

.game-button--md .game-button__icon {
  width: 20px;
  height: 20px;
}

.game-button--lg {
  padding: 16px 32px;
  font-size: 18px;
  gap: 10px;
}

.game-button--lg .game-button__icon {
  width: 24px;
  height: 24px;
}

.game-button--xl {
  padding: 20px 40px;
  font-size: 20px;
  gap: 12px;
}

.game-button--xl .game-button__icon {
  width: 28px;
  height: 28px;
}

/* ============ VARIANTS ============ */

/* Primary - Electric Blue */
.game-button--primary {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: var(--color-background);
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
}

.game-button--primary:hover:not(:disabled) {
  box-shadow: 0 6px 25px rgba(0, 212, 255, 0.5);
}

.game-button--primary:active:not(:disabled) {
  box-shadow: 0 2px 10px rgba(0, 212, 255, 0.4);
}

/* Secondary - Purple Outline */
.game-button--secondary {
  background: transparent;
  color: var(--color-secondary-400);
  border: 2px solid var(--color-secondary-500);
}

.game-button--secondary:hover:not(:disabled) {
  background: rgba(168, 85, 247, 0.1);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
}

/* Ghost - Transparent */
.game-button--ghost {
  background: transparent;
  color: var(--color-neutral-300);
}

.game-button--ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-neutral-100);
}

/* Danger - Hot Pink */
.game-button--danger {
  background: linear-gradient(135deg, var(--color-error-500), var(--color-error-600));
  color: white;
  box-shadow: 0 4px 15px rgba(244, 63, 94, 0.3);
}

.game-button--danger:hover:not(:disabled) {
  box-shadow: 0 6px 25px rgba(244, 63, 94, 0.5);
}

/* Success - Lime Green */
.game-button--success {
  background: linear-gradient(135deg, var(--color-success-500), var(--color-success-600));
  color: var(--color-background);
  box-shadow: 0 4px 15px rgba(132, 204, 22, 0.3);
}

.game-button--success:hover:not(:disabled) {
  box-shadow: 0 6px 25px rgba(132, 204, 22, 0.5);
}

/* ============ STATES ============ */
.game-button--disabled,
.game-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.game-button--loading {
  cursor: wait;
}

.game-button__content {
  display: flex;
  align-items: center;
  gap: inherit;
}

.game-button__loader {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .game-button {
    transition: opacity 0.2s ease, box-shadow 0.2s ease;
  }
}
</style>
