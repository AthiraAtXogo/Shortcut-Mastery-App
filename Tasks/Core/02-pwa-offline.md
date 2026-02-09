# Task: PWA Offline Support

## Objective

Configure the app as a Progressive Web App that works fully offline.

## Requirements

- [ ] Install `@vite-pwa/nuxt`
- [ ] Configure service worker
- [ ] Set up app manifest (icons, name, colors)
- [ ] Cache all static assets
- [ ] Cache shortcut data for offline use
- [ ] Add install prompt UI
- [ ] Test offline functionality

## Technical Details

### Dependencies

```bash
pnpm add @vite-pwa/nuxt
```

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  modules: ['@vite-pwa/nuxt'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Shortcut Mastery',
      short_name: 'Shortcuts',
      theme_color: '#00d4ff',
      background_color: '#0a0a0f',
      display: 'standalone',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,json}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst'
        }
      ]
    }
  }
})
```

## Acceptance Criteria

- App installable on desktop/mobile
- All features work without internet
- Service worker registered
- Assets cached on first visit
- Offline indicator shown when disconnected

## Notes

Critical for the app's offline-first nature.
