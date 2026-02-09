# Task: Portal Vortex

## Objective

Create a dramatic swirling portal effect for level-up celebrations.

## Requirements

- [ ] Create PortalVortex.vue component
- [ ] Swirling tunnel effect
- [ ] Energy particles flowing inward
- [ ] Dramatic color gradient
- [ ] Camera zoom effect
- [ ] Trigger and auto-dismiss

## Technical Details

### Visual Concept

- Portal opens in center of screen
- Swirling vortex tunnel
- Energy particles flow toward/into portal
- Colors: deep purple → electric blue → white center
- Duration: 2-3 seconds
- Ends with flash

### Implementation

```vue
<template>
  <TresGroup v-if="isActive">
    <!-- Vortex rings -->
    <TresMesh
      v-for="(ring, i) in rings"
      :key="i"
      :position="[0, 0, ring.z]"
      :rotation="[0, 0, ring.rotation]"
      :scale="ring.scale"
    >
      <TresTorusGeometry :args="[1, 0.02, 16, 100]" />
      <TresMeshBasicMaterial
        :color="ring.color"
        :transparent="true"
        :opacity="ring.opacity"
      />
    </TresMesh>

    <!-- Center glow -->
    <TresMesh :position="[0, 0, -10]">
      <TresCircleGeometry :args="[2, 32]" />
      <TresMeshBasicMaterial
        :color="'#ffffff'"
        :transparent="true"
        :opacity="centerGlow"
      />
    </TresMesh>

    <!-- Particles -->
    <TresPoints :position="[0, 0, 0]">
      <TresBufferGeometry :position="particlePositions" />
      <TresPointsMaterial
        :size="0.05"
        :color="'#00d4ff'"
        :transparent="true"
        :opacity="0.8"
      />
    </TresPoints>
  </TresGroup>
</template>

<script setup lang="ts">
const isActive = ref(false)
const centerGlow = ref(0)
const rings = ref<Ring[]>([])

const trigger = async () => {
  isActive.value = true

  // Generate rings
  rings.value = Array.from({ length: 20 }, (_, i) => ({
    z: -i * 0.5,
    rotation: 0,
    scale: 1 + i * 0.1,
    color: lerpColor('#a855f7', '#00d4ff', i / 20),
    opacity: 1 - i * 0.04
  }))

  // Animate
  await animatePortal()

  // Flash and dismiss
  centerGlow.value = 1
  await sleep(200)
  isActive.value = false
}

const animatePortal = () => {
  return new Promise(resolve => {
    const duration = 2500
    const start = Date.now()

    const animate = () => {
      const elapsed = Date.now() - start
      const progress = elapsed / duration

      // Spin rings faster over time
      rings.value.forEach((ring, i) => {
        ring.rotation += 0.02 + i * 0.002 + progress * 0.05
      })

      // Increase center glow
      centerGlow.value = progress * 0.8

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        resolve(true)
      }
    }

    animate()
  })
}

defineExpose({ trigger })
</script>
```

## Acceptance Criteria

- Portal opens dramatically
- Swirling motion looks natural
- Particles flow toward center
- Colors are vibrant
- Ends with satisfying flash
- Auto-dismisses after animation

## Notes

Level up is a big moment - make it feel epic!
