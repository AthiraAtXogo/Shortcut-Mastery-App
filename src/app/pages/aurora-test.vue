<script setup lang="ts">
// #region state
const streak = ref(0)
// #endregion

// #region handlers
function setStreak(value: number) {
  streak.value = value
}
// #endregion
</script>

<template>
  <div class="aurora-test">
    <!-- Aurora Trails -->
    <ThreeAuroraTrails :streak="streak" />

    <!-- Controls -->
    <div class="controls">
      <h1 class="title">Aurora Trails Test</h1>

      <div class="streak-display">
        <span class="label">Current Streak:</span>
        <span class="value">{{ streak }}</span>
      </div>

      <div class="buttons">
        <UiGameButton size="sm" @click="setStreak(0)">
          0 (Hidden)
        </UiGameButton>
        <UiGameButton size="sm" @click="setStreak(3)">
          3 (Blue)
        </UiGameButton>
        <UiGameButton size="sm" @click="setStreak(6)">
          6 (Purple)
        </UiGameButton>
        <UiGameButton size="sm" @click="setStreak(11)">
          11 (Pink)
        </UiGameButton>
        <UiGameButton size="sm" @click="setStreak(21)">
          21+ (Gold)
        </UiGameButton>
      </div>

      <div class="slider">
        <label>Manual Control:</label>
        <input
          v-model.number="streak"
          type="range"
          min="0"
          max="30"
          class="range-input"
        >
      </div>

      <div class="info">
        <h3>Streak Levels</h3>
        <ul>
          <li><strong>0-2:</strong> Hidden</li>
          <li><strong>3-5:</strong> Blue (Low intensity)</li>
          <li><strong>6-10:</strong> Purple (Medium intensity)</li>
          <li><strong>11-20:</strong> Pink (High intensity)</li>
          <li><strong>21+:</strong> Gold (Maximum intensity)</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aurora-test {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #000;
}

.controls {
  position: relative;
  z-index: 10;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, var(--color-primary-400), var(--color-secondary-400));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.streak-display {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 2rem;
}

.streak-display .label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

.streak-display .value {
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-primary-400);
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.slider {
  margin-bottom: 2rem;
}

.slider label {
  display: block;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

.range-input {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--color-primary-400);
  border-radius: 50%;
  cursor: pointer;
}

.range-input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--color-primary-400);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.info {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.info h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info li {
  padding: 0.5rem 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}

.info li strong {
  color: rgba(255, 255, 255, 0.9);
}
</style>
