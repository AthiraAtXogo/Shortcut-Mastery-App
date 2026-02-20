<script setup lang="ts">
// #region composables
const { pressedKeys, isCapturing, lastKeyCombo, startCapture, stopCapture } = useKeyCapture()
const { validate, normalizeCombo, validateWithTimeout } = useComboValidator()
// #endregion

// #region state
const TEST_COMBOS = [
  ['Ctrl/Cmd', 'C'],
  ['Ctrl/Cmd', 'Shift', 'Z'],
  ['Alt', 'F4'],
  ['Ctrl', 'Alt', 'Delete']
]

const selectedCombo = ref(0)
const lastResult = ref<import('~/composables/useComboValidator').ValidationResult | null>(null)
const timedResult = ref<import('~/composables/useComboValidator').ValidationResult | null>(null)
const timedRunning = ref(false)
const timedCountdown = ref(0)

const expected = computed(() => TEST_COMBOS[selectedCombo.value]!)
const normalizedExpected = computed(() => normalizeCombo(expected.value))
// #endregion

// #region watchers
watch(lastKeyCombo, (combo) => {
  if (!isCapturing.value || combo.length === 0) return
  lastResult.value = validate(combo, expected.value, { allowPartial: true })
})
// #endregion

// #region handlers
async function runTimedTest() {
  if (timedRunning.value) return
  timedRunning.value = true
  timedResult.value = null
  timedCountdown.value = 3

  const countInterval = setInterval(() => {
    timedCountdown.value--
    if (timedCountdown.value <= 0) clearInterval(countInterval)
  }, 1000)

  timedResult.value = await validateWithTimeout(expected.value, 3000)
  timedRunning.value = false
}
// #endregion
</script>

<template>
  <div class="test-page">
    <div class="card">
      <h2>Combo Validator Test</h2>
      <p class="subtitle">
        Tests useComboValidator composable
      </p>

      <div class="section">
        <div class="section-title">
          Target combo:
        </div>
        <div class="target-row">
          <button
            v-for="(combo, i) in TEST_COMBOS"
            :key="i"
            class="combo-btn"
            :class="{ active: selectedCombo === i }"
            @click="selectedCombo = i; lastResult = null"
          >
            {{ combo.join(' + ') }}
          </button>
        </div>
        <div class="normalized">
          Normalized: <span class="cyan">{{ normalizedExpected.join(' + ') }}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          Live validation (capture mode):
        </div>
        <div class="controls">
          <button
            :class="isCapturing ? 'btn-stop' : 'btn-start'"
            @click="isCapturing ? stopCapture() : startCapture()"
          >
            {{ isCapturing ? 'Stop Capture' : 'Start Capture' }}
          </button>
        </div>

        <div class="pressed-row">
          <span class="label">Pressed:</span>
          <kbd
            v-for="k in pressedKeys"
            :key="k"
          >{{ k }}</kbd>
          <span
            v-if="pressedKeys.size === 0"
            class="dim"
          >none</span>
        </div>

        <div
          v-if="lastResult"
          class="result-card"
          :class="lastResult.isCorrect ? 'correct' : lastResult.isPartial ? 'partial' : 'wrong'"
        >
          <div class="result-status">
            {{ lastResult.isCorrect ? '✓ CORRECT' : lastResult.isPartial ? '◑ PARTIAL' : '✗ WRONG' }}
          </div>
          <div class="result-detail">
            <span
              v-if="lastResult.missingKeys.length"
              class="missing"
            >
              Missing: {{ lastResult.missingKeys.join(', ') }}
            </span>
            <span
              v-if="lastResult.extraKeys.length"
              class="extra"
            >
              Extra: {{ lastResult.extraKeys.join(', ') }}
            </span>
            <span
              v-if="lastResult.isCorrect"
              class="dim"
            >Perfect match!</span>
          </div>
        </div>
        <div
          v-else
          class="dim"
        >
          Press keys while capturing...
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          Timed validation (3 second window):
        </div>
        <div class="controls">
          <button
            class="btn-timed"
            :disabled="timedRunning"
            @click="runTimedTest"
          >
            {{ timedRunning ? `Listening... ${timedCountdown}s` : 'Start 3s Test' }}
          </button>
        </div>

        <div
          v-if="timedResult"
          class="result-card"
          :class="timedResult.isCorrect ? 'correct' : 'wrong'"
        >
          <div class="result-status">
            {{ timedResult.isTimeout ? '⏱ TIMEOUT' : timedResult.isCorrect ? '✓ CORRECT' : '✗ WRONG' }}
          </div>
          <div class="result-detail">
            <span class="dim">Time: {{ timedResult.timing }}ms</span>
            <span
              v-if="timedResult.missingKeys.length"
              class="missing"
            >
              &nbsp;· Missing: {{ timedResult.missingKeys.join(', ') }}
            </span>
          </div>
        </div>
        <div
          v-else-if="!timedRunning"
          class="dim"
        >
          Click to start timed validation test.
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
  width: min(600px, 90vw);
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
  margin-bottom: 1.6rem;
}

.section-title {
  color: #444;
  font-size: 0.78rem;
  margin-bottom: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.target-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.combo-btn {
  background: #0a0a0f;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 0.3rem 0.7rem;
  color: #555;
  font-family: monospace;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
}

.combo-btn:hover { border-color: #555; color: #888; }
.combo-btn.active { border-color: #a855f7; color: #a855f7; background: #a855f722; }

.normalized {
  font-size: 0.82rem;
  color: #555;
}

.cyan { color: #00d4ff; }

.controls { margin-bottom: 0.8rem; }

button {
  padding: 0.45rem 1.2rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

button:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-start { background: #1e1e2e; color: #00d4ff; border: 1px solid #00d4ff; }
.btn-start:hover { background: #00d4ff22; }
.btn-stop { background: #1e1e2e; color: #f87171; border: 1px solid #f87171; }
.btn-stop:hover { background: #f8717122; }
.btn-timed { background: #1e1e2e; color: #a855f7; border: 1px solid #a855f7; }
.btn-timed:not(:disabled):hover { background: #a855f722; }

.pressed-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 0.8rem;
  min-height: 28px;
}

.label { color: #444; font-size: 0.82rem; margin-right: 0.25rem; }

kbd {
  background: #1e1e2e;
  border: 1px solid #a855f7;
  border-radius: 4px;
  padding: 0.1rem 0.4rem;
  font-family: monospace;
  font-size: 0.8rem;
  color: #a855f7;
}

.dim { color: #333; font-size: 0.82rem; }

.result-card {
  border-radius: 8px;
  padding: 0.75rem 1rem;
  border: 1px solid;
}

.result-card.correct { border-color: #4ade80; background: #4ade8010; }
.result-card.partial { border-color: #facc15; background: #facc1510; }
.result-card.wrong { border-color: #f87171; background: #f8717110; }

.result-status {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.correct .result-status { color: #4ade80; }
.partial .result-status { color: #facc15; }
.wrong .result-status { color: #f87171; }

.result-detail { font-size: 0.8rem; }

.missing { color: #f87171; }
.extra { color: #fb923c; }
</style>
