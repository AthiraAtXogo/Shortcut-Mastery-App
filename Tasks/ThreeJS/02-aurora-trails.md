# Task: Aurora Trails

## Objective

Create flowing color ribbon effects that indicate streak status and react to gameplay.

## Requirements

- [ ] Create AuroraTrails.vue component
- [ ] Implement flowing ribbon geometry
- [ ] Color shifts based on streak level
- [ ] Intensity increases with higher streaks
- [ ] Smooth appear/disappear transitions
- [ ] Performance optimized

## Technical Details

### Visual Concept

- Flowing ribbons of light, like aurora borealis
- Appears when streak >= 3
- Grows more vibrant/intense with higher streaks
- Colors shift: blue → purple → pink → gold (at high streaks)
- Subtle wave motion

### Streak Levels

| Streak | Color | Intensity |
|--------|-------|-----------|
| 3-5 | Blue | Low |
| 6-10 | Purple | Medium |
| 11-20 | Pink | High |
| 21+ | Gold | Maximum |

### Implementation

```vue
<template>
  <TresGroup v-if="visible">
    <TresMesh
      v-for="(ribbon, i) in ribbons"
      :key="i"
      :position="ribbon.position"
    >
      <TresPlaneGeometry :args="[20, 2, 32, 8]" />
      <TresShaderMaterial
        :vertexShader="vertexShader"
        :fragmentShader="fragmentShader"
        :uniforms="uniforms"
        :transparent="true"
        :side="DoubleSide"
      />
    </TresMesh>
  </TresGroup>
</template>

<script setup lang="ts">
const props = defineProps<{
  streak: number
}>()

const visible = computed(() => props.streak >= 3)

const color = computed(() => {
  if (props.streak >= 21) return '#ffd700'
  if (props.streak >= 11) return '#f43f5e'
  if (props.streak >= 6) return '#a855f7'
  return '#00d4ff'
})

const intensity = computed(() => {
  return Math.min(props.streak / 20, 1)
})

// Shader for wave motion and gradient
const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.y += sin(pos.x * 0.5 + uTime) * 0.5;
    pos.z += cos(pos.x * 0.3 + uTime * 0.7) * 0.3;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    float alpha = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
    alpha *= uIntensity * 0.6;
    gl_FragColor = vec4(uColor, alpha);
  }
`
</script>
```

## Acceptance Criteria

- Aurora appears at streak 3+
- Color transitions are smooth
- Wave motion is fluid
- Intensity scales with streak
- Disappears smoothly when streak breaks
- No performance impact

## Notes

Should feel rewarding - visual feedback for maintaining streak.
