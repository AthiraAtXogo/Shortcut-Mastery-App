<script setup lang="ts">
// #region composables
const { pressedKeys, isCapturing, startCapture, stopCapture } = useKeyCapture()
// #endregion

// #region state
const size = ref<'sm' | 'md' | 'lg'>('md')

// Demo: cycle through states every 2s when not capturing
const demoExpected = ref(['Ctrl', 'C'])
const demoCorrect = ref<string[]>([])
const demoWrong = ref<string[]>([])

const DEMO_CYCLES = [
  { expected: ['Ctrl', 'C'], correct: [], wrong: [] },
  { expected: ['Ctrl', 'C'], correct: ['Ctrl', 'C'], wrong: [] },
  { expected: ['Ctrl', 'Z'], correct: [], wrong: ['Ctrl', 'C'] },
  { expected: ['Shift', 'A'], correct: [], wrong: [] }
]
let demoIdx = 0

const demoInterval = ref<ReturnType<typeof setInterval>>()

function startDemo() {
  demoInterval.value = setInterval(() => {
    demoIdx = (demoIdx + 1) % DEMO_CYCLES.length
    const c = DEMO_CYCLES[demoIdx]!
    demoExpected.value = c.expected
    demoCorrect.value = c.correct
    demoWrong.value = c.wrong
  }, 2000)
}

// Convert pressedKeys Set to array for keyboard component
const pressedArray = computed(() => Array.from(pressedKeys.value))
// #endregion

// #region lifecycle
onMounted(() => startDemo())
onUnmounted(() => clearInterval(demoInterval.value))
// #endregion
</script>

<template>
  <div class="test-page">
    <div class="card">
      <h2>Visual Keyboard Test</h2>
      <p class="subtitle">
        Tests VisualKeyboard component
      </p>

      <div class="section">
        <div class="section-title">
          Size:
        </div>
        <div class="size-btns">
          <button
            v-for="s in ['sm', 'md', 'lg']"
            :key="s"
            class="size-btn"
            :class="{ active: size === s }"
            @click="size = s as 'sm' | 'md' | 'lg'"
          >
            {{ s }}
          </button>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          Demo states (auto-cycling):
        </div>
        <div class="legend">
          <span class="legend-item expected">■ Expected (pulsing)</span>
          <span class="legend-item correct">■ Correct</span>
          <span class="legend-item wrong">■ Wrong</span>
        </div>
        <div class="keyboard-wrap">
          <VisualKeyboard
            :size="size"
            :expected-keys="demoExpected"
            :correct-keys="demoCorrect"
            :wrong-keys="demoWrong"
          />
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          Live key press (press keys):
        </div>
        <div class="controls">
          <button
            :class="isCapturing ? 'btn-stop' : 'btn-start'"
            @click="isCapturing ? stopCapture() : startCapture()"
          >
            {{ isCapturing ? 'Stop Capture' : 'Start Capture' }}
          </button>
        </div>
        <div class="keyboard-wrap">
          <VisualKeyboard
            :size="size"
            :pressed-keys="pressedArray"
          />
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
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: monospace;
}

.card {
  background: #12121a;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 2rem;
  width: min(900px, 95vw);
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

.section {
  margin-bottom: 2rem;
}

.section-title {
  color: #444;
  font-size: 0.78rem;
  margin-bottom: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.size-btns {
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.35rem 1rem;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s;
}

.size-btn {
  background: #0a0a0f;
  border: 1px solid #333;
  color: #555;
}

.size-btn:hover { border-color: #555; color: #888; }
.size-btn.active { border-color: #a855f7; color: #a855f7; background: #a855f722; }

.controls { margin-bottom: 0.8rem; }

.btn-start { background: #1e1e2e; color: #00d4ff; border: 1px solid #00d4ff; }
.btn-start:hover { background: #00d4ff22; }
.btn-stop { background: #1e1e2e; color: #f87171; border: 1px solid #f87171; }
.btn-stop:hover { background: #f8717122; }

.legend {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.78rem;
}

.legend-item { display: flex; align-items: center; gap: 0.3rem; }
.expected { color: #a855f7; }
.correct { color: #4ade80; }
.wrong { color: #f87171; }

.keyboard-wrap {
  overflow-x: auto;
  padding-bottom: 4px;
}
</style>
