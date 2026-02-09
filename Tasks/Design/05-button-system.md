# Task: Button System

## Objective

Create a comprehensive button component system with multiple variants and satisfying interactions.

## Requirements

- [ ] Create GameButton.vue component
- [ ] Implement variants (primary, secondary, ghost, danger)
- [ ] Add size variants (sm, md, lg, xl)
- [ ] Include hover/active states with GSAP
- [ ] Add magnetic cursor effect
- [ ] Support icons (left/right)
- [ ] Sound effect on click
- [ ] Loading state

## Technical Details

### Variants

| Variant | Style | Use Case |
|---------|-------|----------|
| primary | Electric blue, glow | Main actions |
| secondary | Purple outline | Secondary actions |
| ghost | Transparent, subtle hover | Tertiary actions |
| danger | Hot pink | Destructive actions |
| success | Lime green | Positive confirmations |

### Component

```vue
<template>
  <button
    ref="buttonRef"
    :class="[
      'game-button',
      `game-button--${variant}`,
      `game-button--${size}`,
      { 'game-button--loading': loading }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span v-if="loading" class="game-button__loader" />
    <span v-else class="game-button__content">
      <Icon v-if="iconLeft" :name="iconLeft" />
      <slot />
      <Icon v-if="iconRight" :name="iconRight" />
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  iconLeft?: string
  iconRight?: string
  loading?: boolean
  disabled?: boolean
  sound?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  sound: true
})

const buttonRef = ref()
const { play } = useAudio()

useMagneticCursor(buttonRef, { strength: 0.2 })

const handleClick = () => {
  if (props.sound) play('click')

  // Elastic bounce animation
  gsap.fromTo(buttonRef.value,
    { scale: 0.95 },
    { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.3)' }
  )
}

const handleMouseEnter = () => {
  gsap.to(buttonRef.value, {
    boxShadow: 'var(--glow-primary)',
    duration: 0.2
  })
}
</script>
```

### Sizes

| Size | Padding | Font Size | Icon Size |
|------|---------|-----------|-----------|
| sm | 8px 16px | 14px | 16px |
| md | 12px 24px | 16px | 20px |
| lg | 16px 32px | 18px | 24px |
| xl | 20px 40px | 20px | 28px |

## Acceptance Criteria

- All variants render correctly
- Satisfying click animation
- Sound plays on click (if enabled)
- Magnetic effect works
- Loading state shows spinner
- Accessible (focus states, disabled)

## Notes

Buttons are touched constantly - they must feel great.
