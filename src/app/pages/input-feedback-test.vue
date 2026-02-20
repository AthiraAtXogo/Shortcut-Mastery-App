<script setup lang="ts">
// #region composables
const { pressedKeys, isCapturing, lastKeyCombo, startCapture, stopCapture } = useKeyCapture()
const feedback = useInputFeedback()
// #endregion

// #region state
const demoRef = ref<HTMLElement>()
const comboLevel = ref(0)
const streakLevel = ref(0)
const lastEvent = ref('')
// #endregion

// #region watchers
watch(lastKeyCombo, (combo, prev) => {
  if (!isCapturing.value || combo.length === 0) return
  const newKeys = combo.filter(k => !prev?.includes(k))
  newKeys.forEach(k => feedback.onKeyPress(k))
})
// #endregion

// #region handlers
function triggerCorrect() {
  lastEvent.value = 'CORRECT'
  feedback.onCorrect(demoRef.value)
}

function triggerWrong() {
  lastEvent.value = 'WRONG'
  feedback.onWrong(demoRef.value)
}

function triggerCombo() {
  comboLevel.value++
  lastEvent.value = `COMBO x${comboLevel.value}`
  feedback.onCombo(comboLevel.value)
}

function triggerStreak() {
  streakLevel.value += 5
  lastEvent.value = `STREAK ${streakLevel.value}`
  feedback.onStreak(streakLevel.value)
}

function resetCounters() {
  comboLevel.value = 0
  streakLevel.value = 0
  lastEvent.value = ''
}
// #endregion
</script>

<template>
  <div class="test-page">
    <div class="card">
      <h2>Input Feedback Test</h2>
      <p class="subtitle">
        Tests useInputFeedback composable
      </p>

      <div class="section">
        <div class="section-title">
          Settings:
        </div>
        <div class="toggles">
          <label class="toggle">
            <input
              v-model="feedback.soundEnabled.value"
              type="checkbox"
            >
            Sound {{ feedback.soundEnabled.value ? 'ON' : 'OFF' }}
          </label>
          <label class="toggle">
            <input
              v-model="feedback.hapticEnabled.value"
              type="checkbox"
            >
            Haptic {{ feedback.hapticEnabled.value ? 'ON' : 'OFF' }}
          </label>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          Demo target element:
        </div>
        <div
          ref="demoRef"
          class="demo-box"
        >
          {{ lastEvent || 'Click buttons below to trigger feedback' }}
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          Trigger feedback events:
        </div>
        <div class="btn-grid">
          <button
            class="btn-correct"
            @click="triggerCorrect"
          >
            Correct
          </button>
          <button
            class="btn-wrong"
            @click="triggerWrong"
          >
            Wrong
          </button>
          <button
            class="btn-combo"
            @click="triggerCombo"
          >
            Combo (x{{ comboLevel + 1 }})
          </button>
          <button
            class="btn-streak"
            @click="triggerStreak"
          >
            Streak ({{ streakLevel + 5 }})
          </button>
          <button
            class="btn-reset"
            @click="resetCounters"
          >
            Reset
          </button>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          Live key press sounds (start capture + press keys):
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
      </div>
    </div>
  </div>
</template>

<style>
/* Global: CSS classes applied by useInputFeedback to any element */
.vk-feedback-press {
  transform: scale(0.95) translateY(1px) !important;
  transition: transform 0.08s !important;
}

.vk-feedback-correct {
  animation: feedback-correct 0.5s ease-out !important;
}

.vk-feedback-wrong {
  animation: feedback-wrong 0.45s ease-out !important;
}

@keyframes feedback-correct {
  0%   { box-shadow: 0 0 0 0 #4ade8000; }
  30%  { box-shadow: 0 0 30px 8px #4ade80cc; background-color: #4ade8022; }
  100% { box-shadow: 0 0 0 0 #4ade8000; background-color: transparent; }
}

@keyframes feedback-wrong {
  0%   { transform: translateX(0); background-color: transparent; }
  15%  { transform: translateX(-6px); background-color: #f8717122; }
  30%  { transform: translateX(6px); }
  45%  { transform: translateX(-4px); }
  60%  { transform: translateX(4px); }
  75%  { transform: translateX(-2px); }
  100% { transform: translateX(0); background-color: transparent; }
}
</style>

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
  width: min(560px, 90vw);
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

.toggles {
  display: flex;
  gap: 1.5rem;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #888;
  font-size: 0.85rem;
  cursor: pointer;
}

.toggle input { cursor: pointer; accent-color: #a855f7; }

.demo-box {
  background: #0a0a0f;
  border: 1px solid #1a1a2e;
  border-radius: 10px;
  padding: 1.2rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.btn-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

button {
  padding: 0.45rem 1rem;
  border-radius: 7px;
  font-family: monospace;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-correct { background: #1e2e1e; color: #4ade80; border: 1px solid #4ade80; }
.btn-correct:hover { background: #4ade8020; }
.btn-wrong { background: #2e1e1e; color: #f87171; border: 1px solid #f87171; }
.btn-wrong:hover { background: #f8717120; }
.btn-combo { background: #1e1e2e; color: #00d4ff; border: 1px solid #00d4ff; }
.btn-combo:hover { background: #00d4ff20; }
.btn-streak { background: #2a1e2e; color: #a855f7; border: 1px solid #a855f7; }
.btn-streak:hover { background: #a855f720; }
.btn-reset { background: #1a1a1a; color: #555; border: 1px solid #333; }
.btn-reset:hover { background: #222; color: #888; }

.controls { margin-bottom: 0.8rem; }

.btn-start { background: #1e1e2e; color: #00d4ff; border: 1px solid #00d4ff; }
.btn-start:hover { background: #00d4ff22; }
.btn-stop { background: #1e1e2e; color: #f87171; border: 1px solid #f87171; }
.btn-stop:hover { background: #f8717122; }

.pressed-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
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
</style>
