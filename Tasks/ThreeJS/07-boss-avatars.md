# Task: Boss Avatars

## Objective

Create 3D representations of app icons for boss battle mode.

## Requirements

- [ ] Create BossAvatar.vue component
- [ ] 3D versions of app logos (VS Code, Chrome, etc.)
- [ ] Menacing animation (pulsing, rotating)
- [ ] Damage effect when hit
- [ ] Defeat explosion
- [ ] Multiple boss designs

## Technical Details

### Boss Designs

| Boss | App | Visual |
|------|-----|--------|
| VS Code Master | VS Code | Blue cube with code brackets |
| Chrome Guardian | Chrome | Spinning color orb |
| Windows Sentinel | Windows | Four-pane window, glowing |
| Terminal Titan | CLI | Green matrix text cube |
| Notion Keeper | Notion | Minimalist N block |

### Implementation

```vue
<template>
  <TresGroup
    ref="bossRef"
    :position="[0, 2, 0]"
    :rotation="rotation"
    :scale="scale"
  >
    <!-- Boss body based on type -->
    <component :is="bossComponent" :health="health" :phase="phase" />

    <!-- Health bar above -->
    <TresMesh :position="[0, 2, 0]">
      <TresPlaneGeometry :args="[3, 0.2]" />
      <TresMeshBasicMaterial :color="'#333'" />
    </TresMesh>
    <TresMesh :position="[healthBarOffset, 2, 0.01]">
      <TresPlaneGeometry :args="[healthBarWidth, 0.15]" />
      <TresMeshBasicMaterial :color="healthColor" />
    </TresMesh>

    <!-- Damage flash overlay -->
    <TresMesh v-if="showDamageFlash" :scale="1.1">
      <TresSphereGeometry :args="[1.5, 16, 16]" />
      <TresMeshBasicMaterial :color="'#ff0000'" :transparent="true" :opacity="0.5" />
    </TresMesh>
  </TresGroup>
</template>

<script setup lang="ts">
const props = defineProps<{
  bossType: 'vscode' | 'chrome' | 'windows' | 'terminal' | 'notion'
  health: number
  maxHealth: number
  phase: number
}>()

const showDamageFlash = ref(false)
const rotation = ref([0, 0, 0])

// Menacing idle animation
useRenderLoop().onLoop(({ elapsed }) => {
  rotation.value[1] = elapsed * 0.5
  // Pulse scale based on phase
})

const takeDamage = () => {
  showDamageFlash.value = true
  // Shake animation
  gsap.to(bossRef.value.position, {
    x: '+=0.2',
    yoyo: true,
    repeat: 5,
    duration: 0.05
  })
  setTimeout(() => {
    showDamageFlash.value = false
  }, 200)
}

const defeat = async () => {
  // Epic explosion
  // Shatter into pieces
  // Victory flash
}

defineExpose({ takeDamage, defeat })
</script>
```

### VS Code Boss Component

```vue
<!-- BossVSCode.vue -->
<template>
  <TresGroup>
    <!-- Main cube body -->
    <TresMesh>
      <TresBoxGeometry :args="[2, 2, 2]" />
      <TresMeshStandardMaterial :color="'#007acc'" :emissive="'#007acc'" :emissiveIntensity="0.3" />
    </TresMesh>

    <!-- Code brackets floating around -->
    <TresText text="{" :position="[-1.5, 0, 1]" :fontSize="0.8" color="#ffffff" />
    <TresText text="}" :position="[1.5, 0, 1]" :fontSize="0.8" color="#ffffff" />
  </TresGroup>
</template>
```

## Acceptance Criteria

- Each boss has unique 3D representation
- Menacing idle animation
- Damage feedback clear
- Health bar visible and accurate
- Defeat animation is satisfying
- Recognizable as the app they represent

## Notes

Bosses should feel like worthy opponents - intimidating but beatable.
