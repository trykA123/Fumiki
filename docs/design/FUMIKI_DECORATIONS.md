# Fumiki — Decorations & Ornaments

> Theme-specific visual embellishments: borders, patterns, textures, and ornamental elements.

---

## Philosophy

Decorations are the primary differentiator between themes at the **visual** level (beyond color).
They must be:

- **Optional** — components work with or without them
- **Lightweight** — CSS-only or small inline SVGs, no heavy images
- **Subtle** — 2-5% opacity for background patterns, never distracting
- **Conditional** — rendered only when the active theme includes them

---

## 1. Sumi Decorations

> Brush strokes, ink marks, geometric precision.

### Brush-Stroke Line

Used as: section dividers, card top/bottom accents, nav border.

```css
[data-theme="sumi"] .brush-line {
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='4'%3E%3Cpath d='M0 2 Q25 0 50 2 Q75 4 100 2 Q125 0 150 2 Q175 4 200 2' stroke='white' stroke-width='3' fill='none'/%3E%3C/svg%3E") repeat-x;
  mask-size: 200px 4px;
}
```

### Left Accent Bar

Used on: active list items, stat cards, active nav items.

```css
[data-theme="sumi"] .accent-bar-left {
  border-left: 2px solid var(--accent);
}
```

### Diamond Marker

Used in: timeline dots, list bullet replacement.

```css
[data-theme="sumi"] .marker::before {
  content: '';
  width: 5px;
  height: 5px;
  background: var(--accent);
  transform: rotate(45deg);
}
```

### Corner Brackets

Used on: stat strips, featured sections.

```css
[data-theme="sumi"] .corner-brackets::before {
  content: '┌';
  position: absolute;
  top: -1px; left: 0;
  color: var(--accent);
  opacity: 0.3;
  font-size: 14px;
}

[data-theme="sumi"] .corner-brackets::after {
  content: '┘';
  position: absolute;
  bottom: -1px; right: 0;
  color: var(--accent);
  opacity: 0.3;
  font-size: 14px;
}
```

### Vertical Line

Used above/below hero sections.

```css
[data-theme="sumi"] .vertical-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(180deg, transparent, var(--accent));
  margin: 0 auto;
  opacity: 0.4;
}
```

### Seigaiha Pattern (ambient)

Extremely subtle background pattern for page header areas.

```css
[data-theme="sumi"] .ambient-pattern::before {
  content: '';
  position: absolute;
  top: -40px; right: -40px;
  width: 300px; height: 300px;
  opacity: 0.015;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='28'%3E%3Cpath d='M56 26v2h-7.75c2.3-1.3 4.94-2 7.75-2zm-26 2a14 14 0 00-7.75-2h-.5A14 14 0 0014 28h28zM42 26a14 14 0 00-7.75 2h-4.5A14 14 0 0022 26H0v2h14c2.8 0 5.44.7 7.75 2h4.5c2.3-1.3 4.94-2 7.75-2h14v-2H42z' fill='%23c22038'/%3E%3C/svg%3E");
  pointer-events: none;
}
```

---

## 2. Kami Decorations

> Paper texture, ink strokes, manuscript marks.

### Paper Grain Texture

Applied to surface-0 (page background) and cards.

```css
[data-theme="kami"] body {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
}
```

Note: This is a lightweight SVG noise filter, not a raster image. It creates
a subtle paper grain effect at virtually zero file size cost.

### Ink Splatter Accent

Used on: hero cards, featured sections (subtle background marks).

Small ink dots/splatters positioned absolutely, very low opacity.

```css
[data-theme="kami"] .ink-splatter::before {
  content: '';
  position: absolute;
  top: -8px; left: 15%;
  width: 60px; height: 4px;
  background: var(--accent);
  opacity: 0.08;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='4'%3E%3Ccircle cx='4' cy='2' r='2' fill='white'/%3E%3Ccircle cx='18' cy='1' r='1' fill='white'/%3E%3Ccircle cx='30' cy='3' r='1.5' fill='white'/%3E%3Ccircle cx='45' cy='1' r='1' fill='white'/%3E%3C/svg%3E") no-repeat;
}
```

### Warm Rule Divider

Simple, warm-toned horizontal rule.

```css
[data-theme="kami"] .divider {
  height: 1px;
  background: var(--border-subtle);
}
```

### Book Spine Shadow

All book covers in Kami get a stronger spine shadow for a physical book feel.

```css
[data-theme="kami"] .book-cover::before {
  width: 8px;
  background: linear-gradient(90deg, hsl(30 30% 20% / 0.2), transparent);
}
```

### Indent Mark

