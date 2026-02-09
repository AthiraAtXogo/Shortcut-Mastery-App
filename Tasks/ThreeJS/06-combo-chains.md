# Task: Combo Chains

## Objective

Create energy trails that visually connect consecutive correct answers during combos.

## Requirements

- [ ] Create ComboChain.vue component
- [ ] Draw energy line between answer positions
- [ ] Animated flow along the line
- [ ] Grows brighter with higher combos
- [ ] Fades when combo breaks
- [ ] Multiple chain segments for long combos

## Technical Details

### Visual Concept

- Glowing energy line connecting recent correct answers
- Energy "flows" along the line (animated texture/particles)
- Line gets thicker/brighter with higher combos
- Shows last 5 connections max
- Fades elegantly when combo breaks

### Implementation

```vue
<template>
  <TresGroup>
    <TresLine
      v-for="(segment, i) in segments"
      :key="i"
      :points="segment.points"
    >
      <TresLineBasicMaterial
        :color="segment.color"
        :linewidth="segment.width"
        :transparent="true"
        :opacity="segment.opacity"
      />
    </TresLine>

    <!-- Flow particles along lines -->
    <TresMesh
      v-for="particle in flowParticles"
      :key="particle.id"
      :position="particle.position"
    >
      <TresSphereGeometry :args="[0.05, 8, 8]" />
      <TresMeshBasicMaterial :color="'#ffffff'" />
    </TresMesh>
  </TresGroup>
</template>

<script setup lang="ts">
interface ChainSegment {
  points: [Vector3, Vector3]
  color: string
  width: number
  opacity: number
  createdAt: number
}

const segments = ref<ChainSegment[]>([])
const flowParticles = ref<any[]>([])

const addConnection = (from: Vector3, to: Vector3, comboLevel: number) => {
  // Remove oldest if > 5
  if (segments.value.length >= 5) {
    segments.value.shift()
  }

  segments.value.push({
    points: [from, to],
    color: getComboColor(comboLevel),
    width: 1 + comboLevel * 0.5,
    opacity: 1,
    createdAt: Date.now()
  })

  // Spawn flow particles
  spawnFlowParticles(from, to)
}

const breakCombo = () => {
  // Fade out all segments
  const fadeOut = () => {
    segments.value.forEach(seg => {
      seg.opacity -= 0.05
    })
    segments.value = segments.value.filter(seg => seg.opacity > 0)
    if (segments.value.length > 0) {
      requestAnimationFrame(fadeOut)
    }
  }
  fadeOut()
}

const getComboColor = (level: number) => {
  if (level >= 10) return '#ffd700'
  if (level >= 5) return '#a855f7'
  return '#00d4ff'
}

defineExpose({ addConnection, breakCombo })
</script>
```

## Acceptance Criteria

- Chains connect consecutive answers
- Flow animation visible along lines
- Color/intensity matches combo level
- Max 5 visible connections
- Smooth fade on combo break
- Performance stays good

## Notes

Subtle but rewarding visual feedback for maintaining combos.
