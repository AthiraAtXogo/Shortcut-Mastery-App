<script setup lang="ts">
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

const RANK_COLORS: Record<string, string> = {
  Novice: '#94a3b8',
  Beginner: '#4ade80',
  Intermediate: '#00d4ff',
  Advanced: '#a855f7',
  Expert: '#f59e0b',
  Master: '#f87171',
  Grandmaster: '#fbbf24'
}

const rankColor = computed(() => RANK_COLORS[userStore.rank] ?? '#ffffff')
// #endregion
</script>

<template>
  <div class="profile-screen">
    <ThreeNeuralBackground />

    <!-- Header -->
    <header class="profile-header">
      <button
        class="back-btn"
        @click="router.push('/')"
      >
        ← Back
      </button>
      <h1 class="profile-title">
        Profile
      </h1>
    </header>

    <div class="profile-content">
      <!-- Avatar & Identity -->
      <section class="identity-card">
        <div class="avatar">
          ⌨️
        </div>
        <div class="identity-info">
          <div
            class="identity-rank"
            :style="{ color: rankColor }"
          >
            {{ userStore.rank }}
          </div>
          <div class="identity-level">
            Level {{ userStore.level }}
          </div>
          <div class="identity-xp">
            {{ userStore.xp }} XP total
          </div>
        </div>
      </section>

      <!-- Lifetime Stats -->
      <section class="lifetime-section">
        <h2 class="section-label">
          Lifetime Stats
        </h2>
        <div class="lifetime-grid">
          <div class="lifetime-item">
            <div class="lifetime-value">
              🔥 {{ userStore.dailyStreak }}
            </div>
            <div class="lifetime-label">
              Day Streak
            </div>
          </div>
          <div class="lifetime-item">
            <div class="lifetime-value">
              ⌨️ {{ userStore.totalShortcutsLearned }}
            </div>
            <div class="lifetime-label">
              Shortcuts Learned
            </div>
          </div>
          <div class="lifetime-item">
            <div class="lifetime-value">
              ⏱ {{ totalTimePlayed }}
            </div>
            <div class="lifetime-label">
              Time Played
            </div>
          </div>
          <div class="lifetime-item">
            <div class="lifetime-value">
              🏆 {{ userStore.xp }}
            </div>
            <div class="lifetime-label">
              Total XP
            </div>
          </div>
        </div>
      </section>

      <!-- XP Progress -->
      <section class="xp-section">
        <h2 class="section-label">
          Level Progress
        </h2>
        <div class="xp-card">
          <div class="xp-card__levels">
            <span>Level {{ userStore.level }}</span>
            <span>Level {{ userStore.level + 1 }}</span>
          </div>
          <div class="xp-bar-track">
            <div
              class="xp-bar-fill"
              :style="{ width: `${userStore.xpProgress}%` }"
            />
          </div>
          <div class="xp-card__meta">
            <span>{{ userStore.xp % 1000 }} / 1000 XP</span>
            <span>{{ userStore.xpToNextLevel }} XP to next level</span>
          </div>
        </div>
      </section>

      <!-- Quick Nav -->
      <section class="quick-nav">
        <h2 class="section-label">
          Quick Links
        </h2>
        <div class="nav-grid">
          <button
            class="nav-card"
            @click="router.push('/dashboard')"
          >
            📊 Progress
          </button>
          <button
            class="nav-card"
            @click="router.push('/achievements')"
          >
            🏅 Achievements
          </button>
          <button
            class="nav-card"
            @click="router.push('/settings')"
          >
            ⚙️ Settings
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.profile-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1.5rem;
}

/* ============ HEADER ============ */
.profile-header {
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

.profile-title {
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

/* ============ CONTENT ============ */
.profile-content {
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

/* ============ IDENTITY ============ */
.identity-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(0, 212, 255, 0.1);
  border: 2px solid rgba(0, 212, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  flex-shrink: 0;
}

.identity-rank {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.identity-level {
  font-size: 2rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.9);
}

.identity-xp {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 0.25rem;
}

/* ============ LIFETIME STATS ============ */
.lifetime-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.lifetime-item {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 1.25rem;
}

.lifetime-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.25rem;
}

.lifetime-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
}

/* ============ XP SECTION ============ */
.xp-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.xp-card__levels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
}

.xp-bar-track {
  height: 10px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 5px;
  overflow: hidden;
}

.xp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary-400, #00d4ff), var(--color-secondary-400, #a855f7));
  border-radius: 5px;
  transition: width 0.8s ease;
}

.xp-card__meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

/* ============ QUICK NAV ============ */
.nav-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.nav-card {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.nav-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .nav-grid {
    grid-template-columns: 1fr;
  }

  .lifetime-grid {
    grid-template-columns: 1fr;
  }
}
</style>
