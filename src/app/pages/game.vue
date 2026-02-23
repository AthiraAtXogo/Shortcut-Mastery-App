<script setup lang="ts">
import type { GameMode } from '~/types'
import { ALL_SHORTCUTS } from '~/data/shortcuts'

// #region setup
definePageMeta({ layout: false })

interface ShortcutChallenge {
  id: string
  action: string
  description: string
  app: string
  keys: string[]
  keysDisplay: string
  difficulty: string
}
// #endregion

// #region composables
const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()
const { onCorrect, onWrong, onCombo } = useInputFeedback()
const { startCapture, stopCapture, pressedKeys: pressedKeysSet } = useKeyCapture()
// #endregion

// #region state
const mode = computed(() => (route.query.mode as GameMode) ?? 'practice')
const appFilter = computed(() => (route.query.app as string) ?? 'vscode')

const isPaused = ref(false)
const correctKeys = ref<string[]>([])
const wrongKeys = ref<string[]>([])
const feedbackMessage = ref('')
const feedbackType = ref<'correct' | 'wrong' | ''>('')
const feedbackTimer = ref<ReturnType<typeof setTimeout>>()
const challengeIndex = ref(0)
const showHint = ref(false)
const elapsedDisplay = ref('00:00')
const virtualKeys = ref<Set<string>>(new Set())
let elapsedTimer: ReturnType<typeof setInterval>
let elapsedSeconds = 0

const modeLabel: Record<GameMode, string> = {
  'practice': 'PRACTICE',
  'flash-round': 'FLASH ROUND',
  'speed-run': 'SPEED RUN',
  'survival': 'SURVIVAL',
  'time-attack': 'TIME ATTACK',
  'daily-challenge': 'DAILY CHALLENGE',
  'rhythm': 'RHYTHM',
  'memory-match': 'MEMORY MATCH',
  'type-mode': 'TYPE MODE',
  'blind': 'BLIND MODE',
  'boss-battle': 'BOSS BATTLE',
  'endless': 'ENDLESS'
}
// #endregion

// #region computed
const challenges = computed<ShortcutChallenge[]>(() => {
  const pool = ALL_SHORTCUTS.filter(s => s.app === appFilter.value)
  return pool.map(s => ({
    id: s.id,
    action: s.action,
    description: s.description,
    app: s.app,
    keys: s.keys,
    keysDisplay: s.keysDisplay,
    difficulty: s.difficulty
  }))
})

const currentChallenge = computed(() => challenges.value[challengeIndex.value % Math.max(challenges.value.length, 1)])

const progress = computed(() => ({
  current: gameStore.shortcutsAttempted,
  correct: gameStore.shortcutsCorrect,
  total: Math.min(challenges.value.length, 10)
}))

const comboColor = computed(() => {
  if (gameStore.streak >= 10) return '#f59e0b'
  if (gameStore.streak >= 5) return '#a855f7'
  if (gameStore.streak >= 3) return '#00d4ff'
  return '#ffffff'
})

const expectedKeys = computed(() => currentChallenge.value?.keys ?? [])

const allPressedKeys = computed(() => [
  ...Array.from(pressedKeysSet.value),
  ...Array.from(virtualKeys.value)
])

const BROWSER_BLOCKED = new Set(['Ctrl+N', 'Ctrl+T', 'Ctrl+W', 'Ctrl+R', 'Ctrl+L'])

const isOsBlocked = computed(() => {
  const keys = expectedKeys.value
  if (keys.includes('Cmd') || keys.includes('Meta')) return true
  const combo = [...keys].sort().join('+')
  return BROWSER_BLOCKED.has(combo)
})
// #endregion

// #region methods
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function showFeedback(type: 'correct' | 'wrong', message: string) {
  feedbackType.value = type
  feedbackMessage.value = message
  clearTimeout(feedbackTimer.value)
  feedbackTimer.value = setTimeout(() => {
    feedbackType.value = ''
    feedbackMessage.value = ''
  }, 800)
}

function nextChallenge() {
  correctKeys.value = []
  wrongKeys.value = []
  showHint.value = false
  virtualKeys.value = new Set()
  challengeIndex.value++
}

function handleCorrect() {
  correctKeys.value = [...expectedKeys.value]
  gameStore.correctAnswer()
  onCorrect()
  if (gameStore.streak >= 3) onCombo(gameStore.streak)
  showFeedback('correct', gameStore.streak >= 3 ? `🔥 x${gameStore.streak} COMBO!` : '✓ CORRECT!')
  setTimeout(nextChallenge, 600)
}

