<script setup lang="ts">
const { elasticBounce, textScramble } = useGsap()

const titleRef = ref<HTMLElement>()
const scoreRef = ref<HTMLElement>()
const score = ref(0)

function handleCorrect() {
  score.value += 100
  if (scoreRef.value) {
    const { counterRoll } = useGsap()
    counterRoll(scoreRef.value, score.value, { duration: 0.5 })
  }
}

onMounted(() => {
  if (titleRef.value) {
    textScramble(titleRef.value, 'Shortcut Mastery', { duration: 1 })
  }
})
</script>

<template>
  <div class="min-h-screen p-8">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <h1 ref="titleRef" class="text-hero text-gradient-primary mb-4">
        Shortcut Mastery
      </h1>
      <p class="text-body text-opacity-medium max-w-xl mx-auto">
        Master keyboard shortcuts through gamified learning
      </p>
    </div>

    <!-- Score Display -->
    <div class="text-center mb-12">
      <p class="text-caption text-opacity-low mb-2">SCORE</p>
      <p ref="scoreRef" class="text-4xl font-bold text-gradient-primary">
        {{ score }}
      </p>
    </div>

    <!-- Component Showcase -->
    <div class="max-w-4xl mx-auto space-y-12">
      <!-- Buttons Section -->
      <section>
        <h2 class="text-heading mb-6">Buttons</h2>
        <div class="flex flex-wrap gap-4">
          <UiGameButton variant="primary" @click="handleCorrect">
            Primary
          </UiGameButton>
          <UiGameButton variant="secondary">
            Secondary
          </UiGameButton>
          <UiGameButton variant="success">
            Success
          </UiGameButton>
          <UiGameButton variant="danger">
            Danger
          </UiGameButton>
          <UiGameButton variant="ghost">
            Ghost
          </UiGameButton>
        </div>

        <div class="flex flex-wrap gap-4 mt-4">
          <UiGameButton size="sm">Small</UiGameButton>
          <UiGameButton size="md">Medium</UiGameButton>
          <UiGameButton size="lg">Large</UiGameButton>
          <UiGameButton size="xl">Extra Large</UiGameButton>
        </div>

        <div class="flex flex-wrap gap-4 mt-4">
          <UiGameButton icon-left="i-lucide-play">Start Game</UiGameButton>
          <UiGameButton icon-right="i-lucide-arrow-right">Continue</UiGameButton>
          <UiGameButton :loading="true">Loading</UiGameButton>
        </div>
      </section>

      <!-- Cards Section -->
      <section>
        <h2 class="text-heading mb-6">Holographic Cards</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UiHoloCard size="lg">
            <div class="text-center">
              <div class="text-4xl mb-2">🎮</div>
              <h3 class="text-subheading mb-1">Practice Mode</h3>
              <p class="text-body-sm text-opacity-medium">Learn at your pace</p>
            </div>
          </UiHoloCard>

          <UiHoloCard size="lg" glow-color="rgba(168, 85, 247, 0.3)">
            <div class="text-center">
              <div class="text-4xl mb-2">⚡</div>
              <h3 class="text-subheading mb-1">Speed Run</h3>
              <p class="text-body-sm text-opacity-medium">Race against time</p>
            </div>
          </UiHoloCard>

          <UiHoloCard size="lg" glow-color="rgba(132, 204, 22, 0.3)">
            <div class="text-center">
              <div class="text-4xl mb-2">🏆</div>
              <h3 class="text-subheading mb-1">Boss Battle</h3>
              <p class="text-body-sm text-opacity-medium">Ultimate challenge</p>
            </div>
          </UiHoloCard>
        </div>
      </section>

      <!-- Plasma Borders Section -->
      <section>
        <h2 class="text-heading mb-6">Plasma Borders</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UiPlasmaBorder>
            <div class="p-6">
              <h3 class="text-subheading mb-2">Animated Border</h3>
              <p class="text-body-sm text-opacity-medium">
                Flowing gradient that rotates continuously
              </p>
            </div>
          </UiPlasmaBorder>

          <UiPlasmaBorder speed="fast" :width="3">
            <div class="p-6">
              <h3 class="text-subheading mb-2">Fast & Thick</h3>
              <p class="text-body-sm text-opacity-medium">
                Faster animation with thicker border
              </p>
            </div>
          </UiPlasmaBorder>
        </div>
      </section>

      <!-- Keyboard Keys Section -->
      <section>
        <h2 class="text-heading mb-6">Keyboard Shortcuts</h2>
        <div class="card-glass p-6 rounded-xl">
          <p class="text-body mb-4">Press these keys to copy:</p>
          <div class="flex items-center gap-2">
            <span class="kbd kbd-primary">Ctrl</span>
            <span class="text-opacity-low">+</span>
            <span class="kbd kbd-primary">C</span>
          </div>

          <div class="divider my-6" />

          <p class="text-body mb-4">Large keys:</p>
          <div class="flex items-center gap-2">
            <span class="kbd kbd-lg">⌘</span>
            <span class="text-opacity-low">+</span>
            <span class="kbd kbd-lg">Shift</span>
            <span class="text-opacity-low">+</span>
            <span class="kbd kbd-lg">P</span>
          </div>
        </div>
      </section>

      <!-- Typography Section -->
      <section>
        <h2 class="text-heading mb-6">Typography</h2>
        <div class="space-y-4">
          <p class="text-hero">Hero Text</p>
          <p class="text-title">Title Text</p>
          <p class="text-heading">Heading Text</p>
          <p class="text-subheading">Subheading Text</p>
          <p class="text-body">Body text for regular content</p>
          <p class="text-body-sm text-opacity-medium">Small body text with medium opacity</p>
          <p class="text-caption">CAPTION TEXT</p>
          <p class="text-gradient-primary text-2xl font-bold">Gradient Text</p>
          <p class="text-gradient-warm text-2xl font-bold">Warm Gradient</p>
        </div>
      </section>

      <!-- Glows Section -->
      <section>
        <h2 class="text-heading mb-6">Glow Effects</h2>
        <div class="flex flex-wrap gap-4">
          <div class="w-24 h-24 rounded-xl bg-primary-500/20 glow-primary flex items-center justify-center">
            <span class="text-primary-400">Primary</span>
          </div>
          <div class="w-24 h-24 rounded-xl bg-secondary-500/20 glow-secondary flex items-center justify-center">
            <span class="text-secondary-400">Secondary</span>
          </div>
          <div class="w-24 h-24 rounded-xl bg-success-500/20 glow-success flex items-center justify-center">
            <span class="text-success-400">Success</span>
          </div>
          <div class="w-24 h-24 rounded-xl bg-error-500/20 glow-error flex items-center justify-center">
            <span class="text-error-400">Error</span>
          </div>
        </div>
      </section>
    </div>

    <!-- Footer -->
    <div class="text-center mt-16 pt-8">
      <div class="divider mb-8" />
      <p class="text-body-sm text-opacity-low">
        Built with Nuxt 4 + Nuxt UI + GSAP + Three.js
      </p>
    </div>
  </div>
</template>
