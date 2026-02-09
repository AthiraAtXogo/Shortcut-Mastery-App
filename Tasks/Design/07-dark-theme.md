# Task: Dark Theme Implementation

## Objective

Implement the dark gaming aesthetic as the primary (and only) theme.

## Requirements

- [ ] Set dark background colors globally
- [ ] Configure Nuxt UI for dark mode
- [ ] Style all native elements (inputs, scrollbars)
- [ ] Add subtle texture/noise overlay
- [ ] Ensure consistent dark feel

## Technical Details

### Global Styles

```css
/* assets/css/main.css */

html {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

body {
  min-height: 100vh;
  background: var(--bg-primary);
}

/* Subtle noise texture overlay */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('/textures/noise.png');
  opacity: 0.03;
  pointer-events: none;
  z-index: 9999;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-700);
}

/* Selection */
::selection {
  background: var(--primary-500);
  color: var(--bg-primary);
}

/* Focus rings */
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

### Nuxt UI Config

```typescript
// app.config.ts
export default defineAppConfig({
  ui: {
    primary: 'cyan',
    gray: 'neutral',
    strategy: 'override',
    // Force dark mode
    icons: {
      dark: 'i-heroicons-moon-20-solid',
      light: 'i-heroicons-sun-20-solid'
    }
  }
})
```

### Input Styles

```css
input, textarea, select {
  background: var(--bg-tertiary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border-radius: 8px;
}

input:focus, textarea:focus, select:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}
```

## Acceptance Criteria

- No white/light backgrounds anywhere
- Consistent dark feel throughout
- Good contrast for text
- Custom scrollbars match theme
- Inputs styled for dark mode

## Notes

The dark theme IS the brand. No light mode planned.
