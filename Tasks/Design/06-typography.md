# Task: Typography System

## Objective

Set up the typography system with custom fonts and text styles.

## Requirements

- [ ] Choose and load fonts (Google Fonts or local)
- [ ] Define type scale
- [ ] Create text utility classes
- [ ] Set up font weights
- [ ] Ensure good readability

## Technical Details

### Font Selection

| Use | Font | Fallback |
|-----|------|----------|
| Headings | Inter or Space Grotesk | system-ui |
| Body | Inter | system-ui |
| Mono (shortcuts) | JetBrains Mono | monospace |

### Type Scale

```css
:root {
  /* Font Families */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  --text-6xl: 4rem;      /* 64px */

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Letter Spacing */
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
}
```

### Tailwind Config

```typescript
// tailwind.config.ts
export default {
  theme: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace']
    }
  }
}
```

### Text Styles

| Class | Use Case |
|-------|----------|
| .text-hero | Main headlines |
| .text-title | Section titles |
| .text-body | Body text |
| .text-caption | Small labels |
| .text-shortcut | Keyboard shortcuts |

## Acceptance Criteria

- Fonts load without FOUT/FOIT issues
- Type scale is consistent
- Shortcuts display in monospace
- Good contrast ratios (WCAG AA)

## Notes

Typography sets the tone - clean, modern, readable.
