# Fumiki — Components

> Specification for every UI component. Per-theme variants, dimensions, states, and CSS.

---

## Architecture

Every component follows this structure:

```svelte
<element
  class="component-name"
  data-variant={$theme.layout.componentVariant}
>
```

- Base styles are shared across all themes (layout, display, box model)
- Visual styles come from CSS custom properties (colors, fonts, shadows)
- Structural variants use `data-variant` or theme-specific classes
- Decorative slots are conditional (`{#if $theme.decorations.x}`)

---

## 1. Button

### Variants

| Type | Usage |
|---|---|
| `primary` | Main actions: Resume, Save, Connect |
| `secondary` | Secondary actions: Secondary navigation |
| `ghost` | Tertiary actions: Notes, Cancel, Back |
| `danger` | Destructive: Delete, Disconnect |
| `icon` | Icon-only button (square) |

### Dimensions

| Size | Padding | Font Size | Height (approx) |
|---|---|---|---|
| `sm` | 7px 14px | 12px | 32px |
| `md` (default) | 10px 22px | 13px | 40px |
| `lg` | 13px 28px | 15px | 46px |

### Per-Theme Shape

| Property | Sumi | Kami | Mori |
|---|---|---|---|
| Border radius | `var(--radius)` = 2px | `var(--radius)` = 10px | `var(--radius)` = 14px |
| Font weight | 700 | 600 | 600 |
| Letter spacing | 0.12em | 0.01em | 0 |
| Text transform | uppercase | none | none |
| Font size (md) | 11px | 13px | 13px |

### States

```css
.btn {
  font-family: var(--font-body);
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  transition: all 200ms ease;
  border-radius: var(--radius);
}

/* Primary */
.btn-primary {
  background: var(--accent);
  color: var(--text-inverse);
}
.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px var(--accent-glow-strong);
}
.btn-primary:active {
  transform: translateY(0);
}
.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Secondary */
.btn-secondary {
  background: var(--surface-3);
  color: var(--text-primary);
}
.btn-secondary:hover {
  background: var(--surface-4);
}

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-medium);
}
.btn-ghost:hover {
  background: var(--surface-2);
  color: var(--text-primary);
  border-color: var(--border-strong);
}

/* Danger */
.btn-danger {
  background: var(--error);
  color: #fff;
}

/* Icon */
.btn-icon {
  width: 40px;
  height: 40px;
  padding: 0;
  background: transparent;
  color: var(--text-secondary);
  border-radius: var(--radius);
}
.btn-icon:hover {
  background: var(--surface-2);
  color: var(--text-primary);
}
```

### Sumi Override

```css
[data-theme="sumi"] .btn {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
```

---

## 2. Card

### Variants

| Type | Usage |
|---|---|
| `default` | Standard content card |
| `interactive` | Clickable card (book, realm) — has hover state |
| `elevated` | Modal-like card, higher shadow |
| `hero` | Featured card (continue reading) — larger, more prominent |

### Dimensions

```css
.card {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--card-padding);
  box-shadow: 0 2px 8px var(--shadow-color);
}

.card-interactive {
  cursor: pointer;
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
}
.card-interactive:hover {
  background: var(--surface-2);
  border-color: var(--border-medium);
}

.card-elevated {
  box-shadow: 0 8px 32px var(--shadow-color);
}

.card-hero {
  position: relative;
  overflow: hidden;
}
```

### Per-Theme Decoration

| Property | Sumi | Kami | Mori |
|---|---|---|---|
| Border radius | 2px | 12px | 16px |
| Border | 1px solid border-subtle | 1px solid border-subtle | none (shadow only) |
| Shadow depth | Minimal | Medium (warm) | Soft, diffuse |
| Hover effect | Red left accent bar appears | Subtle lift + warm shadow | Gentle scale(1.01) |

