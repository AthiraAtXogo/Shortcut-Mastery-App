<script setup lang="ts">
// #region composables
const { pressedKeys, isCapturing, lastKeyCombo, startCapture, stopCapture, getCurrentCombo } = useKeyCapture()
// #endregion

// #region state
const history = ref<string[]>([])

watch(lastKeyCombo, (combo) => {
  if (combo.length === 0) return
  const str = combo.join(' + ')
  if (history.value[0] !== str) {
    history.value.unshift(str)
    if (history.value.length > 10) history.value.pop()
  }
})
// #endregion
</script>

<template>
  <div class="test-page">
    <div class="card">
      <h2>Key Capture Test</h2>
      <p class="subtitle">
        Tests useKeyCapture composable
      </p>

      <div class="controls">
        <button
          :class="isCapturing ? 'btn-stop' : 'btn-start'"
          @click="isCapturing ? stopCapture() : startCapture()"
        >
          {{ isCapturing ? 'Stop Capture' : 'Start Capture' }}
        </button>
      </div>

      <div class="status">
        <div class="status-row">
          <span class="label">Capturing:</span>
          <span :class="isCapturing ? 'green' : 'red'">{{ isCapturing ? 'YES' : 'NO' }}</span>
        </div>
        <div class="status-row">
          <span class="label">Pressed now:</span>
          <span class="keys">
            <span
              v-if="pressedKeys.size === 0"
              class="dim"
            >none</span>
            <kbd
              v-for="k in pressedKeys"
              :key="k"
            >{{ k }}</kbd>
          </span>
        </div>
        <div class="status-row">
          <span class="label">Current combo:</span>
          <span class="combo">
            {{ getCurrentCombo().join(' + ') || '—' }}
          </span>
        </div>
      </div>

      <div class="history">
        <div class="history-title">
          Recent combos:
        </div>
        <div
          v-for="(entry, i) in history"
          :key="i"
          class="history-entry"
          :class="{ fresh: i === 0 }"
        >
          {{ entry }}
        </div>
        <div
          v-if="history.length === 0"
          class="dim"
        >
          Start capture and press keys...
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test-page {
  min-height: 100vh;
  background: #0a0a0f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
}

.card {
  background: #12121a;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 2rem;
  width: min(500px, 90vw);
}

h2 {
  color: #fff;
  margin: 0 0 0.25rem;
  font-size: 1.4rem;
}

.subtitle {
  color: #444;
  font-size: 0.8rem;
  margin: 0 0 1.5rem;
}

.controls {
  margin-bottom: 1.5rem;
}

button {
  padding: 0.5rem 1.4rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-start {
  background: #1e1e2e;
  color: #00d4ff;
  border: 1px solid #00d4ff;
}

.btn-start:hover {
  background: #00d4ff22;
}

.btn-stop {
  background: #1e1e2e;
  color: #f87171;
  border: 1px solid #f87171;
}

.btn-stop:hover {
  background: #f8717122;
}

.status {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #0a0a0f;
  border-radius: 8px;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.label {
  color: #555;
  width: 110px;
  flex-shrink: 0;
  font-size: 0.85rem;
}

.green { color: #4ade80; }
.red { color: #f87171; }
.dim { color: #333; }

.keys {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}

kbd {
  background: #1e1e2e;
  border: 1px solid #a855f7;
  border-radius: 4px;
  padding: 0.1rem 0.4rem;
  font-family: monospace;
  font-size: 0.8rem;
  color: #a855f7;
}

.combo {
  color: #00d4ff;
  font-size: 0.95rem;
}

.history {
  border-top: 1px solid #1a1a2e;
  padding-top: 1rem;
}

.history-title {
  color: #444;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.history-entry {
  color: #555;
  font-size: 0.85rem;
  padding: 0.2rem 0;
  transition: color 0.3s;
}

.history-entry.fresh {
  color: #00d4ff;
}
</style>
