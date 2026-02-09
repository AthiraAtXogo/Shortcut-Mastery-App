# Task: Design Tokens

## Objective

Define the core design tokens (colors, spacing, shadows) as CSS variables and Tailwind config.

## Requirements

- [ ] Define color palette
- [ ] Set up spacing scale
- [ ] Create shadow system
- [ ] Configure in tailwind.config.ts
- [ ] Create CSS variables for runtime theming

## Technical Details

### Color Palette

```css
:root {
  /* Background */
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-tertiary: #1a1a25;
  --bg-card: rgba(255, 255, 255, 0.03);

  /* Primary - Electric Blue */
  --primary-50: #e6faff;
  --primary-100: #b3f0ff;
  --primary-200: #80e6ff;
  --primary-300: #4ddbff;
  --primary-400: #1ad1ff;
  --primary-500: #00d4ff;
  --primary-600: #00a8cc;
  --primary-700: #007c99;
  --primary-800: #005066;
  --primary-900: #002433;

  /* Secondary - Neon Purple */
  --secondary-500: #a855f7;
  --secondary-400: #c084fc;
  --secondary-600: #9333ea;

  /* Success - Lime Green */
  --success-500: #84cc16;
  --success-400: #a3e635;
  --success-600: #65a30d;

  /* Error - Hot Pink */
  --error-500: #f43f5e;
  --error-400: #fb7185;
  --error-600: #e11d48;

  /* Accent - Orange Spark */
  --accent-500: #f97316;
  --accent-400: #fb923c;
  --accent-600: #ea580c;

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted: rgba(255, 255, 255, 0.4);

  /* Glow Effects */
  --glow-primary: 0 0 20px rgba(0, 212, 255, 0.5);
  --glow-success: 0 0 20px rgba(132, 204, 22, 0.5);
  --glow-error: 0 0 20px rgba(244, 63, 94, 0.5);
}
```

### Tailwind Config

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        background: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          card: 'var(--bg-card)'
        },
        primary: {
          50: 'var(--primary-50)',
          // ...
          500: 'var(--primary-500)',
          // ...
        },
        // ... other colors
      },
      boxShadow: {
        'glow-primary': 'var(--glow-primary)',
        'glow-success': 'var(--glow-success)',
        'glow-error': 'var(--glow-error)'
      }
    }
  }
}
```

## Acceptance Criteria

- All colors accessible via Tailwind classes
- CSS variables defined for runtime changes
- Consistent usage across components
- Dark theme looks premium

## Notes

Foundation for all visual components.