```css
/* Sumi: left accent bar on hover */
[data-theme="sumi"] .card-interactive:hover {
  border-left: 2px solid var(--accent);
}

/* Kami: warm lift */
[data-theme="kami"] .card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-color);
}

/* Mori: gentle scale */
[data-theme="mori"] .card-interactive:hover {
  transform: scale(1.01);
  box-shadow: 0 8px 24px var(--shadow-color);
}

/* Mori: no border, just shadow */
[data-theme="mori"] .card {
  border: none;
  box-shadow: 0 2px 12px var(--shadow-color);
}
```

---

## 3. Input

### Variants

| Type | Usage |
|---|---|
| `text` | Standard text input |
| `search` | Search with icon |
| `textarea` | Multi-line notes |
| `select` | Dropdown |

### Dimensions

| Size | Padding | Height |
|---|---|---|
| `sm` | 8px 12px | 34px |
| `md` | 10px 14px | 40px |
| `lg` | 13px 16px | 46px |

```css
.input {
  width: 100%;
  padding: 10px 14px;
  background: var(--surface-2);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: var(--body-size);
  outline: none;
  transition: all 200ms ease;
}

.input::placeholder {
  color: var(--text-muted);
}

.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow-strong);
}

/* Kami: slightly different bg on light theme */
[data-theme="kami"] .input {
  background: var(--surface-0);
  border-color: var(--border-strong);
}

/* Search variant */
.input-search {
  padding-left: 38px;
  background-image: url("data:image/svg+xml,..."); /* search icon */
  background-repeat: no-repeat;
  background-position: 12px center;
  background-size: 16px;
}

/* Textarea */
.textarea {
  min-height: 100px;
  resize: vertical;
  line-height: 1.6;
}
```

---

## 4. Progress Bar

### Dimensions

| Size | Track Height | Fill Radius |
|---|---|---|
| `xs` | 2px | Matches track |
| `sm` | 3px | Matches track |
| `md` | 5px | Matches track |
| `lg` | 8px | Matches track |

### Per-Theme Shape

| Property | Sumi | Kami | Mori |
|---|---|---|---|
| Default size | xs (2px) | md (5px) | sm–md (4px) |
| Border radius | 0 (flat) | 100px (pill) | 100px (pill) |
| Fill style | Solid accent | Gradient accent (slight) | Gradient with glow |

```css
.progress-track {
  height: 5px;
  background: var(--surface-3);
  border-radius: 100px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: inherit;
  transition: width 600ms cubic-bezier(0.16, 1, 0.3, 1);
}

.progress-fill-success {
  background: var(--success);
}

/* Sumi: flat, thin */
[data-theme="sumi"] .progress-track {
  height: 2px;
  border-radius: 0;
}
[data-theme="sumi"] .progress-fill {
  border-radius: 0;
}

/* Mori: subtle glow */
[data-theme="mori"] .progress-fill {
  box-shadow: 0 0 8px var(--accent-glow);
}
```

---

## 5. Navigation

### Bottom Tab Bar (Phone — All Themes)

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--surface-1);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: var(--z-sticky);
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 12px;
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: color 150ms;
}

.bottom-nav-item.active {
  color: var(--accent);
}

.bottom-nav-icon {
  font-size: 20px;
}
```

### Top Bar (Sumi — Tablet/Desktop)

```css
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--surface-1);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  padding: 0 var(--space-7);
  z-index: var(--z-sticky);
  backdrop-filter: blur(12px);
}
```

### Side Panel (Kami — Tablet/Desktop)

```css
.side-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: var(--surface-1);
  border-right: 1px solid var(--border-subtle);
  padding: var(--space-6) 0;
  display: flex;
  flex-direction: column;
  z-index: var(--z-sticky);
  overflow-y: auto;
}
```

### Navigation Items

```
Home        — Main dashboard, continue reading
Library     — Book grid with search/filter
Bonsai      — Full-screen bonsai + stats
Notes       — All notes browser
Settings    — Preferences, AI config, connection
```

---

## 6. Book Cover

### Dimensions

| Context | Width | Aspect Ratio |
|---|---|---|
| Grid (phone) | 100% of column | 2:3 |
| Grid (tablet+) | 100% of column | 2:3 |
| List row | 40px | 2:3 (40×56px) |
| Continue card | 100px | 2:3 (100×148px) |
| Detail page | 180px | 2:3 |

```css
.book-cover {
  aspect-ratio: 2 / 3;
  border-radius: var(--radius);
  background: var(--surface-3);
  overflow: hidden;
  position: relative;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Spine shadow (simulates physical book) */
.book-cover::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background: linear-gradient(90deg, hsl(0 0% 0% / 0.15), transparent);
  z-index: 1;
}

