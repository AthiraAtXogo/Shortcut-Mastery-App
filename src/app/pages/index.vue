<script setup lang="ts">
// #region composables
const { textScramble } = useGsap()

// Initialize store (auto-imported by Nuxt)
const userStore = useUserStore()

// Load user data from database
if (import.meta.client) {
  userStore.loadFromDatabase()
}
// #endregion

// #region state
const titleRef = ref<HTMLElement>()
const mounted = ref(false)

// Randomly illuminate keys on the hero keyboard
const DEMO_KEYS = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'ControlLeft', 'ShiftLeft', 'KeyC', 'KeyV', 'KeyZ']
const heroHighlightedKeys = ref<string[]>([])
let heroInterval: ReturnType<typeof setInterval>
// #endregion

// #region lifecycle
onMounted(() => {
  mounted.value = true
  if (titleRef.value) {
    textScramble(titleRef.value, 'SHORTCUT MASTERY', { duration: 1.2 })
  }
  // Randomly illuminate 2-3 keys every 1.5s for ambient effect
  heroInterval = setInterval(() => {
    const count = 2 + Math.floor(Math.random() * 2)
    const shuffled = [...DEMO_KEYS].sort(() => Math.random() - 0.5)
    heroHighlightedKeys.value = shuffled.slice(0, count)
  }, 1500)
})

onUnmounted(() => {
  clearInterval(heroInterval)
})
// #endregion

// #region handlers
function startQuickPlay() {
  // TODO: Navigate to quick play
  console.log('Quick Play')
}

function goToArcade() {
  // TODO: Navigate to arcade
  console.log('Arcade Mode')
}

function goToLearn() {
  // TODO: Navigate to learn mode
  console.log('Learn Mode')
}

function goToDailyChallenge() {
  // TODO: Navigate to daily challenge
  console.log('Daily Challenge')
}

function goToAchievements() {
  // TODO: Navigate to achievements
  console.log('Achievements')
}
// #endregion
</script>

<template>
  <div class="home-screen">
    <!-- 3D Neural Background -->
    <ThreeNeuralBackground />

    <!-- Title -->
    <header class="home-screen__header">
      <h1
        ref="titleRef"
        class="home-screen__title"
      >
        SHORTCUT MASTERY
      </h1>
      <p class="home-screen__subtitle">
        Master keyboard shortcuts through gamified learning
      </p>
    </header>

    <!-- 3D Keyboard Hero -->
    <div class="home-screen__hero">
      <ClientOnly>
        <ThreeKeyboard3D :highlighted-keys="heroHighlightedKeys" />
      </ClientOnly>
    </div>

    <!-- Main Actions -->
    <nav class="home-screen__actions">
      <UiHoloCard
        size="lg"
        class="home-screen__card"
        @click="startQuickPlay"
      >
        <div class="card-content">
          <div class="card-icon">
            ⚡
          </div>
          <h3 class="card-title">
            Quick Play
          </h3>
          <p class="card-description">
            Jump right in
          </p>
        </div>
      </UiHoloCard>

      <UiHoloCard
        size="lg"
        class="home-screen__card"
        glow-color="rgba(168, 85, 247, 0.3)"
        @click="goToArcade"
      >
        <div class="card-content">
          <div class="card-icon">
            🎮
          </div>
          <h3 class="card-title">
            Arcade Mode
          </h3>
          <p class="card-description">
            Challenge yourself
          </p>
        </div>
      </UiHoloCard>

      <UiHoloCard
        size="lg"
        class="home-screen__card"
        glow-color="rgba(132, 204, 22, 0.3)"
        @click="goToLearn"
      >
        <div class="card-content">
          <div class="card-icon">
            📚
          </div>
          <h3 class="card-title">
            Learn Mode
          </h3>
          <p class="card-description">
            Master the basics
          </p>
        </div>
      </UiHoloCard>
    </nav>

    <!-- Stats Bar -->
    <div class="home-screen__stats">
      <div class="stat-item">
        <div class="stat-icon">
          🔥
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ userStore.dailyStreak }}</span>
          <span class="stat-label">Day Streak</span>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon">
          ⭐
        </div>
        <div class="stat-content">
          <span class="stat-value">Level {{ userStore.level }}</span>
          <span class="stat-label">Current Level</span>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon">
          🏆
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ userStore.xp }}</span>
          <span class="stat-label">Total XP</span>
        </div>
      </div>
    </div>

    <!-- Secondary Actions -->
    <footer class="home-screen__footer">
      <UiGameButton
        variant="secondary"
        @click="goToDailyChallenge"
      >
        🎯 Daily Challenge
      </UiGameButton>
      <UiGameButton
        variant="ghost"
        @click="goToAchievements"
      >
        🏅 Achievements
      </UiGameButton>
    </footer>
  </div>
</template>

<style scoped>
.home-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 3rem;
}

/* ============ HEADER ============ */
.home-screen__header {
  text-align: center;
}

.home-screen__title {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--color-primary-400), var(--color-secondary-400));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

.home-screen__subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
}

/* ============ HERO KEYBOARD ============ */
.home-screen__hero {
  width: 100%;
  max-width: 1000px;
  height: 320px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 40px rgba(0, 212, 255, 0.08);
}

/* ============ ACTIONS ============ */
.home-screen__actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
}

.home-screen__card {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.home-screen__card:hover {
  transform: translateY(-4px);
}

.card-content {
  text-align: center;
  padding: 1.5rem;
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-neutral-100);
}

.card-description {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
}

/* ============ STATS ============ */
.home-screen__stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary-400);
}

.stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
}

/* ============ FOOTER ============ */
.home-screen__footer {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* ============ RESPONSIVE ============ */
@media (max-width: 768px) {
  .home-screen {
    gap: 2rem;
    padding: 1rem;
  }

  .home-screen__actions {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .home-screen__stats {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }
}

/* ============ ANIMATIONS ============ */
@media (prefers-reduced-motion: no-preference) {
  .home-screen__header,
  .home-screen__actions,
  .home-screen__stats,
  .home-screen__footer {
    animation: fadeInUp 0.6s ease-out backwards;
  }

  .home-screen__actions {
    animation-delay: 0.2s;
  }

  .home-screen__stats {
    animation-delay: 0.4s;
  }

  .home-screen__footer {
    animation-delay: 0.6s;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