function handleWrong() {
  wrongKeys.value = [...allPressedKeys.value]
  gameStore.wrongAnswer()
  onWrong()
  showFeedback('wrong', '✗ WRONG')
  setTimeout(() => {
    wrongKeys.value = []
    virtualKeys.value = new Set()
  }, 600)
}

function checkAnswer() {
  if (!currentChallenge.value || isPaused.value) return
  const held = allPressedKeys.value.map(k => k.toLowerCase()).sort()
  const expected = expectedKeys.value.map(k => k.toLowerCase()).sort()
  if (held.length === 0) return
  const isCorrect = held.length === expected.length && held.every((k, i) => k === expected[i])
  if (isCorrect) handleCorrect()
  else if (held.length >= expected.length) handleWrong()
}

function handleKeyClick(key: string) {
  const next = new Set(virtualKeys.value)
  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }
  virtualKeys.value = next
}

function togglePause() {
  isPaused.value = !isPaused.value
  if (isPaused.value) {
    stopCapture()
    gameStore.pauseGame()
  } else {
    startCapture()
    gameStore.resumeGame()
  }
}

function quit() {
  stopCapture()
  clearInterval(elapsedTimer)
  gameStore.endGame()
  router.push('/')
}
// #endregion

// #region watchers
watch(allPressedKeys, checkAnswer, { deep: true })
// #endregion

// #region lifecycle
onMounted(() => {
  gameStore.startGame(mode.value)
  startCapture()
  elapsedTimer = setInterval(() => {
    elapsedSeconds++
    elapsedDisplay.value = formatTime(elapsedSeconds)
  }, 1000)
})

onUnmounted(() => {
  stopCapture()
  clearInterval(elapsedTimer)
  clearTimeout(feedbackTimer.value)
})
// #endregion
</script>

<template>
  <div class="game-screen">
    <!-- Background -->
    <ThreeAuroraTrails v-if="gameStore.streak >= 3" />
    <ThreeNeuralBackground v-else />

    <!-- Header -->
    <header class="game-header">
      <div class="game-header__mode">
        {{ modeLabel[mode] ?? mode.toUpperCase() }}
      </div>
      <div class="game-header__timer">
        ⏱ {{ elapsedDisplay }}
      </div>
      <div class="game-header__progress">
        {{ progress.correct }}/{{ progress.total }}
      </div>
    </header>

    <!-- Progress Bar -->
    <div class="game-progress">
      <div
        class="game-progress__fill"
        :style="{ width: `${(progress.correct / progress.total) * 100}%` }"
      />
    </div>

    <!-- Challenge Card -->
    <div class="game-challenge">
      <UiHoloCard class="game-challenge__card">
        <div class="challenge-content">
          <div class="challenge-app">
            {{ currentChallenge?.app?.toUpperCase() }}
          </div>
          <div class="challenge-action">
            {{ currentChallenge?.action }}
          </div>
          <div class="challenge-description">
            {{ currentChallenge?.description }}
          </div>
          <div
            v-if="showHint"
            class="challenge-hint"
          >
            <kbd
              v-for="key in currentChallenge?.keys"
              :key="key"
              class="hint-key"
            >{{ key }}</kbd>
          </div>
        </div>
      </UiHoloCard>

      <!-- Feedback Overlay -->
      <Transition name="feedback">
        <div
          v-if="feedbackType"
          class="feedback-popup"
          :class="`feedback-popup--${feedbackType}`"
        >
          {{ feedbackMessage }}
        </div>
      </Transition>
    </div>

    <!-- OS-blocked hint -->
    <Transition name="feedback">
      <div
        v-if="isOsBlocked"
        class="os-blocked-hint"
      >
        ⚠️ This shortcut can't be captured by the browser — click the keys below
      </div>
    </Transition>

    <!-- Visual Keyboard -->
    <div class="game-keyboard">
      <VisualKeyboard
        :pressed-keys="allPressedKeys"
        :expected-keys="expectedKeys"
        :correct-keys="correctKeys"
        :wrong-keys="wrongKeys"
        :clickable="true"
        size="sm"
        @key-click="handleKeyClick"
      />
    </div>

    <!-- Footer -->
    <footer class="game-footer">
      <div class="game-footer__combo">
        <span
          v-if="gameStore.streak >= 2"
          class="combo-display"
          :style="{ color: comboColor }"
        >
          🔥 x{{ gameStore.streak }} COMBO
        </span>
      </div>

      <div class="game-footer__score">
        Score: {{ gameStore.score.toLocaleString() }}
      </div>

      <div class="game-footer__actions">
        <button
          v-if="mode === 'practice'"
          class="hint-btn"
          @click="showHint = !showHint"
        >
          💡 Hint
        </button>
        <button
          class="pause-btn"
          @click="togglePause"
        >
          {{ isPaused ? '▶' : '⏸' }}
        </button>
      </div>
    </footer>

    <!-- Pause Menu -->
    <Transition name="pause">
      <div
        v-if="isPaused"
        class="pause-menu"
      >
        <div class="pause-menu__card">
          <h2 class="pause-menu__title">
            PAUSED
          </h2>
          <div class="pause-menu__stats">
            <div>Score: {{ gameStore.score.toLocaleString() }}</div>
            <div>Streak: {{ gameStore.bestStreak }}</div>
            <div>Accuracy: {{ gameStore.accuracy }}%</div>
          </div>
          <div class="pause-menu__actions">
            <UiGameButton
              variant="primary"
              @click="togglePause"
            >
              ▶ Resume
            </UiGameButton>
            <UiGameButton
              variant="ghost"
              @click="quit"
            >
              ✕ Quit
            </UiGameButton>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.game-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
}