Section labels in Kami get a subtle em-dash before them (like a book's table of contents).

```css
[data-theme="kami"] .section-title::before {
  content: '— ';
  color: var(--text-muted);
  font-weight: 300;
}
```

---

## 3. Mori Decorations

> Organic shapes, botanical line art, natural textures.

### Wood Grain (cards)

Subtle wood grain texture on card backgrounds.

```css
[data-theme="mori"] .card {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 0.2' numOctaves='3' seed='5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23w)' opacity='0.015'/%3E%3C/svg%3E");
}
```

### Leaf Dot Divider

Instead of a line, Mori uses three small circles (like seeds) as a section break.

```css
[data-theme="mori"] .divider {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: var(--space-6) 0;
}

[data-theme="mori"] .divider::before,
[data-theme="mori"] .divider::after {
  content: '';
  width: 4px; height: 4px;
  background: var(--text-muted);
  border-radius: 50%;
  opacity: 0.3;
}

/* Center dot via a pseudo-element workaround or a real element */
```

### Organic Glow

Cards and interactive elements get a soft, warm glow instead of hard borders.

```css
[data-theme="mori"] .card {
  border: none;
  box-shadow: 0 2px 16px var(--shadow-color), 0 0 0 1px hsl(145 12% 40% / 0.04);
}

[data-theme="mori"] .card-interactive:hover {
  box-shadow: 0 4px 24px var(--shadow-color), 0 0 0 1px var(--accent-border);
}
```

### No Hard Lines

Mori avoids visible borders wherever possible. Separation is achieved through:
- Spacing (ma — negative space)
- Shadow depth differences
- Background color differences between surface levels

```css
/* Border overrides for Mori */
[data-theme="mori"] .bottom-nav { border-top: none; box-shadow: 0 -4px 16px var(--shadow-color); }
[data-theme="mori"] .input { border: none; box-shadow: inset 0 1px 3px var(--shadow-color); }
[data-theme="mori"] .input:focus { box-shadow: inset 0 1px 3px var(--shadow-color), 0 0 0 3px var(--accent-glow-strong); }
```

---

## 4. Decoration Slots in Components

Components expose optional decoration slots that themes can fill:

```typescript
interface ThemeDecorations {
  // Hero
  heroTopOrnament?: boolean;       // Sumi: vertical line, Kami: none, Mori: none
  heroBottomOrnament?: boolean;    // Sumi: vertical line, Kami: none, Mori: none

  // Cards
  cardTopAccent?: boolean;         // Sumi: red line at top of hero card
  cardSpineEffect?: boolean;       // Kami: stronger book spine shadow

  // Sections
  sectionTitlePrefix?: string;     // Sumi: red line, Kami: em-dash, Mori: none
  dividerStyle: 'line' | 'dots' | 'space';

  // Backgrounds
  pageGrainTexture?: boolean;      // Kami: paper grain
  cardWoodTexture?: boolean;       // Mori: wood grain
  ambientPattern?: boolean;        // Sumi: seigaiha in corner

  // Page
  pageGlow?: string;               // Sumi: red radial, Kami: none, Mori: amber radial
}
```

### Summary Table

| Decoration | Sumi | Kami | Mori |
|---|---|---|---|
| Background glow | Red radial at top | None | Amber radial at top |
| Page texture | None (flat) | Paper grain | None (flat) |
| Card texture | None | None | Wood grain (very subtle) |
| Section prefix | Red horizontal line | Em-dash | None |
| Divider | Brush-stroke line | Warm rule | Dot spacing |
| Card accent | Left red bar (hover) | Spine shadow | Organic glow |
| Hero ornaments | Vertical lines above/below | None | None |
| List markers | Diamond ◆ | Bullet • | Circle ○ |
| Corner marks | ┌ ┘ brackets | None | None |
| Active indicator | Red left border | Warm bg highlight | Amber glow ring |

---

## 5. Implementation Notes

1. **All decorations are CSS-only.** No external images, no JavaScript-driven effects.
   SVG patterns are inlined as data URIs.

2. **Decorations never affect layout.** They are `position: absolute` overlays, `box-shadow`,
   or `background-image` — they don't shift content.

3. **Opacity is key.** Background patterns should be 1.5–3% opacity maximum.
   Accent decorations (like brush lines) should be 30–50% opacity.
   Nothing should compete with content.

4. **Performance.** SVG filter textures (paper grain, wood grain) use `<feTurbulence>` which
   is GPU-accelerated in modern browsers. Should not impact scroll performance.
   If it does on low-end devices, provide a `prefers-reduced-motion` fallback that removes them.

5. **Reduced motion.** All animations and transitions respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

*Companion to FUMIKI_COLORS.md, FUMIKI_SPACING.md, FUMIKI_TYPOGRAPHY.md, and FUMIKI_COMPONENTS.md*
