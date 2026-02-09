# Task: Flip Cards Effect

## Objective

Create a 3D card flip animation for the Memory Match game mode.

## Requirements

- [ ] Create FlipCard.vue component
- [ ] 3D perspective flip
- [ ] Front and back content
- [ ] Flip on click or programmatically
- [ ] Support reduced motion (instant flip)

## Technical Details

### Implementation

```vue
<template>
  <div
    ref="cardRef"
    class="flip-card"
    :class="{ 'flip-card--flipped': isFlipped }"
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

const props = defineProps<{
  flipped?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  flip: [isFlipped: boolean]
}>()

const cardRef = ref<HTMLElement>()
const isFlipped = ref(props.flipped ?? false)
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

const flip = (toFlipped?: boolean) => {
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
    onComplete: () => {
      isFlipped.value = newState
      emit('flip', newState)
    }
  })
}

const handleClick = () => {
  if (props.disabled) return
  flip()
}

watch(() => props.flipped, (val) => {
  if (val !== isFlipped.value) {
    flip(val)
  }
})

defineExpose({ flip })
</script>

<style scoped>
.flip-card {
  perspective: 1000px;
  cursor: pointer;
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
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.flip-card__back {
  background: var(--bg-card);
  transform: rotateY(180deg);
}

.flip-card__mystery {
  font-size: 2rem;
  color: var(--primary-500);
}
</style>
```

### Usage in Memory Match

```vue
<FlipCard
  v-for="card in cards"
  :key="card.id"
  :flipped="card.revealed"
  :disabled="card.matched"
  @flip="handleCardFlip(card)"
>
  <template #back>
    <div class="shortcut-card">
      <span>{{ card.shortcut }}</span>
    </div>
  </template>
</FlipCard>
```

## Acceptance Criteria

- Smooth 3D flip animation
- Front shows mystery, back shows content
- Can flip via click or prop
- Disabled state prevents interaction
- Reduced motion shows instant state change

## Notes

Central to Memory Match mode - must feel satisfying.
