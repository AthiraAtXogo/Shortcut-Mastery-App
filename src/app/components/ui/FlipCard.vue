<template>
  <div
    ref="cardRef"
    class="flip-card"
    :class="{ 'flip-card--flipped': isFlipped, 'flip-card--disabled': disabled }"
    @click="handleClick"
  >
    <div class="flip-card__inner">
      <div class="flip-card__front">
        <slot name="front">
          <span class="flip-card__mystery">?</span>
        </slot>
      </div>
      <div class="flip-card__back">
        <slot name="back" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

// #region setup
const props = defineProps<{
  flipped?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  flip: [isFlipped: boolean]
}>()
// #endregion

// #region state
const cardRef = ref<HTMLElement>()
const isFlipped = ref(props.flipped ?? false)
const prefersReducedMotion = ref(false)
// #endregion

// #region lifecycle
onMounted(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = mq.matches
  mq.addEventListener('change', (e) => {
    prefersReducedMotion.value = e.matches
  })
})
// #endregion

// #region methods
function flip(toFlipped?: boolean): void {
  const newState = toFlipped ?? !isFlipped.value

  if (prefersReducedMotion.value) {
    isFlipped.value = newState
    emit('flip', newState)
    return
  }

  const inner = cardRef.value?.querySelector('.flip-card__inner')
  if (!inner) return

  gsap.to(inner, {
    rotateY: newState ? 180 : 0,
    duration: 0.6,
    ease: 'power2.inOut',
    onComplete() {
      isFlipped.value = newState
      emit('flip', newState)
    }
  })
}
// #endregion

// #region handlers
function handleClick(): void {
  if (props.disabled) return
  flip()
}
// #endregion

// #region watchers
watch(
  () => props.flipped,
  (val) => {
    if (val !== undefined && val !== isFlipped.value) flip(val)
  }
)
// #endregion

defineExpose({ flip })
</script>

<style scoped>
.flip-card {
  perspective: 1000px;
  cursor: pointer;
}

.flip-card--disabled {
  cursor: default;
}

.flip-card__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.flip-card__front,
.flip-card__back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 12px;
}

.flip-card__front {
  background: var(--bg-tertiary, #1e293b);
  display: flex;
  align-items: center;
  justify-content: center;
}

.flip-card__back {
  background: var(--bg-card, #0f172a);
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.flip-card__mystery {
  font-size: 2rem;
  color: var(--primary-500, #00d4ff);
  user-select: none;
}
</style>
