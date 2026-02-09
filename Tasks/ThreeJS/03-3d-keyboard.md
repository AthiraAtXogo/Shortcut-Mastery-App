# Task: 3D Keyboard

## Objective

Create a floating 3D keyboard that illuminates keys as they are pressed and serves as a hero visual element.

## Requirements

- [ ] Create Keyboard3D.vue component
- [ ] Model keyboard layout (QWERTY)
- [ ] Individual key meshes
- [ ] Keys illuminate when pressed
- [ ] Subtle floating animation
- [ ] Tilts slightly with mouse movement
- [ ] Support highlighting specific keys

## Technical Details

### Visual Concept

- Sleek, minimal keyboard floating in space
- Dark keys with subtle borders
- Keys glow (electric blue) when activated
- Gentle hover animation (up/down bob)
- Follows mouse slightly (parallax)

### Key Layout

```
Standard QWERTY layout:
Row 0: Esc, F1-F12
Row 1: `, 1-0, -, =, Backspace
Row 2: Tab, Q-P, [, ], \
Row 3: Caps, A-L, ;, ', Enter
Row 4: Shift, Z-M, ,, ., /, Shift
Row 5: Ctrl, Win, Alt, Space, Alt, Win, Menu, Ctrl
```

### Implementation

```vue
<template>
  <TresGroup
    ref="keyboardRef"
    :position="[0, 0, 0]"
    :rotation="[tiltX, tiltY, 0]"
  >
    <!-- Keyboard base -->
    <TresMesh :position="[0, -0.2, 0]">
      <TresBoxGeometry :args="[15, 0.3, 6]" />
      <TresMeshStandardMaterial :color="'#1a1a25'" />
    </TresMesh>

    <!-- Keys -->
    <Key3D
      v-for="key in keys"
      :key="key.code"
      :keyData="key"
      :isPressed="pressedKeys.includes(key.code)"
      :isHighlighted="highlightedKeys.includes(key.code)"
    />
  </TresGroup>
</template>

<script setup lang="ts">
interface KeyData {
  code: string
  label: string
  position: [number, number, number]
  width: number
}

const props = defineProps<{
  pressedKeys?: string[]
  highlightedKeys?: string[]
}>()

// Key layout generation
const keys = computed<KeyData[]>(() => generateKeyLayout())

// Mouse tracking for tilt
const { x, y } = useMouse()
const tiltX = computed(() => (y.value / window.innerHeight - 0.5) * 0.1)
const tiltY = computed(() => (x.value / window.innerWidth - 0.5) * -0.1)

// Floating animation
const floatY = ref(0)
useRenderLoop().onLoop(({ elapsed }) => {
  floatY.value = Math.sin(elapsed * 0.5) * 0.1
})
</script>
```

### Key3D Component

```vue
<template>
  <TresMesh :position="position">
    <TresBoxGeometry :args="[width, 0.3, 0.8]" />
    <TresMeshStandardMaterial
      :color="isPressed || isHighlighted ? '#00d4ff' : '#2a2a35'"
      :emissive="isPressed || isHighlighted ? '#00d4ff' : '#000000'"
      :emissiveIntensity="isPressed ? 0.5 : isHighlighted ? 0.3 : 0"
    />

    <!-- Key label -->
    <TresText
      :text="keyData.label"
      :position="[0, 0.2, 0]"
      :fontSize="0.2"
      :color="'#ffffff'"
    />
  </TresMesh>
</template>
```

## Acceptance Criteria

- Full keyboard renders correctly
- Keys light up on press
- Highlighted keys glow
- Smooth floating animation
- Mouse parallax works
- Labels are readable

## Notes

This is a hero element - should look impressive on the home screen.
