<script setup lang="ts">
// #region setup
definePageMeta({ layout: false })

interface Achievement {
  id: string
  icon: string
  title: string
  description: string
  unlocked: boolean
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}
// #endregion

// #region composables
const router = useRouter()
const userStore = useUserStore()
// #endregion

// #region state
const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-correct', icon: '🎯', title: 'First Strike', description: 'Get your first correct answer', unlocked: true, rarity: 'common' },
  { id: 'streak-3', icon: '🔥', title: 'On Fire', description: 'Reach a 3x combo streak', unlocked: true, rarity: 'common' },
  { id: 'streak-10', icon: '💥', title: 'Unstoppable', description: 'Reach a 10x combo streak', unlocked: false, rarity: 'rare' },
  { id: 'streak-25', icon: '⚡', title: 'Lightning', description: 'Reach a 25x combo streak', unlocked: false, rarity: 'epic' },
  { id: 'perfect-game', icon: '💎', title: 'Flawless', description: 'Complete a game with 100% accuracy', unlocked: false, rarity: 'legendary' },
  { id: 'shortcuts-10', icon: '📚', title: 'Learner', description: 'Learn 10 shortcuts', unlocked: userStore.totalShortcutsLearned >= 10, rarity: 'common' },
  { id: 'shortcuts-50', icon: '🎓', title: 'Scholar', description: 'Learn 50 shortcuts', unlocked: userStore.totalShortcutsLearned >= 50, rarity: 'rare' },
  { id: 'shortcuts-100', icon: '🏛️', title: 'Master', description: 'Learn 100 shortcuts', unlocked: userStore.totalShortcutsLearned >= 100, rarity: 'epic' },
  { id: 'level-5', icon: '⭐', title: 'Rising Star', description: 'Reach Level 5', unlocked: userStore.level >= 5, rarity: 'common' },
  { id: 'level-10', icon: '🌟', title: 'Expert', description: 'Reach Level 10', unlocked: userStore.level >= 10, rarity: 'rare' },
  { id: 'streak-7', icon: '📅', title: 'Dedicated', description: 'Maintain a 7-day streak', unlocked: userStore.dailyStreak >= 7, rarity: 'rare' },
  { id: 'streak-30', icon: '🏆', title: 'Champion', description: 'Maintain a 30-day streak', unlocked: userStore.dailyStreak >= 30, rarity: 'legendary' }
]

const selectedFilter = ref<'all' | 'unlocked' | 'locked'>('all')
// #endregion

// #region computed
const filtered = computed(() => {
  if (selectedFilter.value === 'unlocked') return ACHIEVEMENTS.filter(a => a.unlocked)
  if (selectedFilter.value === 'locked') return ACHIEVEMENTS.filter(a => !a.unlocked)
  return ACHIEVEMENTS
})

const unlockedCount = computed(() => ACHIEVEMENTS.filter(a => a.unlocked).length)

const RARITY_COLOR: Record<string, string> = {
  common: 'rgba(148, 163, 184, 0.5)',
  rare: 'rgba(96, 165, 250, 0.5)',
  epic: 'rgba(168, 85, 247, 0.5)',
  legendary: 'rgba(245, 158, 11, 0.5)'
}
// #endregion
</script>

<template>
  <div class="achievements-screen">
    <ThreeNeuralBackground />

    <!-- Header -->
    <header class="ach-header">
      <button
        class="back-btn"
        @click="router.push('/')"
      >
        ← Back
      </button>
      <div class="ach-header__info">
        <h1 class="ach-title">
          Achievements
        </h1>
        <span class="ach-count">{{ unlockedCount }} / {{ ACHIEVEMENTS.length }} unlocked</span>
      </div>
    </header>

    <!-- Filter -->
    <div class="ach-filters">
      <button
        v-for="f in ['all', 'unlocked', 'locked']"
        :key="f"
        class="filter-btn"
        :class="{ 'filter-btn--active': selectedFilter === f }"
        @click="selectedFilter = f as 'all' | 'unlocked' | 'locked'"
      >
        {{ f.charAt(0).toUpperCase() + f.slice(1) }}
      </button>
    </div>

    <!-- Grid -->
    <div class="ach-grid">
      <div
        v-for="ach in filtered"
        :key="ach.id"
        class="ach-card"
        :class="{ 'ach-card--locked': !ach.unlocked }"
        :style="{ '--rarity-color': RARITY_COLOR[ach.rarity] }"
      >
        <div class="ach-card__icon">
          {{ ach.unlocked ? ach.icon : '🔒' }}
        </div>
        <div class="ach-card__info">
          <div class="ach-card__title">
            {{ ach.title }}
          </div>
          <div class="ach-card__desc">
            {{ ach.description }}
          </div>
          <div
            class="ach-card__rarity"
            :style="{ color: RARITY_COLOR[ach.rarity]?.replace('0.5', '1') }"
          >
            {{ ach.rarity.toUpperCase() }}
          </div>
        </div>
        <div
          v-if="ach.unlocked"
          class="ach-card__badge"
        >
          ✓
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.achievements-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1.5rem;
}

/* ============ HEADER ============ */
.ach-header {
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

.ach-header__info {
  flex: 1;
}

.ach-title {
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.ach-count {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}

/* ============ FILTERS ============ */
.ach-filters {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn--active {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.4);
  color: #00d4ff;
}

/* ============ GRID ============ */
.ach-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
}

.ach-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--rarity-color, rgba(255, 255, 255, 0.08));
  border-radius: 14px;
  position: relative;
  transition: transform 0.2s ease;
}

.ach-card:hover {
  transform: translateY(-2px);
}

.ach-card--locked {
  opacity: 0.45;
  filter: grayscale(0.6);
}

.ach-card__icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.ach-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ach-card__title {
  font-size: 0.95rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.ach-card__desc {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.5);
}

.ach-card__rarity {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  margin-top: 0.25rem;
}

.ach-card__badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(74, 222, 128, 0.2);
  border: 1px solid rgba(74, 222, 128, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #4ade80;
  flex-shrink: 0;
}
</style>
