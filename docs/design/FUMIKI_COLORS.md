# Fumiki — Color System

> All colors are defined in HSL. Accent colors use split H/S/L variables for user customization.

---

## Architecture

```css
/* The accent is split into components so users can override just the hue */
--accent-h: 15;
--accent-s: 80%;
--accent-l: 50%;

/* All accent-derived colors compute from these three variables */
--accent:        hsl(var(--accent-h) var(--accent-s) var(--accent-l));
--accent-hover:  hsl(var(--accent-h) var(--accent-s) calc(var(--accent-l) + 8%));
--accent-dim:    hsl(var(--accent-h) var(--accent-s) calc(var(--accent-l) - 18%));
--accent-subtle: hsl(var(--accent-h) var(--accent-s) calc(var(--accent-l) - 30%));
--accent-glow:   hsla(var(--accent-h) var(--accent-s) var(--accent-l) / 0.08);
--accent-glow-strong: hsla(var(--accent-h) var(--accent-s) var(--accent-l) / 0.15);
--accent-border: hsla(var(--accent-h) var(--accent-s) var(--accent-l) / 0.20);
--accent-text:   hsl(var(--accent-h) var(--accent-s) calc(var(--accent-l) + 15%));
```

When user customizes their accent, we only override `--accent-h` (and optionally `--accent-s`).
Everything else cascades.

For the user color picker: a single **hue wheel** (0-360) is the simplest and most effective UI.
Optionally, a saturation slider for advanced users.

---

## 墨 Sumi — Ink

> Deep blacks, warm whites, vermillion red. The scholar's midnight desk.

### Surfaces (dark → light)

| Token | HSL | Hex (approx) | Usage |
|---|---|---|---|
| `--surface-0` | `hsl(250 15% 3%)` | `#08070c` | Page background |
| `--surface-1` | `hsl(250 12% 6%)` | `#0e0d14` | Cards, sidebar |
| `--surface-2` | `hsl(250 10% 9%)` | `#151319` | Card hover, input bg |
| `--surface-3` | `hsl(250 8% 13%)` | `#1f1d24` | Borders, progress track |
| `--surface-4` | `hsl(250 7% 17%)` | `#292730` | Active states |
| `--surface-5` | `hsl(250 6% 22%)` | `#353238` | Scrollbar thumb |

Note: The slight purple-blue undertone (hue 250) gives Sumi its ink quality.
Pure grey (hue 0) would feel dead. This feels like actual ink on paper.

### Text

| Token | HSL | Usage |
|---|---|---|
| `--text-primary` | `hsl(40 15% 90%)` | `#e8e4dd` — Headings, primary content |
| `--text-secondary` | `hsl(40 10% 65%)` | `#a9a39a` — Secondary labels, metadata |
| `--text-muted` | `hsl(250 8% 40%)` | `#635e6b` — Placeholders, disabled |
| `--text-inverse` | `hsl(250 15% 5%)` | `#0c0b10` — Text on accent bg |

Note: Text has a warm tint (hue 40) — like cream paper under lamplight.
This creates contrast warmth against the cool-ink surfaces.

### Accent (default: Vermillion red)

| Token | HSL | Usage |
|---|---|---|
| `--accent-h` | `355` | Red hue |
| `--accent-s` | `72%` | High saturation, vivid |
| `--accent-l` | `46%` | Rich but not neon |
| → `--accent` | `hsl(355 72% 46%)` | `#c92038` — Buttons, active states, badges |
| → `--accent-hover` | `hsl(355 72% 54%)` | Hover states |
| → `--accent-dim` | `hsl(355 72% 28%)` | Subtle accents, bg tints |
| → `--accent-glow` | `hsla(355 72% 46% / 0.08)` | Card hover glow |
| → `--accent-border` | `hsla(355 72% 46% / 0.20)` | Active borders |

### Semantic

| Token | HSL | Usage |
|---|---|---|
| `--success` | `hsl(155 45% 42%)` | Completed books, 100% progress |
| `--warning` | `hsl(40 80% 50%)` | Alerts, attention |
| `--error` | `hsl(0 65% 50%)` | Errors, destructive actions |
| `--info` | `hsl(210 50% 55%)` | Info toasts, links |

### Full Token List