/* Sumi: minimal shadow */
[data-theme="sumi"] .book-cover {
  border-radius: 1px;
  box-shadow: 2px 2px 8px var(--shadow-color);
}

/* Kami: warm shadow, book-like */
[data-theme="kami"] .book-cover {
  border-radius: 4px;
  box-shadow: 3px 4px 12px var(--shadow-color);
}

/* Mori: soft shadow */
[data-theme="mori"] .book-cover {
  border-radius: 8px;
  box-shadow: 2px 4px 16px var(--shadow-color);
}
```

---

## 7. Toast / Notification

### Position Per Theme

| Theme | Position | Animation |
|---|---|---|
| Sumi | Bottom-left | Slide in from left |
| Kami | Bottom-center | Slide up |
| Mori | Top-center | Fade + slide down |

### Dimensions

```css
.toast {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-5);
  background: var(--surface-2);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius);
  box-shadow: 0 8px 24px var(--shadow-color);
  font-size: var(--body-sm-size);
  color: var(--text-primary);
  max-width: 380px;
}

.toast-accent {
  border-left: 3px solid var(--accent);
}

/* Auto-dismiss: 4 seconds default */
```

---

## 8. Modal / Dialog

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: hsl(0 0% 0% / 0.5);
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
}

.modal {
  background: var(--surface-1);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  padding: var(--space-7);
  max-width: 480px;
  width: 100%;
  box-shadow: 0 16px 48px var(--shadow-color);
}

.modal-title {
  font-family: var(--font-display);
  font-size: var(--heading-card-size);
  font-weight: var(--heading-card-weight);
  margin-bottom: var(--space-4);
}

.modal-body {
  margin-bottom: var(--space-6);
  color: var(--text-secondary);
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}

/* Sumi: modal slides from bottom on mobile */
/* Kami: centered, paper-textured bg feel */
/* Mori: centered, organic rounded corners */
```

---

## 9. Tag / Badge

### Dimensions

```css
.tag {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.02em;
  border-radius: 100px;
}

/* Sumi: sharp corners */
[data-theme="sumi"] .tag { border-radius: 2px; }

/* Variants */
.tag-accent {
  background: var(--accent-glow-strong);
  color: var(--accent-text);
  border: 1px solid var(--accent-border);
}

.tag-success {
  background: hsl(155 45% 42% / 0.12);
  color: var(--success);
  border: 1px solid hsl(155 45% 42% / 0.2);
}

.tag-muted {
  background: var(--surface-3);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}
```

---

## 10. Section Header

Used before every content section (Library, Activity, Realms, etc.)

```css
.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--heading-section-size);
  font-weight: var(--heading-section-weight);
  letter-spacing: var(--heading-section-letter-spacing);
  color: var(--text-primary);
}

.section-link {
  font-size: var(--body-sm-size);
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: color 150ms;
}

.section-link:hover {
  color: var(--accent);
}
```

### Sumi Decoration

```css
/* Sumi: horizontal line before section title */
[data-theme="sumi"] .section-title::before {
  content: '';
  display: inline-block;
  width: 16px;
  height: 1px;
  background: var(--accent);
  margin-right: var(--space-3);
  vertical-align: middle;
  opacity: 0.5;
}
```

---

## 11. List Item (Book Row)

Used in vertical book lists (Sumi default, Kami/Mori option).

