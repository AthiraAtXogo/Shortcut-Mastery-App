import type { Shortcut } from '~/types/shortcut'
import { ALL_SHORTCUTS } from '~/data/shortcuts'

export interface Boss {
  name: string
  hp: number
  maxHp: number
  attack: number // damage per missed shortcut
  comboRequirement: number // consecutive hits to deal bonus damage
  icon: string
}

const BOSSES: Boss[] = [
  { name: 'Tab Tyrant', hp: 300, maxHp: 300, attack: 30, comboRequirement: 3, icon: '👾' },
  { name: 'Shortcut Specter', hp: 500, maxHp: 500, attack: 50, comboRequirement: 5, icon: '👻' },
  { name: 'Keyboard Kraken', hp: 800, maxHp: 800, attack: 80, comboRequirement: 7, icon: '🐙' },
  { name: 'The Terminal', hp: 1200, maxHp: 1200, attack: 120, comboRequirement: 10, icon: '💀' }
]

export function useBossBattle() {
  // #region state
  const shortcuts = ref<Shortcut[]>([])
  const currentIndex = ref(0)
  const boss = ref<Boss | null>(null)
  const playerHp = ref(300)
  const playerMaxHp = ref(300)
  const combo = ref(0)
  const score = ref(0)
  const isRunning = ref(false)
  const isPlayerDead = ref(false)
  const isBossDead = ref(false)
  const bossIndex = ref(0)
  const comboTimer = ref(0)
  let comboTick: ReturnType<typeof setInterval> | null = null
  // #endregion

  // #region computed
  const currentShortcut = computed<Shortcut | null>(
    () => shortcuts.value[currentIndex.value % Math.max(shortcuts.value.length, 1)] ?? null
  )

  const bossHpPercent = computed(() =>
    boss.value ? (boss.value.hp / boss.value.maxHp) * 100 : 0
  )

  const playerHpPercent = computed(() => (playerHp.value / playerMaxHp.value) * 100)
  // #endregion

  // #region methods
  function buildPool(app?: string): Shortcut[] {
    let pool = [...ALL_SHORTCUTS]
    if (app) pool = pool.filter(s => s.app === app)
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    return pool
  }

  function spawnBoss(index: number) {
    const template = BOSSES[index % BOSSES.length]!
    boss.value = { ...template }
    isBossDead.value = false
  }

  function resetComboTimer() {
    if (comboTick) clearInterval(comboTick)
    comboTimer.value = 3
    comboTick = setInterval(() => {
      comboTimer.value--
      if (comboTimer.value <= 0) {
        combo.value = 0
        if (comboTick) clearInterval(comboTick)
      }
    }, 1000)
  }

  function start(app?: string) {
    shortcuts.value = buildPool(app)
    currentIndex.value = 0
    bossIndex.value = 0
    playerHp.value = 300
    combo.value = 0
    score.value = 0
    isRunning.value = true
    isPlayerDead.value = false
    isBossDead.value = false
    spawnBoss(0)
  }

  function submitAnswer(pressedKeys: string[]): boolean {
    const shortcut = currentShortcut.value
    if (!shortcut || !isRunning.value || !boss.value) return false

    const held = pressedKeys.map(k => k.toLowerCase()).sort()
    const expected = shortcut.keys.map(k => k.toLowerCase()).sort()
    const isCorrect = held.length === expected.length
      && held.every((k, i) => k === expected[i])

    if (isCorrect) {
      combo.value++
      resetComboTimer()
      const currentBoss = boss.value
      const dmg = combo.value >= currentBoss.comboRequirement ? 40 : 20
      currentBoss.hp = Math.max(0, currentBoss.hp - dmg)
      score.value += 100 + combo.value * 10

      if (currentBoss.hp <= 0) {
        isBossDead.value = true
        bossIndex.value++
        score.value += 500
        setTimeout(() => spawnBoss(bossIndex.value), 1500)
      }

      currentIndex.value++
    } else if (held.length >= expected.length) {
      combo.value = 0
      playerHp.value = Math.max(0, playerHp.value - (boss.value?.attack ?? 30))
      if (playerHp.value <= 0) {
        isRunning.value = false
        isPlayerDead.value = true
        if (comboTick) clearInterval(comboTick)
      }
    }

    return isCorrect
  }

  function stop() {
    if (comboTick) clearInterval(comboTick)
    isRunning.value = false
  }

  function reset() {
    stop()
    shortcuts.value = []
    currentIndex.value = 0
    boss.value = null
    playerHp.value = 300
    combo.value = 0
    score.value = 0
    isRunning.value = false
    isPlayerDead.value = false
    isBossDead.value = false
    bossIndex.value = 0
  }
  // #endregion

  onUnmounted(() => {
    if (comboTick) clearInterval(comboTick)
  })

  return {
    currentShortcut,
    boss: readonly(boss),
    playerHp: readonly(playerHp),
    playerMaxHp: readonly(playerMaxHp),
    combo: readonly(combo),
    score: readonly(score),
    isRunning: readonly(isRunning),
    isPlayerDead: readonly(isPlayerDead),
    isBossDead: readonly(isBossDead),
    bossHpPercent,
    playerHpPercent,
    comboTimer: readonly(comboTimer),
    start,
    submitAnswer,
    stop,
    reset
  }
}
