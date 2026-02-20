<script setup lang="ts">
import { ALL_SHORTCUTS } from '~/data/shortcuts'

// #region setup
definePageMeta({ layout: false })
// #endregion

// #region composables
const router = useRouter()
const userStore = useUserStore()

if (import.meta.client) {
  userStore.loadFromDatabase()
}
// #endregion

// #region computed
const totalTimePlayed = computed(() => {
  const ms = userStore.totalTimePlayed
  const hours = Math.floor(ms / 3_600_000)
  const mins = Math.floor((ms % 3_600_000) / 60_000)
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
})

const totalAvailable = computed(() => ALL_SHORTCUTS.length)

const masteryPercent = computed(() =>
  totalAvailable.value > 0
    ? Math.min(Math.round((userStore.totalShortcutsLearned / totalAvailable.value) * 100), 100)
    : 0
)

const RANK_THRESHOLDS = [
  { rank: 'Novice', min: 1, max: 4 },
  { rank: 'Beginner', min: 5, max: 9 },
  { rank: 'Intermediate', min: 10, max: 19 },
  { rank: 'Advanced', min: 20, max: 29 },
  { rank: 'Expert', min: 30, max: 39 },
  { rank: 'Master', min: 40, max: 49 },
  { rank: 'Grandmaster', min: 50, max: Infinity }
]

const nextRank = computed(() => {
  const current = RANK_THRESHOLDS.find(r => userStore.level >= r.min && userStore.level <= r.max)
  const idx = RANK_THRESHOLDS.findIndex(r => r.rank === current?.rank)
  return RANK_THRESHOLDS[idx + 1] ?? null
})
// #endregion
</script>

<template>
  <div class="dashboard-screen">
    <ThreeNeuralBackground />

    <!-- Header -->
    <header class="dash-header">
      <button
        class="back-btn"
        @click="router.push('/')"
      >
        ← Back
      </button>
      <h1 class="dash-title">
        Progress Dashboard
      </h1>
    </header>

    <div class="dash-content">
      <!-- Profile Card -->
      <section class="profile-card">
        <div class="profile-rank">
          {{ userStore.rank }}
        </div>
        <div class="profile-level">
          Level {{ userStore.level }}
        </div>

        <!-- XP Bar -->
        <div class="xp-bar-wrap">
          <div class="xp-bar-track">
            <div
              class="xp-bar-fill"
              :style="{ width: `${userStore.xpProgress}%` }"
            />
          </div>
          <div class="xp-bar-labels">
            <span>{{ userStore.xp % 1000 }} XP</span>
            <span>{{ userStore.xpToNextLevel }} to next level</span>
          </div>
        </div>

        <div
          v-if="nextRank"
          class="next-rank"
        >
          Next rank: <strong>{{ nextRank.rank }}</strong> at Level {{ nextRank.min }}
        </div>
      </section>

      <!-- Stats Grid -->
      <section class="stats-grid">
        <div class="stat-tile">
          <div class="stat-tile__icon">
            🔥
          </div>
          <div class="stat-tile__value">
            {{ userStore.dailyStreak }}
          </div>
          <div class="stat-tile__label">
            Day Streak
          </div>
        </div>

        <div class="stat-tile">
          <div class="stat-tile__icon">
            ⌨️
          </div>
          <div class="stat-tile__value">
            {{ userStore.totalShortcutsLearned }}
          </div>
          <div class="stat-tile__label">
            Shortcuts Learned
          </div>
        </div>

        <div class="stat-tile">
          <div class="stat-tile__icon">
            ⏱
          </div>
          <div class="stat-tile__value">
            {{ totalTimePlayed }}
          </div>
          <div class="stat-tile__label">
            Time Played
          </div>
        </div>

        <div class="stat-tile">
          <div class="stat-tile__icon">
            🏆
          </div>
          <div class="stat-tile__value">
            {{ userStore.xp }}
          </div>
          <div class="stat-tile__label">
            Total XP
          </div>
        </div>
      </section>

      <!-- Mastery Progress -->
      <section class="mastery-section">
        <h2 class="section-label">
          Overall Mastery
        </h2>
        <div class="mastery-bar-wrap">
          <div class="mastery-bar-track">
            <div
              class="mastery-bar-fill"
              :style="{ width: `${masteryPercent}%` }"
            />
          </div>
          <div class="mastery-labels">
            <span class="mastery-percent">{{ masteryPercent }}%</span>
            <span class="mastery-count">{{ userStore.totalShortcutsLearned }} / {{ totalAvailable }} shortcuts</span>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="quick-actions">
        <h2 class="section-label">
          Continue Learning
        </h2>
        <div class="action-grid">
          <UiGameButton
            variant="primary"
            @click="router.push('/category-select?mode=practice')"
          >
            ⚡ Practice
          </UiGameButton>
          <UiGameButton
            variant="secondary"
            @click="router.push('/category-select?mode=speed-run')"
          >
            🏃 Speed Run
          </UiGameButton>
          <UiGameButton
            variant="ghost"
            @click="router.push('/category-select?mode=survival')"
          >
            ❤️ Survival
          </UiGameButton>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1.5rem;
}

/* ============ HEADER ============ */
.dash-header {
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

.dash-title {
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

/* ============ CONTENT ============ */
.dash-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
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

/* ============ PROFILE CARD ============ */
.profile-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}

.profile-rank {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-primary-400, #00d4ff);
}

.profile-level {
  font-size: 2.5rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.9);
}

.xp-bar-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.xp-bar-track {
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
}

.xp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary-400, #00d4ff), var(--color-secondary-400, #a855f7));
  border-radius: 4px;
  transition: width 0.8s ease;
}

.xp-bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.next-rank {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}

.next-rank strong {
  color: #f59e0b;
}

/* ============ STATS GRID ============ */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-tile {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1.25rem 0.75rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-tile__icon {
  font-size: 1.5rem;
}

.stat-tile__value {
  font-size: 1.75rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
}

.stat-tile__label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
}

/* ============ MASTERY ============ */
.mastery-section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 1.5rem;
}

.mastery-bar-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mastery-bar-track {
  height: 12px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  overflow: hidden;
}

.mastery-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #00d4ff);
  border-radius: 6px;
  transition: width 1s ease;
}

.mastery-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mastery-percent {
  font-size: 1.5rem;
  font-weight: 800;
  color: #4ade80;
}

.mastery-count {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

/* ============ QUICK ACTIONS ============ */
.action-grid {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* ============ RESPONSIVE ============ */
@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-grid {
    flex-direction: column;
  }
}
</style>