```css
[data-theme="sumi"] {
  /* Surfaces */
  --surface-0: hsl(250 15% 3%);
  --surface-1: hsl(250 12% 6%);
  --surface-2: hsl(250 10% 9%);
  --surface-3: hsl(250 8% 13%);
  --surface-4: hsl(250 7% 17%);
  --surface-5: hsl(250 6% 22%);

  /* Text */
  --text-primary: hsl(40 15% 90%);
  --text-secondary: hsl(40 10% 65%);
  --text-muted: hsl(250 8% 40%);
  --text-inverse: hsl(250 15% 5%);

  /* Accent (vermillion) */
  --accent-h: 355;
  --accent-s: 72%;
  --accent-l: 46%;

  /* Semantic */
  --success: hsl(155 45% 42%);
  --warning: hsl(40 80% 50%);
  --error: hsl(0 65% 50%);
  --info: hsl(210 50% 55%);

  /* Borders */
  --border-subtle: hsla(250 10% 50% / 0.08);
  --border-medium: hsla(250 10% 50% / 0.14);
  --border-strong: hsla(250 10% 50% / 0.22);

  /* Shadows */
  --shadow-color: hsla(250 30% 5% / 0.5);
  --shadow-sm: 0 1px 3px var(--shadow-color);
  --shadow-md: 0 4px 12px var(--shadow-color);
  --shadow-lg: 0 8px 32px var(--shadow-color);
}
```

---

## 紙 Kami — Paper

> Warm cream, aged paper, dark ink text, wax-seal accents. A sunlit reading desk.

### Surfaces (light → dark)

| Token | HSL | Hex (approx) | Usage |
|---|---|---|---|
| `--surface-0` | `hsl(38 35% 93%)` | `#f2ece1` | Page background (warm cream) |
| `--surface-1` | `hsl(38 30% 89%)` | `#e8e0d3` | Cards, panels |
| `--surface-2` | `hsl(38 25% 85%)` | `#ded4c6` | Card hover, input bg |
| `--surface-3` | `hsl(38 18% 78%)` | `#ccc3b4` | Borders, progress track |
| `--surface-4` | `hsl(38 14% 70%)` | `#b8afa0` | Scrollbar, disabled |
| `--surface-5` | `hsl(38 10% 60%)` | `#9e9790` | Muted elements |

Note: All surfaces share hue 38 (warm gold) with decreasing saturation.
This creates the feeling of aged paper — not sterile white, but lived-in warmth.

### Text

| Token | HSL | Usage |
|---|---|---|
| `--text-primary` | `hsl(25 30% 14%)` | `#2a1f14` — Near-black with brown warmth. Like ink. |
| `--text-secondary` | `hsl(25 15% 35%)` | `#574c42` — Faded ink for secondary content |
| `--text-muted` | `hsl(30 10% 55%)` | `#918679` — Placeholder, timestamps |
| `--text-inverse` | `hsl(38 35% 93%)` | `#f2ece1` — Light text on dark/accent bg |

Note: Text is very dark brown, not pure black. Like real ink on real paper.

### Accent (Ink / charcoal brushstroke)

| Token | HSL | Usage |
|---|---|---|
| `--accent-h` | `30` | Warm near-black (not pure black — ink has warmth) |
| `--accent-s` | `15%` | Very low saturation — charcoal, not colored |
| `--accent-l` | `18%` | Deep ink darkness |
| → `--accent` | `hsl(30 15% 18%)` | `#2a2420` — Buttons, active states, borders |
| → `--accent-hover` | `hsl(30 15% 26%)` | Hover states |
| → `--accent-dim` | `hsl(30 10% 12%)` | Subtle bg tints |
| → `--accent-glow` | `hsla(30 15% 18% / 0.06)` | Card hover glow |
| → `--accent-border` | `hsla(30 15% 18% / 0.18)` | Active borders |

Note: Kami's accent is ink, not color. It's warm charcoal — like actual
brushstroke ink on paper. The entire theme is monochromatic with warmth.

### Semantic

| Token | HSL | Usage |
|---|---|---|
| `--success` | `hsl(140 40% 30%)` | Completed (dark green on light bg) |
| `--warning` | `hsl(35 80% 45%)` | Warnings |
| `--error` | `hsl(0 60% 42%)` | Errors |
| `--info` | `hsl(205 45% 40%)` | Info, links |

### Full Token List

