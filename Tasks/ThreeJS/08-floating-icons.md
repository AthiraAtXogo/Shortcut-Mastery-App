# Task: Floating Icons

## Objective

Create orbiting 3D app logos for the category selection screen.

## Requirements

- [ ] Create FloatingIcons.vue component
- [ ] 3D plane with app logo textures
- [ ] Orbit around center point
- [ ] Hover to highlight and pause
- [ ] Click to select category
- [ ] Smooth transitions

## Technical Details

### Visual Concept

- App logos float in a circular orbit
- Logos face the camera (billboard effect)
- Gentle bobbing motion
- Hover: logo scales up, others dim
- Click: selected logo zooms to center

### Implementation

```vue
<template>
  <TresGroup>
    <TresMesh
      v-for="(icon, i) in icons"
      :key="icon.id"
      :position="icon.position"
      :scale="icon.scale"
      @pointerenter="handleHover(i)"
      @pointerleave="handleLeave(i)"
      @click="handleClick(i)"
    >
      <TresPlaneGeometry :args="[1.5, 1.5]" />
      <TresMeshBasicMaterial
        :map="icon.texture"
        :transparent="true"
        :opacity="icon.opacity"
      />
    </TresMesh>
  </TresGroup>
</template>

<script setup lang="ts">
interface FloatingIcon {
  id: string
  name: string
  texture: Texture
  angle: number
  position: [number, number, number]
  scale: number
  opacity: number
}

const props = defineProps<{
  categories: Array<{ id: string; name: string; icon: string }>
}>()

const emit = defineEmits<{
  select: [categoryId: string]
}>()

const icons = ref<FloatingIcon[]>([])
const hoveredIndex = ref<number | null>(null)
const radius = 5

// Initialize icons in circle
onMounted(async () => {
  const textureLoader = new TextureLoader()

  icons.value = await Promise.all(
    props.categories.map(async (cat, i) => {
      const angle = (i / props.categories.length) * Math.PI * 2
      return {
        id: cat.id,
        name: cat.name,
        texture: await textureLoader.loadAsync(`/icons/${cat.icon}.png`),
        angle,
        position: [
          Math.cos(angle) * radius,
          Math.sin(i * 0.5) * 0.5, // Slight vertical variation
          Math.sin(angle) * radius
        ],
        scale: 1,
        opacity: 1
      }
    })
  )
})

// Orbit animation
useRenderLoop().onLoop(({ delta }) => {
  if (hoveredIndex.value !== null) return // Pause on hover

  icons.value.forEach(icon => {
    icon.angle += delta * 0.2
    icon.position[0] = Math.cos(icon.angle) * radius
    icon.position[2] = Math.sin(icon.angle) * radius
  })
})

const handleHover = (index: number) => {
  hoveredIndex.value = index

  icons.value.forEach((icon, i) => {
    if (i === index) {
      gsap.to(icon, { scale: 1.3, duration: 0.3 })
    } else {
      gsap.to(icon, { opacity: 0.3, duration: 0.3 })
    }
  })
}

const handleLeave = () => {
  hoveredIndex.value = null

  icons.value.forEach(icon => {
    gsap.to(icon, { scale: 1, opacity: 1, duration: 0.3 })
  })
}

const handleClick = (index: number) => {
  const selected = icons.value[index]
  emit('select', selected.id)

  // Zoom animation
  gsap.to(selected, {
    scale: 3,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.in'
  })
}
</script>
```

## Acceptance Criteria

- Icons orbit smoothly
- Hover pauses orbit and highlights
- Click triggers selection
- Smooth scale/opacity transitions
- Textures load without flicker
- Works with any number of categories

## Notes

Makes category selection feel interactive and premium.
