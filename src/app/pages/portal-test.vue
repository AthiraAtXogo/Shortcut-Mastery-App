<script setup lang="ts">
// #region state
const portalRef = ref<{ trigger: () => void }>()

function fire() {
  portalRef.value?.trigger()
}
// #endregion
</script>

<template>
  <div class="test-page">
    <ClientOnly>
      <ThreePortalVortex ref="portalRef" />
    </ClientOnly>

    <div class="info">
      <h2>Portal Vortex Test</h2>
      <p>Level-up celebration effect</p>
      <button @click="fire">
        Trigger Portal
      </button>
    </div>
  </div>
</template>

<style scoped>
.test-page {
  position: relative;
  min-height: 100vh;
  background: #0a0a0f;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.info {
  text-align: center;
  color: #aaa;
  font-family: monospace;
  z-index: 1;
}

.info h2 {
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.info p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.info button {
  padding: 0.6rem 1.8rem;
  background: #1e1e2e;
  color: #a855f7;
  border: 1px solid #a855f7;
  border-radius: 8px;
  font-family: monospace;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.info button:hover {
  background: #a855f722;
  color: #fff;
}
</style>
