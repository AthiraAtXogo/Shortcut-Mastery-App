# Task: Neural Network Background

## Objective

Create an animated 3D neural network background with connected nodes that pulse with energy on correct answers.

## Requirements

- [ ] Create NeuralBackground.vue component
- [ ] Generate random node positions in 3D space
- [ ] Connect nearby nodes with lines
- [ ] Animate subtle node movement (drift)
- [ ] Pulse effect on correct answer (energy travels through connections)
- [ ] Responsive to viewport size
- [ ] Performance optimized

## Technical Details

### Visual Concept

- 50-100 small glowing spheres (nodes) floating in space
- Thin lines connecting nodes within a certain distance
- Nodes slowly drift/float
- On correct answer: bright pulse travels from center outward through connections
- Color: primary blue with hints of purple

### Implementation

```vue
<template>
  <TresCanvas class="neural-bg">
    <TresPerspectiveCamera :position="[0, 0, 30]" />

    <!-- Nodes -->
    <TresMesh
      v-for="node in nodes"
      :key="node.id"
      :position="node.position"
    >
      <TresSphereGeometry :args="[0.1, 16, 16]" />
      <TresMeshBasicMaterial :color="node.color" :transparent="true" :opacity="0.8" />
    </TresMesh>

    <!-- Connections -->
    <TresLine
      v-for="connection in connections"
      :key="connection.id"
      :points="connection.points"
    >
      <TresLineBasicMaterial :color="connectionColor" :transparent="true" :opacity="0.2" />
    </TresLine>
  </TresCanvas>
</template>

<script setup lang="ts">
interface Node {
  id: string
  position: [number, number, number]
  velocity: [number, number, number]
  color: string
}

const NODE_COUNT = 80
const CONNECTION_DISTANCE = 5

const nodes = ref<Node[]>([])
const connections = computed(() => calculateConnections(nodes.value))

// Generate random nodes
onMounted(() => {
  nodes.value = Array.from({ length: NODE_COUNT }, (_, i) => ({
    id: `node-${i}`,
    position: [
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20
    ],
    velocity: [
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01
    ],
    color: '#00d4ff'
  }))
})

// Animation loop for drift
useRenderLoop().onLoop(() => {
  nodes.value.forEach(node => {
    node.position[0] += node.velocity[0]
    node.position[1] += node.velocity[1]
    node.position[2] += node.velocity[2]
    // Bounce off boundaries
  })
})

// Pulse effect
const triggerPulse = () => {
  // Animate nodes from center outward
  // Brighten connections as pulse passes through
}

defineExpose({ triggerPulse })
</script>
```

### Pulse Animation

When `triggerPulse()` is called:
1. Center nodes brighten first
2. Energy ripples outward through connections
3. Each node briefly glows brighter as pulse reaches it
4. Fades back to normal over 1 second

### Performance

- Use `InstancedMesh` for nodes
- Limit connection recalculation (every 10 frames)
- Reduce node count on mobile (40)
- Use simple geometries (spheres with low segments)

## Acceptance Criteria

- Background renders without errors
- Nodes drift smoothly
- Connections update as nodes move
- Pulse effect triggers on game events
- 60fps on desktop, 30fps acceptable on mobile
- Memory cleaned up on unmount

## Notes

This is the signature visual - make it mesmerizing but not distracting.
