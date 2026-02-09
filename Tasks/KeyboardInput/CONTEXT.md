# KeyboardInput - Feature Context

## Purpose

Handle keyboard input capture, modifier key detection, combo validation, and visual keyboard feedback. This is the core gameplay mechanic - users press actual keyboard shortcuts.

## Dependencies

- Core/01-nuxt-setup (Vue)
- Core/05-howler-audio (feedback sounds)

## Tasks Overview

| Task | Description | Priority |
|------|-------------|----------|
| 01-key-capture | Capture keyboard events globally | P0 |
| 02-modifier-handling | Track Ctrl, Shift, Alt, Meta states | P0 |
| 03-combo-validation | Validate pressed keys against expected | P0 |
| 04-visual-keyboard | 2D keyboard component with key states | P0 |
| 05-input-feedback | Visual/audio feedback on key press | P1 |

## Technical Considerations

- Must work cross-platform (Windows/Mac key differences)
- Prevent default browser shortcuts from triggering
- Handle both keydown and keyup for modifiers
- Support multi-key combinations (Ctrl+Shift+P)
- Accessibility: must not interfere with screen readers