/* ============ HEADER ============ */
.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 900px;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  z-index: 10;
}

.game-header__mode {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--color-primary-400, #00d4ff);
}

.game-header__timer {
  font-size: 1.25rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.9);
}

.game-header__progress {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
}

/* ============ PROGRESS BAR ============ */
.game-progress {
  width: 100%;
  max-width: 900px;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
}

.game-progress__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary-400, #00d4ff), var(--color-secondary-400, #a855f7));
  border-radius: 2px;
  transition: width 0.4s ease;
}

/* ============ CHALLENGE ============ */
.game-challenge {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.game-challenge__card {
  width: 100%;
}

.challenge-content {
  padding: 2.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.challenge-app {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.4);
}

.challenge-action {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--color-neutral-100, #fff);
  line-height: 1.2;
}

.challenge-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
}

.challenge-hint {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.hint-key {
  padding: 0.4rem 0.8rem;
  background: rgba(0, 212, 255, 0.15);
  border: 1px solid rgba(0, 212, 255, 0.4);
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.875rem;
  color: #00d4ff;
}

/* ============ FEEDBACK ============ */
.feedback-popup {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  border-radius: 16px;
  pointer-events: none;
}

.feedback-popup--correct {
  background: rgba(34, 197, 94, 0.25);
  color: #4ade80;
  border: 2px solid rgba(74, 222, 128, 0.4);
}

.feedback-popup--wrong {
  background: rgba(239, 68, 68, 0.25);
  color: #f87171;
  border: 2px solid rgba(248, 113, 113, 0.4);
}

.feedback-enter-active,
.feedback-leave-active {
  transition: opacity 0.2s ease;
}

.feedback-enter-from,
.feedback-leave-to {
  opacity: 0;
}

/* ============ OS BLOCKED HINT ============ */
.os-blocked-hint {
  font-size: 0.75rem;
  font-weight: 600;
  color: #fbbf24;
  text-align: center;
  padding: 0.4rem 1.25rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 8px;
  width: 100%;
  max-width: 900px;
}

/* ============ KEYBOARD ============ */
.game-keyboard {
  width: 100%;
  max-width: 900px;
}

/* ============ FOOTER ============ */
.game-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 900px;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
}

.game-footer__combo {
  min-width: 150px;
}

.combo-display {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-shadow: 0 0 20px currentColor;
}

.game-footer__score {
  font-size: 1.25rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
}

.game-footer__actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.hint-btn,
.pause-btn {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.hint-btn:hover,
.pause-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* ============ PAUSE MENU ============ */
.pause-menu {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 100;
}

.pause-menu__card {
  background: rgba(15, 15, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 320px;
}

.pause-menu__title {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.9);
}

.pause-menu__stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.pause-menu__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pause-enter-active,
.pause-leave-active {
  transition: opacity 0.2s ease;
}

.pause-enter-from,
.pause-leave-to {
  opacity: 0;
}

/* ============ RESPONSIVE ============ */
@media (max-width: 768px) {
  .game-screen {
    padding: 1rem;
    gap: 1rem;
  }

  .challenge-content {
    padding: 1.5rem 1rem;
  }
}
</style>