```css
.list-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--list-item-padding);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 200ms;
  border: 1px solid transparent;
}

.list-item:hover {
  background: var(--surface-2);
  border-color: var(--border-subtle);
}

.list-item.active {
  background: var(--accent-glow);
  border-color: var(--accent-border);
}

/* Sumi: left accent on hover */
[data-theme="sumi"] .list-item {
  border-radius: 1px;
  border-left: 2px solid transparent;
}
[data-theme="sumi"] .list-item:hover {
  border-left-color: var(--accent);
}
```

---

## 12. Audio Player (Compact)

The audio player is always visible at the bottom when playing (above bottom nav on phone).

### Dimensions

| Context | Height |
|---|---|
| Phone (mini player) | 64px |
| Expanded (full page) | 100vh |

```css
.player-mini {
  position: fixed;
  bottom: 56px;            /* Above bottom nav */
  left: 0;
  right: 0;
  height: 64px;
  background: var(--surface-1);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  padding: 0 var(--space-4);
  gap: var(--space-3);
  z-index: var(--z-sticky);
}

.player-mini-cover {
  width: 44px;
  height: 44px;
  border-radius: var(--radius);
  background: var(--surface-3);
  flex-shrink: 0;
}

.player-mini-info {
  flex: 1;
  min-width: 0;
}

.player-mini-title {
  font-size: var(--body-sm-size);
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-mini-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--surface-3);
}

.player-mini-progress-fill {
  height: 100%;
  background: var(--accent);
}

.player-mini-controls {
  display: flex;
  gap: var(--space-2);
  flex-shrink: 0;
}
```

---

## 13. Divider

| Theme | Style |
|---|---|
| Sumi | Thin red accent line with brush-stroke mask |
| Kami | Subtle warm border (1px, border-subtle) |
| Mori | No visible line — spacing only (ma) |

```css
.divider {
  margin: var(--space-6) 0;
}

[data-theme="sumi"] .divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-border), transparent);
}

[data-theme="kami"] .divider {
  height: 1px;
  background: var(--border-subtle);
}

[data-theme="mori"] .divider {
  height: var(--space-6);
  background: none;
}
```

---

## 14. Empty State

When there's no content (no books, no notes, etc.)

```css
.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-6);
  color: var(--text-muted);
}

.empty-state-icon {
  font-size: 48px;
  margin-bottom: var(--space-4);
  opacity: 0.3;
}

.empty-state-title {
  font-family: var(--font-display);
  font-size: var(--heading-card-size);
  font-weight: var(--heading-card-weight);
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
}

.empty-state-text {
  font-size: var(--body-sm-size);
  max-width: 320px;
  margin: 0 auto;
  line-height: 1.6;
}
```

---

## 15. Transitions & Animations

### Duration Per Theme

```css
[data-theme="sumi"] { --transition-fast: 150ms; --transition-base: 200ms; --transition-slow: 300ms; }
[data-theme="kami"] { --transition-fast: 200ms; --transition-base: 300ms; --transition-slow: 400ms; }
[data-theme="mori"] { --transition-fast: 250ms; --transition-base: 400ms; --transition-slow: 600ms; }
```

### Easing

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);     /* Snappy out */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);    /* Smooth */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy (Mori only) */
}
```

### Page Enter Animation

```css
@keyframes page-enter {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-enter {
  animation: page-enter var(--transition-base) var(--ease-out) both;
}
```

### Stagger (for lists/grids)

```css
.stagger > :nth-child(1) { animation-delay: 0ms; }
.stagger > :nth-child(2) { animation-delay: 50ms; }
.stagger > :nth-child(3) { animation-delay: 100ms; }
.stagger > :nth-child(4) { animation-delay: 150ms; }
.stagger > :nth-child(5) { animation-delay: 200ms; }
.stagger > :nth-child(n+6) { animation-delay: 250ms; }
```

---

*Companion to FUMIKI_COLORS.md, FUMIKI_SPACING.md, and FUMIKI_TYPOGRAPHY.md*
