<script setup lang="ts">
// #region setup
definePageMeta({ layout: false })
// #endregion

// #region composables
const router = useRouter()
// #endregion

// #region state
const soundEnabled = ref(true)
const hapticEnabled = ref(true)
const reducedMotion = ref(false)
const defaultApp = ref('vscode')
const defaultMode = ref('practice')
const showHints = ref(true)
const theme = ref<'dark' | 'darker'>('dark')

const APPS = ['windows', 'macos', 'vscode', 'chrome', 'claude', 'chatgpt', 'notion']
const MODES = ['practice', 'flash-round', 'speed-run', 'survival', 'time-attack']
// #endregion
</script>

<template>
  <div class="settings-screen">
    <ThreeNeuralBackground />

    <!-- Header -->
    <header class="settings-header">
      <button
        class="back-btn"
        @click="router.push('/')"
      >
        ← Back
      </button>
      <h1 class="settings-title">
        Settings
      </h1>
    </header>

    <div class="settings-content">
      <!-- Audio & Haptics -->
      <section class="settings-section">
        <h2 class="section-label">
          Audio & Feedback
        </h2>
        <div class="settings-group">
          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-name">Sound Effects</span>
              <span class="setting-desc">Tones on correct/wrong answers</span>
            </div>
            <button
              class="toggle-btn"
              :class="{ 'toggle-btn--on': soundEnabled }"
              @click="soundEnabled = !soundEnabled"
            >
              {{ soundEnabled ? 'ON' : 'OFF' }}
            </button>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-name">Haptic Feedback</span>
              <span class="setting-desc">Vibration on mobile devices</span>
            </div>
            <button
              class="toggle-btn"
              :class="{ 'toggle-btn--on': hapticEnabled }"
              @click="hapticEnabled = !hapticEnabled"
            >
              {{ hapticEnabled ? 'ON' : 'OFF' }}
            </button>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-name">Reduced Motion</span>
              <span class="setting-desc">Minimize animations</span>
            </div>
            <button
              class="toggle-btn"
              :class="{ 'toggle-btn--on': reducedMotion }"
              @click="reducedMotion = !reducedMotion"
            >
              {{ reducedMotion ? 'ON' : 'OFF' }}
            </button>
          </div>
        </div>
      </section>

      <!-- Gameplay -->
      <section class="settings-section">
        <h2 class="section-label">
          Gameplay
        </h2>
        <div class="settings-group">
          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-name">Show Hints</span>
              <span class="setting-desc">Show hint button in practice mode</span>
            </div>
            <button
              class="toggle-btn"
              :class="{ 'toggle-btn--on': showHints }"
              @click="showHints = !showHints"
            >
              {{ showHints ? 'ON' : 'OFF' }}
            </button>
          </div>

          <div class="setting-row setting-row--column">
            <div class="setting-info">
              <span class="setting-name">Default Application</span>
              <span class="setting-desc">App used for Quick Play</span>
            </div>
            <div class="chip-group">
              <button
                v-for="app in APPS"
                :key="app"
                class="chip"
                :class="{ 'chip--active': defaultApp === app }"
                @click="defaultApp = app"
              >
                {{ app }}
              </button>
            </div>
          </div>

          <div class="setting-row setting-row--column">
            <div class="setting-info">
              <span class="setting-name">Default Mode</span>
              <span class="setting-desc">Mode used for Quick Play</span>
            </div>
            <div class="chip-group">
              <button
                v-for="mode in MODES"
                :key="mode"
                class="chip"
                :class="{ 'chip--active': defaultMode === mode }"
                @click="defaultMode = mode"
              >
                {{ mode.replace('-', ' ') }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Theme -->
      <section class="settings-section">
        <h2 class="section-label">
          Appearance
        </h2>
        <div class="settings-group">
          <div class="setting-row setting-row--column">
            <div class="setting-info">
              <span class="setting-name">Theme</span>
            </div>
            <div class="chip-group">
              <button
                class="chip"
                :class="{ 'chip--active': theme === 'dark' }"
                @click="theme = 'dark'"
              >
                Dark
              </button>
              <button
                class="chip"
                :class="{ 'chip--active': theme === 'darker' }"
                @click="theme = 'darker'"
              >
                Darker
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Save -->
      <div class="settings-save">
        <UiGameButton
          variant="primary"
          @click="router.push('/')"
        >
          ✓ Save & Close
        </UiGameButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1.5rem;
}

/* ============ HEADER ============ */
.settings-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.settings-title {
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

/* ============ CONTENT ============ */
.settings-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
}

.section-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.75rem;
}

/* ============ SETTINGS GROUP ============ */
.settings-group {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  overflow: hidden;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  gap: 1rem;
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-row--column {
  flex-direction: column;
  align-items: flex-start;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.setting-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

.setting-desc {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

/* ============ TOGGLE ============ */
.toggle-btn {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 64px;
  text-align: center;
  flex-shrink: 0;
}

.toggle-btn--on {
  background: rgba(74, 222, 128, 0.15);
  border-color: rgba(74, 222, 128, 0.4);
  color: #4ade80;
}

/* ============ CHIPS ============ */
.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.chip {
  padding: 0.35rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: capitalize;
}

.chip--active {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.4);
  color: #00d4ff;
}

/* ============ SAVE ============ */
.settings-save {
  display: flex;
  justify-content: center;
  padding-bottom: 2rem;
}
</style>
