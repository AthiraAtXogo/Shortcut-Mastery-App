<script setup lang="ts">
// #region state
type BossType = 'vscode' | 'chrome' | 'windows' | 'terminal' | 'notion'

const bossRef = ref<{ takeDamage: () => void, defeat: () => void }>()
const currentBoss = ref<BossType>('vscode')
const bosses: BossType[] = ['vscode', 'chrome', 'windows', 'terminal', 'notion']

const bossLabels: Record<BossType, string> = {
  vscode: 'VS Code Master',
  chrome: 'Chrome Guardian',
  windows: 'Windows Sentinel',
  terminal: 'Terminal Titan',
  notion: 'Notion Keeper'
}

function hit() {
  bossRef.value?.takeDamage()
}

function defeat() {
  bossRef.value?.defeat()
}
// #endregion
</script>

<template>
  <div class="test-page">
    <div class="boss-stage">
      <ClientOnly>
        <ThreeBossAvatar
          ref="bossRef"
          :boss-type="currentBoss"
        />
      </ClientOnly>
    </div>

    <div class="info">
      <h2>Boss Avatar Test</h2>
      <p class="boss-name">
        {{ bossLabels[currentBoss] }}
      </p>

      <div class="boss-select">
        <button
          v-for="type in bosses"
          :key="type"
          :class="{ active: currentBoss === type }"
          @click="currentBoss = type"
        >
          {{ type }}
        </button>
      </div>

      <div class="actions">
        <button
          class="damage-btn"
          @click="hit"
        >
          Hit Boss
        </button>
        <button
          class="defeat-btn"
          @click="defeat"
        >
          Defeat
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test-page {
  position: relative;
  min-height: 100vh;
  background: #0a0a0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.boss-stage {
  width: 360px;
  height: 360px;
  margin-bottom: 1.5rem;
}

.info {
  text-align: center;
  color: #aaa;
  font-family: monospace;
  z-index: 1;
}

.info h2 {
  font-size: 1.4rem;
  color: #fff;
  margin-bottom: 0.25rem;
}

.boss-name {
  font-size: 1rem;
  color: #a855f7;
  margin-bottom: 1rem;
}

.boss-select {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.2rem;
}

.boss-select button {
  padding: 0.3rem 0.8rem;
  background: #1e1e2e;
  color: #666;
  border: 1px solid #333;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.boss-select button.active,
.boss-select button:hover {
  color: #a855f7;
  border-color: #a855f7;
  background: #a855f722;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.actions button {
  padding: 0.6rem 1.6rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.damage-btn {
  background: #1e1e2e;
  color: #f87171;
  border: 1px solid #f87171;
}

.damage-btn:hover {
  background: #f8717122;
  color: #fff;
}

.defeat-btn {
  background: #1e1e2e;
  color: #ffd700;
  border: 1px solid #ffd700;
}

.defeat-btn:hover {
  background: #ffd70022;
  color: #fff;
}
</style>
