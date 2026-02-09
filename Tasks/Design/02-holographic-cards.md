# Task: Holographic Cards

## Objective

Create a reusable card component with holographic shimmer effect and 3D tilt that follows the cursor.

## Requirements

- [ ] Create HoloCard.vue component
- [ ] Implement rainbow gradient shimmer
- [ ] Add 3D perspective tilt on hover
- [ ] Track mouse position for tilt direction
- [ ] Add subtle glow effect
- [ ] Support reduced motion
- [ ] Props for size variants

## Technical Details

### Visual Effect

- Rainbow gradient overlay that shifts with mouse movement
- Card tilts up to 15 degrees toward cursor
- Subtle reflection/shine layer
- Glow increases on hover

### Component Structure

```vue
<template>
  <div
    ref="cardRef"
    class="holo-card"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div class="holo-card__shine" :style="shineStyle" />
    <div class="holo-card__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const cardRef = ref<HTMLElement>()
const tiltX = ref(0)
const tiltY = ref(0)
const shineX = ref(50)
const shineY = ref(50)

const handleMouseMove = (e: MouseEvent) => {
  if (prefersReducedMotion.value) return

  const rect = cardRef.value?.getBoundingClientRect()
  if (!rect) return

  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height

  tiltX.value = (y - 0.5) * 15
  tiltY.value = (x - 0.5) * -15
  shineX.value = x * 100
  shineY.value = y * 100
}

const cardStyle = computed(() => ({
  transform: `perspective(1000px) rotateX(${tiltX.value}deg) rotateY(${tiltY.value}deg)`
}))

const shineStyle = computed(() => ({
  background: `radial-gradient(circle at ${shineX.value}% ${shineY.value}%, rgba(255,255,255,0.3), transparent 50%)`
}))
</script>

<style scoped>
.holo-card {
  position: relative;
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.1s ease-out;
}

.holo-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 0, 150, 0.1),
    rgba(0, 212, 255, 0.1),
    rgba(150, 0, 255, 0.1)
  );
  opacity: 0;
  transition: opacity 0.3s;
}

.holo-card:hover::before {
  opacity: 1;
}

.holo-card__shine {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
```

## Acceptance Criteria

- Smooth tilt following cursor
- Rainbow shimmer visible on hover
- Performance stays at 60fps
- Reduced motion disables tilt
- Works on touch devices (no tilt)

## Notes

This is the signature card style for the app - make it feel premium.
