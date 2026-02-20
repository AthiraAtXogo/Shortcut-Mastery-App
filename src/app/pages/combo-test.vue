<script setup lang="ts">
// #region state
const chainRef = ref<{ addConnection: (opts: object) => void, breakCombo: () => void }>()
const comboLevel = ref(0)
const lastPos = ref<{ x: number, y: number } | null>(null)
const log = ref<string[]>([])

function randomPos() {
  return { x: 0.15 + Math.random() * 0.7, y: 0.2 + Math.random() * 0.6 }
}

function hit() {
  comboLevel.value++
  const to = randomPos()

  if (lastPos.value) {
    chainRef.value?.addConnection({
      fromX: lastPos.value.x,
      fromY: lastPos.value.y,
      toX: to.x,
      toY: to.y,
      comboLevel: comboLevel.value
    })
    log.value.unshift(`Combo x${comboLevel.value} connected`)
    if (log.value.length > 6) log.value.pop()
  }

  lastPos.value = to
}

function breakCombo() {
  chainRef.value?.breakCombo()
  comboLevel.value = 0
  lastPos.value = null
  log.value.unshift('Combo broken!')
  if (log.value.length > 6) log.value.pop()
}
// #endregion
</script>

<template>
  <div class="test-page">
    <ClientOnly>
      <ThreeComboChain ref="chainRef" />
    </ClientOnly>

    <div class="info">
      <h2>Combo Chain Test</h2>
      <p>Combo: <span class="combo">x{{ comboLevel }}</span></p>

      <div class="buttons">
        <button
          class="hit"
          @click="hit"
        >
          Correct Answer
        </button>
        <button
          class="break"
          @click="breakCombo"
        >
          Break Combo
        </button>
      </div>

      <div class="log">
        <div
          v-for="(entry, i) in log"
          :key="i"
          class="log-entry"
        >
          {{ entry }}
        </div>
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
  overflow: hidden;
}

.info {
  text-align: center;
  color: #aaa;
  font-family: monospace;
  z-index: 1;
}

.info h2 {
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.info p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.combo {
  color: #00d4ff;
  font-size: 1.4rem;
  font-weight: bold;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

button {
  padding: 0.6rem 1.6rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.hit {
  background: #1e1e2e;
  color: #00d4ff;
  border: 1px solid #00d4ff;
}

.hit:hover {
  background: #00d4ff22;
  color: #fff;
}

.break {
  background: #1e1e2e;
  color: #f87171;
  border: 1px solid #f87171;
}

.break:hover {
  background: #f8717122;
  color: #fff;
}

.log {
  font-size: 0.8rem;
  color: #555;
  min-height: 120px;
}

.log-entry {
  padding: 0.2rem 0;
  color: #666;
}

.log-entry:first-child {
  color: #aaa;
}
</style>
