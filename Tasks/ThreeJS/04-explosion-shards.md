# Task: Explosion Shards

## Objective

Create a satisfying particle explosion effect when the user answers correctly.

## Requirements

- [ ] Create ExplosionShards.vue component
- [ ] Geometric shard shapes (triangles, quads)
- [ ] Burst outward from center
- [ ] Physics-based movement (velocity, gravity)
- [ ] Fade out over time
- [ ] Color based on streak/combo
- [ ] Trigger via exposed method

## Technical Details

### Visual Concept

- 20-40 geometric shards burst outward
- Shards rotate as they fly
- Slight gravity pulls them down
- Fade out over 1-2 seconds
- Colors match current theme (blue/purple/gold)

### Implementation

```vue
<template>
  <TresGroup ref="explosionRef">
    <TresMesh
      v-for="shard in shards"
      :key="shard.id"
      :position="shard.position"
      :rotation="shard.rotation"
      :scale="shard.scale"
    >
      <component :is="shard.geometry" />
      <TresMeshBasicMaterial
        :color="shard.color"
        :transparent="true"
        :opacity="shard.opacity"
      />
    </TresMesh>
  </TresGroup>
</template>

<script setup lang="ts">
interface Shard {
  id: string
  position: [number, number, number]
  velocity: [number, number, number]
  rotation: [number, number, number]
  rotationSpeed: [number, number, number]
  scale: number
  opacity: number
  color: string
  geometry: 'TresTetrahedronGeometry' | 'TresBoxGeometry'
}

const shards = ref<Shard[]>([])
const isActive = ref(false)

const trigger = (options?: { color?: string; intensity?: number }) => {
  const color = options?.color ?? '#00d4ff'
  const count = (options?.intensity ?? 1) * 30

  shards.value = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const speed = 0.1 + Math.random() * 0.2

    return {
      id: `shard-${i}`,
      position: [0, 0, 0],
      velocity: [
        Math.cos(angle) * speed,
        Math.random() * 0.2,
        Math.sin(angle) * speed
      ],
      rotation: [0, 0, 0],
      rotationSpeed: [
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2
      ],
      scale: 0.1 + Math.random() * 0.1,
      opacity: 1,
      color,
      geometry: Math.random() > 0.5 ? 'TresTetrahedronGeometry' : 'TresBoxGeometry'
    }
  })

  isActive.value = true
}

// Animation loop
useRenderLoop().onLoop(({ delta }) => {
  if (!isActive.value) return

  let allFaded = true

  shards.value.forEach(shard => {
    // Update position
    shard.position[0] += shard.velocity[0]
    shard.position[1] += shard.velocity[1]
    shard.position[2] += shard.velocity[2]

    // Apply gravity
    shard.velocity[1] -= 0.005

    // Update rotation
    shard.rotation[0] += shard.rotationSpeed[0]
    shard.rotation[1] += shard.rotationSpeed[1]
    shard.rotation[2] += shard.rotationSpeed[2]

    // Fade out
    shard.opacity -= delta * 0.5
    if (shard.opacity > 0) allFaded = false
  })

  if (allFaded) {
    isActive.value = false
    shards.value = []
  }
})

defineExpose({ trigger })
</script>
```

### Color by Streak

| Streak | Explosion Color |
|--------|-----------------|
| 1-2 | Electric blue |
| 3-5 | Blue + purple mix |
| 6-10 | Purple |
| 11-20 | Pink |
| 21+ | Gold |

## Acceptance Criteria

- Explosion triggers on demand
- Shards burst outward naturally
- Gravity and rotation look realistic
- Fades out smoothly
- Colors reflect streak level
- No lingering shards after fade

## Notes

Key to the "satisfying" feel - test extensively for best params.
