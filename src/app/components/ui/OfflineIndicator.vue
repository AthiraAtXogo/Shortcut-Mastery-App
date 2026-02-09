<script setup lang="ts">
const { isOnline } = useNetworkStatus()
const show = ref(false)

watch(isOnline, (online) => {
  if (!online) {
    show.value = true
  } else {
    // Show "back online" briefly then hide
    setTimeout(() => {
      show.value = false
    }, 2000)
  }
})
</script>

<template>
  <Transition name="slide">
    <div
      v-if="show"
      class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium"
      :class="isOnline ? 'bg-success-600' : 'bg-error-600'"
    >
      <UIcon :name="isOnline ? 'i-lucide-wifi' : 'i-lucide-wifi-off'" class="size-4" />
      <span>{{ isOnline ? 'Back online' : 'You are offline' }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
