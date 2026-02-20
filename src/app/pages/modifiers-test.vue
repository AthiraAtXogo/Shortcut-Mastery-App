<script setup lang="ts">
// #region composables
const { isMac, modifiers, activeModifiers, modifierSymbols, primaryModifier, formatCombo, matchModifier } = useModifiers()
// #endregion

// #region state
const testCombos = [
  { label: 'Ctrl/Cmd + C', keys: ['Ctrl/Cmd', 'C'] },
  { label: 'Ctrl/Cmd + Shift + Z', keys: ['Ctrl/Cmd', 'Shift', 'Z'] },
  { label: 'Alt + F4', keys: ['Alt', 'F4'] },
  { label: 'Ctrl + Alt + Delete', keys: ['Ctrl', 'Alt', 'Delete'] }
]
// #endregion
</script>

<template>
  <div class="test-page">
    <div class="card">
      <h2>Modifier Handling Test</h2>
      <p class="subtitle">
        Tests useModifiers composable
      </p>

      <div class="platform-badge">
        Platform: <strong>{{ isMac ? 'Mac' : 'Windows/Linux' }}</strong>
        &nbsp;· Primary modifier: <kbd>{{ primaryModifier }}</kbd>
      </div>

      <div class="section">
        <div class="section-title">
          Live modifier states (hold keys):
        </div>
        <div class="mod-grid">
          <div
            v-for="(active, mod) in modifiers"
            :key="mod"
            class="mod-key"
            :class="{ active }"
          >
            <span class="mod-name">{{ mod.toUpperCase() }}</span>
            <span class="mod-state">{{ active ? 'DOWN' : 'up' }}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          Active modifiers:
        </div>
        <div class="active-row">
          <kbd
            v-for="m in activeModifiers"
            :key="m"
            class="mod-badge"
          >
            {{ modifierSymbols[m] }} {{ m }}
          </kbd>
          <span
            v-if="activeModifiers.length === 0"
            class="dim"
          >none</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          Platform symbols:
        </div>
        <div class="symbols-grid">
          <div
            v-for="(sym, mod) in modifierSymbols"
            :key="mod"
            class="symbol-item"
          >
            <span class="sym">{{ sym }}</span>
            <span class="sym-name">{{ mod }}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          formatCombo() output (Ctrl/Cmd resolved to platform):
        </div>
        <div class="combos">
          <div
            v-for="tc in testCombos"
            :key="tc.label"
            class="combo-row"
          >
            <span class="combo-label">{{ tc.label }}</span>
            <span class="combo-result">→ {{ formatCombo(tc.keys) }}</span>
            <span
              class="combo-match"
              :class="matchModifier('Ctrl/Cmd', activeModifiers) ? 'green' : 'dim'"
            >
              {{ tc.keys.includes('Ctrl/Cmd') ? (matchModifier('Ctrl/Cmd', activeModifiers) ? '✓ matched' : '—') : '' }}
            </span>
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
  align-items: center;
  justify-content: center;
  font-family: monospace;
}

.card {
  background: #12121a;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 2rem;
  width: min(560px, 90vw);
}

h2 {
  color: #fff;
  margin: 0 0 0.25rem;
  font-size: 1.4rem;
}

.subtitle {
  color: #444;
  font-size: 0.8rem;
  margin: 0 0 1.2rem;
}

.platform-badge {
  background: #0a0a0f;
  border: 1px solid #1a1a2e;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  color: #aaa;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.platform-badge strong { color: #a855f7; }

kbd {
  background: #1e1e2e;
  border: 1px solid #a855f7;
  border-radius: 4px;
  padding: 0.1rem 0.4rem;
  font-family: monospace;
  font-size: 0.8rem;
  color: #a855f7;
}

.section {
  margin-bottom: 1.4rem;
}

.section-title {
  color: #444;
  font-size: 0.78rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mod-grid {
  display: flex;
  gap: 0.5rem;
}

.mod-key {
  flex: 1;
  background: #0a0a0f;
  border: 1px solid #222;
  border-radius: 8px;
  padding: 0.5rem;
  text-align: center;
  transition: all 0.1s;
}

.mod-key.active {
  border-color: #a855f7;
  background: #a855f722;
}

.mod-name {
  display: block;
  color: #666;
  font-size: 0.75rem;
}

.mod-key.active .mod-name { color: #a855f7; }

.mod-state {
  display: block;
  font-size: 0.7rem;
  color: #333;
  margin-top: 0.2rem;
}

.mod-key.active .mod-state { color: #a855f7; }

.active-row {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  min-height: 24px;
}

.mod-badge {
  background: #a855f722;
  border-color: #a855f7;
  color: #a855f7;
}

.dim { color: #333; font-size: 0.85rem; }

.symbols-grid {
  display: flex;
  gap: 1rem;
}

.symbol-item {
  text-align: center;
}

.sym {
  display: block;
  color: #00d4ff;
  font-size: 1.2rem;
}

.sym-name {
  display: block;
  color: #444;
  font-size: 0.7rem;
}

.combos {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.combo-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
}

.combo-label { color: #555; width: 180px; flex-shrink: 0; }
.combo-result { color: #00d4ff; }
.combo-match { font-size: 0.75rem; }
.green { color: #4ade80; }
</style>
