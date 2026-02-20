<script setup lang="ts">
</script>

<template>
  <div class="test-page">
    <ClientOnly>
      <ThreeNeuralBackground :node-count="80" />
    </ClientOnly>

    <div class="info">
      <h2>Neural Background Test</h2>
      <p>80 nodes, drift animation, pulse effect</p>
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
}
</style>