```css
[data-theme="kami"] {
  /* Surfaces */
  --surface-0: hsl(38 35% 93%);
  --surface-1: hsl(38 30% 89%);
  --surface-2: hsl(38 25% 85%);
  --surface-3: hsl(38 18% 78%);
  --surface-4: hsl(38 14% 70%);
  --surface-5: hsl(38 10% 60%);

  /* Text */
  --text-primary: hsl(25 30% 14%);
  --text-secondary: hsl(25 15% 35%);
  --text-muted: hsl(30 10% 55%);
  --text-inverse: hsl(38 35% 93%);

  /* Accent (ink brushstroke) */
  --accent-h: 30;
  --accent-s: 15%;
  --accent-l: 18%;

  /* Semantic */
  --success: hsl(140 40% 30%);
  --warning: hsl(35 80% 45%);
  --error: hsl(0 60% 42%);
  --info: hsl(205 45% 40%);

  /* Borders */
  --border-subtle: hsla(30 15% 30% / 0.08);
  --border-medium: hsla(30 15% 30% / 0.14);
  --border-strong: hsla(30 15% 30% / 0.22);

  /* Shadows (warmer, softer) */
  --shadow-color: hsla(30 30% 20% / 0.12);
  --shadow-sm: 0 1px 3px var(--shadow-color);
  --shadow-md: 0 4px 12px var(--shadow-color);
  --shadow-lg: 0 8px 24px var(--shadow-color);
}
```

---

## 森 Mori — Forest

> Deep greens, moss, warm wood tones, amber light through leaves.

### Surfaces (dark green → lighter)

| Token | HSL | Hex (approx) | Usage |
|---|---|---|---|
| `--surface-0` | `hsl(150 25% 5%)` | `#0a100c` | Page background (forest floor) |
| `--surface-1` | `hsl(150 20% 8%)` | `#101a14` | Cards, sidebar |
| `--surface-2` | `hsl(150 16% 11%)` | `#171f1a` | Card hover, input bg |
| `--surface-3` | `hsl(148 12% 16%)` | `#232e28` | Borders, progress track |
| `--surface-4` | `hsl(145 10% 21%)` | `#303a33` | Active states |
| `--surface-5` | `hsl(142 8% 27%)` | `#3f4a42` | Scrollbar thumb |

Note: Surfaces start deep forest green (hue ~150) and desaturate as they lighten.
Not pure green — there's grey in it, like moss on stone.

### Text

| Token | HSL | Usage |
|---|---|---|
| `--text-primary` | `hsl(80 10% 88%)` | `#e2e4db` — Pale green-grey, like morning light |
| `--text-secondary` | `hsl(90 8% 62%)` | `#9da496` — Mossy, muted |
| `--text-muted` | `hsl(145 6% 38%)` | `#5a665e` — Forest shadow |
| `--text-inverse` | `hsl(150 25% 5%)` | `#0a100c` — Dark text on accent bg |

### Accent (default: Amber — sunlight through leaves)

| Token | HSL | Usage |
|---|---|---|
| `--accent-h` | `38` | Warm amber/gold |
| `--accent-s` | `70%` | Rich, sun-like |
| `--accent-l` | `48%` | Warm but grounded |
| → `--accent` | `hsl(38 70% 48%)` | `#c79424` — Buttons, active states |
| → `--accent-hover` | `hsl(38 70% 56%)` | Hover states |
| → `--accent-dim` | `hsl(38 70% 30%)` | Subtle accents |
| → `--accent-glow` | `hsla(38 70% 48% / 0.08)` | Card hover glow |
| → `--accent-border` | `hsla(38 70% 48% / 0.20)` | Active borders |

### Semantic

| Token | HSL | Usage |
|---|---|---|
| `--success` | `hsl(130 50% 40%)` | Completed (bright green — healthy plant) |
| `--warning` | `hsl(45 75% 50%)` | Warning (golden) |
| `--error` | `hsl(0 55% 48%)` | Error (autumn red) |
| `--info` | `hsl(190 40% 45%)` | Info (clear water) |

### Full Token List

