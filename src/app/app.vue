<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#00d4ff' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/icon-192.png' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Shortcut Mastery'
const description = 'Master keyboard shortcuts through gamified learning. Practice, compete, and become a keyboard ninja.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UiOfflineIndicator />

    <UMain class="min-h-screen">
      <NuxtPage />
    </UMain>
  </UApp>
</template>
