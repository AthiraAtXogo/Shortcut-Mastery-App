# Task: Nuxt 4 Project Setup

## Objective

Initialize a new Nuxt 4 project with TypeScript, Tailwind CSS, and Nuxt UI.

## Requirements

- [ ] Create Nuxt 4 project with `pnpm`
- [ ] Enable strict TypeScript
- [ ] Install and configure Tailwind CSS
- [ ] Install Nuxt UI
- [ ] Configure design tokens (colors, spacing)
- [ ] Set up folder structure (`components/`, `composables/`, `stores/`, `pages/`)
- [ ] Configure path aliases

## Technical Details

### Dependencies

```bash
pnpm add @nuxt/ui @nuxtjs/tailwindcss
```

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: true
  }
})
```

### Folder Structure

```
src/
├── assets/
│   └── css/
│       └── main.css
├── components/
│   ├── game/
│   ├── ui/
│   └── three/
├── composables/
├── pages/
├── stores/
├── data/
└── types/
```

## Acceptance Criteria

- `pnpm dev` starts without errors
- TypeScript strict mode enabled
- Tailwind classes work
- Nuxt UI components render
- Design tokens defined in tailwind.config.ts

## Notes

This is the foundation - must be solid before proceeding.