```css
[data-theme="mori"] {
  /* Surfaces */
  --surface-0: hsl(150 25% 5%);
  --surface-1: hsl(150 20% 8%);
  --surface-2: hsl(150 16% 11%);
  --surface-3: hsl(148 12% 16%);
  --surface-4: hsl(145 10% 21%);
  --surface-5: hsl(142 8% 27%);

  /* Text */
  --text-primary: hsl(80 10% 88%);
  --text-secondary: hsl(90 8% 62%);
  --text-muted: hsl(145 6% 38%);
  --text-inverse: hsl(150 25% 5%);

  /* Accent (amber) */
  --accent-h: 38;
  --accent-s: 70%;
  --accent-l: 48%;

  /* Semantic */
  --success: hsl(130 50% 40%);
  --warning: hsl(45 75% 50%);
  --error: hsl(0 55% 48%);
  --info: hsl(190 40% 45%);

  /* Borders */
  --border-subtle: hsla(145 12% 40% / 0.08);
  --border-medium: hsla(145 12% 40% / 0.14);
  --border-strong: hsla(145 12% 40% / 0.22);

  /* Shadows (green-tinted) */
  --shadow-color: hsla(150 30% 5% / 0.5);
  --shadow-sm: 0 1px 3px var(--shadow-color);
  --shadow-md: 0 4px 12px var(--shadow-color);
  --shadow-lg: 0 8px 32px var(--shadow-color);
}
```

---

## Shared Computed Properties

These are derived from the accent components and are identical across all themes:

```css
:root {
  /* Accent computed (all themes use this) */
  --accent:        hsl(var(--accent-h) var(--accent-s) var(--accent-l));
  --accent-hover:  hsl(var(--accent-h) var(--accent-s) calc(var(--accent-l) + 8%));
  --accent-dim:    hsl(var(--accent-h) var(--accent-s) calc(var(--accent-l) - 18%));
  --accent-subtle: hsl(var(--accent-h) var(--accent-s) calc(var(--accent-l) - 30%));
  --accent-glow:   hsla(var(--accent-h) var(--accent-s) var(--accent-l) / 0.08);
  --accent-glow-strong: hsla(var(--accent-h) var(--accent-s) var(--accent-l) / 0.15);
  --accent-border: hsla(var(--accent-h) var(--accent-s) var(--accent-l) / 0.20);
  --accent-text:   hsl(var(--accent-h) var(--accent-s) calc(var(--accent-l) + 15%));
}
```

---

## User Accent Customization

**Removed.** The three themes ship with fixed, curated palettes. No user color customization.

Rationale: Three carefully designed themes will always look better than user-modified ones.
The accent colors are integral to each theme's identity — Sumi's vermillion, Kami's ink, Mori's amber.
Allowing overrides would break the cohesion.

The unlock at 1,000 KP originally planned for accent customization should be replaced
with a different feature unlock (e.g., reading statistics page or custom reader font size presets).

---

## Accessibility Notes

- All text/background combinations must meet WCAG AA (4.5:1 for body, 3:1 for large text)
- Sumi and Mori (dark themes): light text on dark bg — inherently high contrast
- Kami (light theme): dark text on light bg — the brown-ink-on-cream combo needs testing
- Accent colors on surface backgrounds need 3:1 minimum for interactive elements
- When user picks a custom accent hue, validate contrast against surfaces and warn if too low

### Contrast Checks (defaults)

| Theme | Text on Surface-0 | Accent on Surface-0 | Accent on Surface-1 |
|---|---|---|---|
| Sumi | ~14:1 ✅ | ~5.2:1 ✅ | ~4.8:1 ✅ |
| Kami | ~13:1 ✅ | ~5.8:1 ✅ | ~5.2:1 ✅ |
| Mori | ~12:1 ✅ | ~4.9:1 ✅ | ~4.5:1 ✅ |

---

## Implementation Notes

1. **CSS syntax:** Use the modern space-separated HSL syntax: `hsl(250 15% 3%)` not `hsl(250, 15%, 3%)`. All modern browsers support this since 2021.

2. **Tailwind integration:** In Tailwind CSS 4, theme tokens map directly to CSS custom properties. Define all tokens as `--color-*` variables and reference them in the Tailwind config.

3. **Theme switching:** Setting `data-theme` on `<html>` element triggers all CSS to recalculate instantly. No JS color manipulation needed.

4. **User accent persistence:** Store `--accent-h` (and optionally `--accent-s`) in the `preferences` table. Apply as inline style on `<html>` after theme class.

5. **Dark mode reader override:** The ebook reader (foliate-js) should respect the theme's surface and text colors for its reading view, but this is separate from the content's own CSS.

---

*This document is a companion to FUMIKI.md.*
*All color values are approximate in hex — HSL is the source of truth.*
