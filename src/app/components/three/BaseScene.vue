<script setup lang="ts">
interface Props {
  clearColor?: string
  antialias?: boolean
}

withDefaults(defineProps<Props>(), {
  clearColor: '#0a0a0f',
  antialias: true
})
</script>

<template>
  <TresCanvas
    :clear-color="clearColor"
    :antialias="antialias"
    power-preference="high-performance"
    window-size
  >
    <TresPerspectiveCamera :position="[0, 0, 5]" :fov="75" />
    <slot />
  </TresCanvas>
</template>
