<script setup lang="ts">
// #region setup
definePageMeta({ layout: false })
// #endregion

// #region composables
const router = useRouter()
const route = useRoute()
const gameStore = useGameStore()
// #endregion

// #region state
const animated = ref(false)

const score = computed(() => Number(route.query.score) || gameStore.score)
const correct = computed(() => Number(route.query.correct) || gameStore.shortcutsCorrect)
const attempted = computed(() => Number(route.query.attempted) || gameStore.shortcutsAttempted)
const bestStreak = computed(() => Number(route.query.streak) || gameStore.bestStreak)
const mode = computed(() => (route.query.mode as string) || gameStore.mode)
const elapsed = computed(() => Number(route.query.elapsed) || 0)

const accuracy = computed(() =>
  attempted.value > 0 ? Math.round((correct.value / attempted.value) * 100) : 0
)

const grade = computed(() => {
  const acc = accuracy.value
  if (acc >= 95) return { letter: 'S', color: '#f59e0b', label: 'PERFECT' }
  if (acc >= 85) return { letter: 'A', color: '#00d4ff', label: 'EXCELLENT' }
  if (acc >= 70) return { letter: 'B', color: '#4ade80', label: 'GREAT' }
  if (acc >= 50) return { letter: 'C', color: '#a855f7', label: 'GOOD' }
  return { letter: 'D', color: '#f87171', label: 'KEEP PRACTICING' }
})

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function playAgain() {
  gameStore.reset()
  router.push(`/game?mode=${mode.value}`)
}

function goHome() {
  gameStore.reset()
  router.push('/')
}
// #endregion

// #region lifecycle
onMounted(() => {
  setTimeout(() => {
    animated.value = true
  }, 100)
})
// #endregion
</script>

<template>
  <div class="results-screen">
    <ThreeNeuralBackground />

    <!-- Grade -->
    <div
      class="results-grade"
      :class="{ 'results-grade--animated': animated }"
    >
      <div
        class="grade-letter"
        :style="{ color: grade.color, textShadow: `0 0 40px ${grade.color}` }"
      >
        {{ grade.letter }}
      </div>
      <div
        class="grade-label"
        :style="{ color: grade.color }"
      >
        {{ grade.label }}
      </div>
    </div>

    <!-- Score -->
    <div
      class="results-score"
      :class="{ 'results-score--animated': animated }"
    >
      <div class="score-value">
        {{ score.toLocaleString() }}
      </div>
      <div class="score-label">
        POINTS
      </div>
    </div>

    <!-- Stats Grid -->
    <div
      class="results-stats"
      :class="{ 'results-stats--animated': animated }"
    >
      <div class="stat-card">
        <div class="stat-card__icon">
          🎯
        </div>
        <div class="stat-card__value">
          {{ accuracy }}%
        </div>
        <div class="stat-card__label">
          Accuracy
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card__icon">
          ✅
        </div>
        <div class="stat-card__value">
          {{ correct }}/{{ attempted }}
        </div>
        <div class="stat-card__label">
          Correct
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card__icon">
          🔥
        </div>
        <div class="stat-card__value">
          x{{ bestStreak }}
        </div>
        <div class="stat-card__label">
          Best Streak
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card__icon">
          ⏱
        </div>
        <div class="stat-card__value">
          {{ formatTime(elapsed) }}
        </div>
        <div class="stat-card__label">
          Time
        </div>
      </div>
    </div>

    <!-- Mode Badge -->
    <div class="results-mode">
      {{ mode.toUpperCase().replace('-', ' ') }} MODE
    </div>

    <!-- Actions -->
    <div
      class="results-actions"
      :class="{ 'results-actions--animated': animated }"
    >
      <UiGameButton
        variant="primary"
        @click="playAgain"
      >
        ⚡ Play Again
      </UiGameButton>
      <UiGameButton
        variant="secondary"
        @click="goHome"
      >
        🏠 Home
      </UiGameButton>
    </div>
  </div>
</template>

<style scoped>
.results-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 2rem;
}

/* ============ GRADE ============ */
.results-grade {
  text-align: center;
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.results-grade--animated {
  opacity: 1;
  transform: scale(1);
}

.grade-letter {
  font-size: clamp(5rem, 15vw, 9rem);
  font-weight: 900;
  line-height: 1;
}

.grade-label {
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  margin-top: 0.5rem;
}

/* ============ SCORE ============ */
.results-score {
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s;
}

.results-score--animated {
  opacity: 1;
  transform: translateY(0);
}

.score-value {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 900;
  background: linear-gradient(135deg, var(--color-primary-400, #00d4ff), var(--color-secondary-400, #a855f7));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.score-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 0.25rem;
}

/* ============ STATS ============ */
.results-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 700px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease 0.35s, transform 0.5s ease 0.35s;
}

.results-stats--animated {
  opacity: 1;
  transform: translateY(0);
}

.stat-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1.25rem 0.75rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-card__icon {
  font-size: 1.5rem;
}

.stat-card__value {
  font-size: 1.5rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
}

.stat-card__label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
}

/* ============ MODE ============ */
.results-mode {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.3);
  padding: 0.4rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
}

/* ============ ACTIONS ============ */
.results-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s;
}

.results-actions--animated {
  opacity: 1;
  transform: translateY(0);
}

/* ============ RESPONSIVE ============ */
@media (max-width: 600px) {
  .results-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
