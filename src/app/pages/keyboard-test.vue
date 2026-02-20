<script setup lang="ts">
// #region state
const pressedKeys = ref<string[]>([])
const highlightedKeys = ref<string[]>(['KeyC', 'KeyV', 'ControlLeft'])

function handleKeyDown(e: KeyboardEvent) {
  if (!pressedKeys.value.includes(e.code)) {
    pressedKeys.value = [...pressedKeys.value, e.code]
  }
}

function handleKeyUp(e: KeyboardEvent) {
  pressedKeys.value = pressedKeys.value.filter(k => k !== e.code)
}

function toggleHighlight(code: string) {
  if (highlightedKeys.value.includes(code)) {
    highlightedKeys.value = highlightedKeys.value.filter(k => k !== code)
  } else {
    highlightedKeys.value = [...highlightedKeys.value, code]
  }
}
// #endregion

// #region lifecycle
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})
// #endregion
</script>

<template>
  <div class="test-page" tabindex="0">
    <div class="canvas-wrap">
      <Keyboard3D
        :pressed-keys="pressedKeys"
        :highlighted-keys="highlightedKeys"
      />
    </div>

    <div class="controls">
      <p class="hint">Press keys to illuminate them. Click buttons to toggle highlights.</p>
      <div class="btn-row">
        <button
          v-for="code in ['ControlLeft', 'KeyC', 'KeyV', 'KeyZ', 'Space', 'Enter']"
          :key="code"
          :class="{ active: highlightedKeys.includes(code) }"
          @click="toggleHighlight(code)"
        >
          {{ code }}
        </button>
      </div>
      <p class="pressed">Pressed: {{ pressedKeys.join(', ') || 'none' }}</p>
    </div>
  </div>
</template>

<style scoped>
.test-page {
  background: #0a0a0f;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  outline: none;
}

.canvas-wrap {
  width: 900px;
  height: 400px;
  max-width: 95vw;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.hint {
  color: #666;
  font-size: 0.9rem;
  font-family: monospace;
}

.btn-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-row button {
  padding: 0.4rem 0.9rem;
  background: #1e1e2e;
  color: #aaa;
  border: 1px solid #333;
  border-radius: 6px;
  font-family: monospace;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-row button.active {
  background: #00d4ff22;
  border-color: #00d4ff;
  color: #00d4ff;
}

.pressed {
  color: #555;
  font-size: 0.85rem;
  font-family: monospace;
}
</style>
