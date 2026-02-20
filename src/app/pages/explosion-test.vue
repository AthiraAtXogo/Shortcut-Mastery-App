<script setup lang="ts">
// #region state
const explosionRef = ref<{ trigger: (opts?: object) => void }>()
const streak = ref(0)

const STREAK_LABELS = [
  { min: 21, label: '21+ — Gold', color: '#ffd700' },
  { min: 11, label: '11-20 — Pink', color: '#ff69b4' },
  { min: 6, label: '6-10 — Purple', color: '#a855f7' },
  { min: 3, label: '3-5 — Blue-Purple', color: '#7c3aed' },
  { min: 0, label: '1-2 — Electric Blue', color: '#00d4ff' }
]

function currentLabel() {
  return STREAK_LABELS.find(l => streak.value >= l.min) ?? STREAK_LABELS[4]
}

function fire(x: number, y: number) {
  explosionRef.value?.trigger({ x, y, streak: streak.value, intensity: 1 })
}

function handleClick(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  fire((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height)
  streak.value++
}
// #endregion
</script>

<template>
  <div
    class="test-page"
    @click="handleClick"
  >
    <ClientOnly>
      <ThreeExplosionShards ref="explosionRef" />
    </ClientOnly>

    <div class="info">
      <h2>Explosion Shards Test</h2>
      <p>Click anywhere to trigger explosion</p>
      <div
        class="streak-badge"
        :style="{ color: currentLabel().color }"
      >
        Streak: {{ streak }} — {{ currentLabel().label }}
      </div>
      <div class="streak-btns">
        <button
          v-for="val in [0, 1, 3, 6, 11, 21]"
          :key="val"
          @click.stop="streak = val"
        >
          Streak {{ val }}
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
  align-items: center;
  justify-content: center;
  cursor: crosshair;
  overflow: hidden;
}

.info {
  text-align: center;
  color: #aaa;
  font-family: monospace;
  pointer-events: none;
  z-index: 1;
}

.info h2 {
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.info p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.streak-badge {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1rem;
  transition: color 0.3s;
}

.streak-btns {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  pointer-events: all;
}

.streak-btns button {
  padding: 0.3rem 0.7rem;
  background: #1e1e2e;
  color: #aaa;
  border: 1px solid #333;
  border-radius: 6px;
  font-family: monospace;
  cursor: pointer;
}

.streak-btns button:hover {
  border-color: #00d4ff;
  color: #00d4ff;
}
</style>
