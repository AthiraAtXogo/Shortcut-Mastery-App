<script setup lang="ts">
import { ALL_APPS, ALL_SHORTCUTS } from '~/data/shortcuts'

// #region setup
definePageMeta({ layout: false })
// #endregion

// #region composables
const router = useRouter()
const route = useRoute()
// #endregion

// #region state
const selectedApp = ref((route.query.app as string) || ALL_APPS[0]?.id || 'vscode')
const selectedMode = ref((route.query.mode as string) || 'practice')

const APP_ICONS: Record<string, string> = {
  windows: '⊞',
  macos: '',
  vscode: '{}',
  chrome: '◉',
  claude: '◆',
  chatgpt: '◎',
  notion: '▣'
}
// #endregion

// #region computed
const currentApp = computed(() => ALL_APPS.find(a => a.id === selectedApp.value))

const appShortcuts = computed(() =>
  ALL_SHORTCUTS.filter(s => s.app === selectedApp.value)
)

const categories = computed(() => {
  const cats = new Map<string, number>()
  appShortcuts.value.forEach((s) => {
    cats.set(s.category, (cats.get(s.category) || 0) + 1)
  })
  return Array.from(cats.entries()).map(([id, count]) => ({ id, count }))
})

const totalShortcuts = computed(() => appShortcuts.value.length)

const difficultyBreakdown = computed(() => ({
  easy: appShortcuts.value.filter(s => s.difficulty === 'easy').length,
  medium: appShortcuts.value.filter(s => s.difficulty === 'medium').length,
  hard: appShortcuts.value.filter(s => s.difficulty === 'hard').length
}))
// #endregion

// #region handlers
function startGame() {
  router.push(`/game?mode=${selectedMode.value}&app=${selectedApp.value}`)
}
// #endregion
</script>

<template>
  <div class="category-screen">
    <ThreeNeuralBackground />

    <!-- Header -->
    <header class="category-header">
      <button
        class="back-btn"
        @click="router.push('/')"
      >
        ← Back
      </button>
      <h1 class="category-title">
        Choose Your Challenge
      </h1>
      <div class="mode-badge">
        {{ selectedMode.toUpperCase().replace('-', ' ') }}
      </div>
    </header>

    <div class="category-content">
      <!-- App Selector -->
      <section class="app-section">
        <h2 class="section-label">
          Application
        </h2>
        <div class="app-grid">
          <button
            v-for="app in ALL_APPS"
            :key="app.id"
            class="app-card"
            :class="{ 'app-card--active': selectedApp === app.id }"
            @click="selectedApp = app.id"
          >
            <span class="app-card__icon">{{ APP_ICONS[app.id] || '⌨' }}</span>
            <span class="app-card__name">{{ app.name }}</span>
          </button>
        </div>
      </section>

      <!-- App Info -->
      <section
        v-if="currentApp"
        class="app-info"
      >
        <div class="info-grid">
          <div class="info-item">
            <div class="info-value">
              {{ totalShortcuts }}
            </div>
            <div class="info-label">
              Shortcuts
            </div>
          </div>
          <div class="info-item">
            <div class="info-value easy">
              {{ difficultyBreakdown.easy }}
            </div>
            <div class="info-label">
              Easy
            </div>
          </div>
          <div class="info-item">
            <div class="info-value medium">
              {{ difficultyBreakdown.medium }}
            </div>
            <div class="info-label">
              Medium
            </div>
          </div>
          <div class="info-item">
            <div class="info-value hard">
              {{ difficultyBreakdown.hard }}
            </div>
            <div class="info-label">
              Hard
            </div>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section class="category-section">
        <h2 class="section-label">
          Categories
        </h2>
        <div class="category-grid">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="category-card"
          >
            <span class="category-card__name">{{ cat.id }}</span>
            <span class="category-card__count">{{ cat.count }}</span>
          </div>
        </div>
      </section>

      <!-- Mode Selector -->
      <section class="mode-section">
        <h2 class="section-label">
          Game Mode
        </h2>
        <div class="mode-grid">
          <button
            v-for="m in ['practice', 'flash-round', 'speed-run', 'survival', 'time-attack']"
            :key="m"
            class="mode-card"
            :class="{ 'mode-card--active': selectedMode === m }"
            @click="selectedMode = m"
          >
            {{ m.toUpperCase().replace('-', ' ') }}
          </button>
        </div>
      </section>
    </div>

    <!-- Start Button -->
    <footer class="category-footer">
      <UiGameButton
        variant="primary"
        @click="startGame"
      >
        ⚡ Start Game
      </UiGameButton>
    </footer>
  </div>
</template>

<style scoped>
.category-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1.5rem;
}

/* ============ HEADER ============ */
.category-header {
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
  white-space: nowrap;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.category-title {
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  flex: 1;
}

.mode-badge {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--color-primary-400, #00d4ff);
  padding: 0.35rem 0.75rem;
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 20px;
  white-space: nowrap;
}

/* ============ CONTENT ============ */
.category-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
  max-width: 900px;
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

/* ============ APP GRID ============ */
.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.app-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.7);
}

.app-card:hover {
  background: rgba(255, 255, 255, 0.08);
}

.app-card--active {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.5);
  color: #00d4ff;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.1);
}

.app-card__icon {
  font-size: 1.5rem;
}

.app-card__name {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
}

/* ============ APP INFO ============ */
.app-info {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 1.25rem;
}

.info-grid {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.info-item {
  text-align: center;
}

.info-value {
  font-size: 2rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
}

.info-value.easy { color: #4ade80; }
.info-value.medium { color: #f59e0b; }
.info-value.hard { color: #f87171; }

.info-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 0.25rem;
}

/* ============ CATEGORY GRID ============ */
.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
}

.category-card__name {
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-transform: capitalize;
}

.category-card__count {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
}

/* ============ MODE GRID ============ */
.mode-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.mode-card {
  padding: 0.6rem 1.25rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-card:hover {
  background: rgba(255, 255, 255, 0.08);
}

.mode-card--active {
  background: rgba(168, 85, 247, 0.15);
  border-color: rgba(168, 85, 247, 0.5);
  color: #a855f7;
}

/* ============ FOOTER ============ */
.category-footer {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}
</style>
