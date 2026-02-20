<script setup lang="ts">
// #region state
const selected = ref<string | null>(null)

function onSelect(id: string) {
  selected.value = id
}
// #endregion
</script>

<template>
  <div class="test-page">
    <div class="stage">
      <ClientOnly>
        <ThreeFloatingIcons @select="onSelect" />
      </ClientOnly>
    </div>

    <div class="info">
      <h2>Floating Icons Test</h2>
      <p v-if="selected">
        Selected: <span class="selected">{{ selected }}</span>
      </p>
      <p v-else>
        Hover to highlight · Click to select
      </p>
    </div>
  </div>
</template>

<style scoped>
.test-page {
  position: relative;
  min-height: 100vh;
  background: #0a0a0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.stage {
  width: min(700px, 95vw);
  height: 380px;
  margin-bottom: 1.5rem;
}

.info {
  text-align: center;
  color: #aaa;
  font-family: monospace;
  z-index: 1;
}

.info h2 {
  font-size: 1.4rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.info p {
  font-size: 0.9rem;
  color: #666;
}

.selected {
  color: #a855f7;
  font-weight: bold;
}
</style>
