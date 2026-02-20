<script setup lang="ts">
// #region imports
import { ALL_APPS, ALL_SHORTCUTS } from '~/data/shortcuts/index'
// #endregion

// #region state
const selectedApp = ref('vscode')
const selectedCategory = ref('')

const currentApp = computed(() => ALL_APPS.find(a => a.id === selectedApp.value))

const filtered = computed(() => {
  let list = ALL_SHORTCUTS.filter(s => s.app === selectedApp.value)
  if (selectedCategory.value) list = list.filter(s => s.category === selectedCategory.value)
  return list
})

const stats = computed(() => ({
  total: ALL_SHORTCUTS.length,
  apps: ALL_APPS.length,
  easy: ALL_SHORTCUTS.filter(s => s.difficulty === 'easy').length,
  medium: ALL_SHORTCUTS.filter(s => s.difficulty === 'medium').length,
  hard: ALL_SHORTCUTS.filter(s => s.difficulty === 'hard').length,
  common: ALL_SHORTCUTS.filter(s => s.frequency === 'common').length
}))
// #endregion
</script>

<template>
  <div class="test-page">
    <div class="card">
      <h2>Shortcut Data Test</h2>
      <p class="subtitle">
        Tests shortcut data schema and all app datasets
      </p>

      <div class="stats-grid">
        <div class="stat">
          <span class="stat-val">{{ stats.total }}</span>
          <span class="stat-label">shortcuts</span>
        </div>
        <div class="stat">
          <span class="stat-val">{{ stats.apps }}</span>
          <span class="stat-label">apps</span>
        </div>
        <div class="stat easy">
          <span class="stat-val">{{ stats.easy }}</span>
          <span class="stat-label">easy</span>
        </div>
        <div class="stat medium">
          <span class="stat-val">{{ stats.medium }}</span>
          <span class="stat-label">medium</span>
        </div>
        <div class="stat hard">
          <span class="stat-val">{{ stats.hard }}</span>
          <span class="stat-label">hard</span>
        </div>
        <div class="stat common">
          <span class="stat-val">{{ stats.common }}</span>
          <span class="stat-label">common</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          App:
        </div>
        <div class="app-btns">
          <button
            v-for="app in ALL_APPS"
            :key="app.id"
            class="app-btn"
            :class="{ active: selectedApp === app.id }"
            @click="selectedApp = app.id; selectedCategory = ''"
          >
            {{ app.icon }} {{ app.name }}
          </button>
        </div>
      </div>

      <div
        v-if="currentApp"
        class="section"
      >
        <div class="section-title">
          Category:
        </div>
        <div class="cat-btns">
          <button
            class="cat-btn"
            :class="{ active: selectedCategory === '' }"
            @click="selectedCategory = ''"
          >
            All ({{ ALL_SHORTCUTS.filter(s => s.app === selectedApp).length }})
          </button>
          <button
            v-for="cat in currentApp.categories"
            :key="cat.id"
            class="cat-btn"
            :class="{ active: selectedCategory === cat.id }"
            @click="selectedCategory = cat.id"
          >
            {{ cat.name }} ({{ ALL_SHORTCUTS.filter(s => s.app === selectedApp && s.category === cat.id).length }})
          </button>
        </div>
      </div>

      <div class="shortcut-list">
        <div
          v-for="s in filtered"
          :key="s.id"
          class="shortcut-row"
        >
          <div class="shortcut-keys">
            <kbd>{{ s.keysDisplay }}</kbd>
          </div>
          <div class="shortcut-info">
            <span class="shortcut-action">{{ s.action }}</span>
            <span class="shortcut-desc">{{ s.description }}</span>
          </div>
          <div class="shortcut-meta">
            <span
              class="badge"
              :class="s.difficulty"
            >{{ s.difficulty }}</span>
            <span
              class="badge freq"
              :class="s.frequency"
            >{{ s.frequency }}</span>
          </div>
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
  justify-content: center;
  padding: 2rem 1rem;
  font-family: monospace;
}

.card {
  background: #12121a;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 2rem;
  width: min(800px, 95vw);
  height: fit-content;
}

h2 { color: #fff; margin: 0 0 0.25rem; font-size: 1.4rem; }
.subtitle { color: #444; font-size: 0.8rem; margin: 0 0 1.5rem; }

.stats-grid {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.stat {
  background: #0a0a0f;
  border: 1px solid #1a1a2e;
  border-radius: 8px;
  padding: 0.5rem 0.8rem;
  text-align: center;
  min-width: 60px;
}

.stat-val { display: block; color: #00d4ff; font-size: 1.3rem; font-weight: bold; }
.stat-label { display: block; color: #444; font-size: 0.7rem; }
.stat.easy .stat-val { color: #4ade80; }
.stat.medium .stat-val { color: #facc15; }
.stat.hard .stat-val { color: #f87171; }
.stat.common .stat-val { color: #a855f7; }

.section { margin-bottom: 1rem; }
.section-title { color: #444; font-size: 0.75rem; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.05em; }

.app-btns, .cat-btns { display: flex; flex-wrap: wrap; gap: 0.4rem; }

button {
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
}

.app-btn { background: #0a0a0f; border: 1px solid #222; color: #555; }
.app-btn:hover { border-color: #555; color: #888; }
.app-btn.active { border-color: #00d4ff; color: #00d4ff; background: #00d4ff15; }
.cat-btn { background: #0a0a0f; border: 1px solid #1a1a2e; color: #444; font-size: 0.72rem; }
.cat-btn:hover { border-color: #444; color: #666; }
.cat-btn.active { border-color: #a855f7; color: #a855f7; background: #a855f715; }

.shortcut-list { display: flex; flex-direction: column; gap: 0.3rem; margin-top: 1rem; max-height: 420px; overflow-y: auto; }

.shortcut-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.45rem 0.6rem;
  background: #0a0a0f;
  border-radius: 6px;
  border: 1px solid transparent;
  transition: border-color 0.1s;
}
.shortcut-row:hover { border-color: #1a1a2e; }

.shortcut-keys { min-width: 130px; flex-shrink: 0; }

kbd {
  background: #1e1e2e;
  border: 1px solid #2a2a3e;
  border-radius: 4px;
  padding: 0.1rem 0.5rem;
  font-size: 0.75rem;
  color: #00d4ff;
  white-space: nowrap;
}

.shortcut-info { flex: 1; min-width: 0; }
.shortcut-action { display: block; color: #ccc; font-size: 0.82rem; }
.shortcut-desc { display: block; color: #444; font-size: 0.72rem; margin-top: 0.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.shortcut-meta { display: flex; gap: 0.3rem; flex-shrink: 0; }

.badge {
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  font-size: 0.65rem;
  border: 1px solid;
}
.badge.easy { color: #4ade80; border-color: #4ade8040; background: #4ade8010; }
.badge.medium { color: #facc15; border-color: #facc1540; background: #facc1510; }
.badge.hard { color: #f87171; border-color: #f8717140; background: #f8717110; }
.badge.common { color: #a855f7; border-color: #a855f740; }
.badge.occasional { color: #555; border-color: #33333380; }
.badge.rare { color: #333; border-color: #22222280; }
</style>
