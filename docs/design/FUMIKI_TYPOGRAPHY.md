# Fumiki — Typography

> Font stacks, type scale, weights, line heights, and letter spacing for all three themes.

---

## 1. Font Stacks

### Per Theme

| Role | Sumi | Kami | Mori |
|---|---|---|---|
| Display (headings, titles) | `'Noto Serif JP', serif` | `'Crimson Pro', Georgia, serif` | `'DM Sans', system-ui, sans-serif` |
| Body (content, UI) | `'DM Sans', system-ui, sans-serif` | `'DM Sans', system-ui, sans-serif` | `'DM Sans', system-ui, sans-serif` |
| Mono (data, KP, code) | `'JetBrains Mono', monospace` | `'JetBrains Mono', monospace` | `'JetBrains Mono', monospace` |

```css
[data-theme="sumi"] {
  --font-display: 'Noto Serif JP', serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

[data-theme="kami"] {
  --font-display: 'Crimson Pro', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

[data-theme="mori"] {
  --font-display: 'DM Sans', system-ui, sans-serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Google Fonts Import

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200;300;400;600&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 2. Type Scale

Based on a 1.25 ratio (major third) from a 16px base.

```css
:root {
  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 15px;
  --text-md:   16px;
  --text-lg:   18px;
  --text-xl:   22px;
  --text-2xl:  28px;
  --text-3xl:  34px;
  --text-4xl:  42px;
}
```

---

## 3. Semantic Typography Tokens

These map purposes to sizes, weights, and line heights. Components use these tokens, not raw values.

```css
:root {
  /* Page title (hero headings) */
  --heading-hero-size: var(--text-4xl);
  --heading-hero-weight: 300;
  --heading-hero-line-height: 1.15;
  --heading-hero-letter-spacing: -0.01em;

  /* Section title */
  --heading-section-size: var(--text-xl);
  --heading-section-weight: 600;
  --heading-section-line-height: 1.3;
  --heading-section-letter-spacing: 0;

  /* Card title */
  --heading-card-size: var(--text-lg);
  --heading-card-weight: 600;
  --heading-card-line-height: 1.3;
  --heading-card-letter-spacing: 0;

  /* Book title (in lists, grids) */
  --heading-book-size: var(--text-base);
  --heading-book-weight: 600;
  --heading-book-line-height: 1.3;

  /* Body text */
  --body-size: var(--text-base);
  --body-weight: 400;
  --body-line-height: 1.6;

  /* Small body / metadata */
  --body-sm-size: var(--text-sm);
  --body-sm-weight: 400;
  --body-sm-line-height: 1.5;

  /* Label (form labels, section labels) */
  --label-size: var(--text-xs);
  --label-weight: 700;
  --label-line-height: 1.4;
  --label-letter-spacing: 0.08em;
  --label-transform: uppercase;

  /* Data (KP numbers, percentages, mono) */
  --data-size: var(--text-sm);
  --data-weight: 500;
  --data-line-height: 1;

  /* Large data (KP counter on profile) */
  --data-lg-size: var(--text-4xl);
  --data-lg-weight: 300;
  --data-lg-line-height: 1;
}
```

---

## 4. Per-Theme Overrides

Each theme adjusts weight and letter spacing to match its personality.

### Sumi — Sharp, precise, Japanese

```css
[data-theme="sumi"] {
  --heading-hero-weight: 200;
  --heading-hero-letter-spacing: 0.04em;

  --heading-section-weight: 400;
  --heading-section-letter-spacing: 0.06em;

  --heading-card-weight: 400;
  --heading-card-letter-spacing: 0.03em;

  --heading-book-weight: 400;
  --heading-book-letter-spacing: 0.02em;

  --label-letter-spacing: 0.15em;

  --data-lg-weight: 200;
}
```

Sumi uses lighter weights and wider letter spacing because Noto Serif JP
is a high-contrast serif — it looks best at lighter weights with room to breathe.

### Kami — Classic, warm, bookish

```css
[data-theme="kami"] {
  --heading-hero-weight: 300;
  --heading-hero-letter-spacing: -0.01em;

  --heading-section-weight: 500;
  --heading-section-letter-spacing: 0;

  --heading-card-weight: 600;
  --heading-card-letter-spacing: 0;

  --heading-book-weight: 500;

  --label-letter-spacing: 0.08em;

  --data-lg-weight: 300;
}
```

Kami uses Crimson Pro — an elegant, traditional serif. It handles normal
weights and tighter spacing well, like a book's typography.

### Mori — Soft, rounded, organic

```css
[data-theme="mori"] {
  --heading-hero-weight: 700;
  --heading-hero-letter-spacing: -0.02em;

  --heading-section-weight: 700;
  --heading-section-letter-spacing: -0.01em;

  --heading-card-weight: 600;

  --heading-book-weight: 600;

  --label-letter-spacing: 0.06em;

  --data-lg-weight: 400;
}
```

Mori uses DM Sans for everything — a rounded, friendly sans-serif.
It needs heavier weights to feel substantial, and tighter letter spacing
for a natural, organic rhythm.

---

## 5. Usage Rules

### Headings

All headings use `font-family: var(--font-display)`.

```css
.heading-hero {
  font-family: var(--font-display);
  font-size: var(--heading-hero-size);
  font-weight: var(--heading-hero-weight);
  line-height: var(--heading-hero-line-height);
  letter-spacing: var(--heading-hero-letter-spacing);
  color: var(--text-primary);
}

.heading-section {
  font-family: var(--font-display);
  font-size: var(--heading-section-size);
  font-weight: var(--heading-section-weight);
  line-height: var(--heading-section-line-height);
  letter-spacing: var(--heading-section-letter-spacing);
  color: var(--text-primary);
}

.heading-card {
  font-family: var(--font-display);
  font-size: var(--heading-card-size);
  font-weight: var(--heading-card-weight);
  line-height: var(--heading-card-line-height);
  letter-spacing: var(--heading-card-letter-spacing);
  color: var(--text-primary);
}
```

### Body Text

```css
.body {
  font-family: var(--font-body);
  font-size: var(--body-size);
  font-weight: var(--body-weight);
  line-height: var(--body-line-height);
  color: var(--text-primary);
}

.body-secondary {
  color: var(--text-secondary);
}

.body-sm {
  font-size: var(--body-sm-size);
  font-weight: var(--body-sm-weight);
  line-height: var(--body-sm-line-height);
  color: var(--text-secondary);
}
```

### Labels & Overlines

```css
.label {
  font-family: var(--font-body);
  font-size: var(--label-size);
  font-weight: var(--label-weight);
  line-height: var(--label-line-height);
  letter-spacing: var(--label-letter-spacing);
  text-transform: var(--label-transform);
  color: var(--text-muted);
}
```

### Data / Mono

```css
.data {
  font-family: var(--font-mono);
  font-size: var(--data-size);
  font-weight: var(--data-weight);
  line-height: var(--data-line-height);
  color: var(--accent);
}

.data-lg {
  font-family: var(--font-display);  /* Display, not mono — for visual impact */
  font-size: var(--data-lg-size);
  font-weight: var(--data-lg-weight);
  line-height: var(--data-lg-line-height);
  color: var(--text-primary);
}
```

---

## 6. Ebook Reader Typography

The ebook reader has its own typography system, separate from the app UI.
Users can adjust these settings.

```css
:root {
  --reader-font: 'Georgia', serif;       /* Default reader font */
  --reader-font-size: 18px;              /* Default — user adjustable 14–28px */
  --reader-line-height: 1.8;             /* Default — user adjustable 1.4–2.2 */
  --reader-max-width: 680px;             /* Optimal reading width */
  --reader-margin: var(--space-5);       /* Left/right content margin */
  --reader-paragraph-spacing: 0.8em;     /* Space between paragraphs */
}
```

Reader font options (built-in):
- Georgia (default serif)
- Crimson Pro (elegant serif)
- DM Sans (clean sans-serif)
- OpenDyslexic (accessibility)

Additional font options unlocked at 1,000 KP:
- Custom font presets (Literata, Bookerly-style, etc.)

---

## 7. Text Truncation

For book titles and other overflow-prone text:

```css
/* Single line truncation */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Multi-line truncation (2 lines) */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

*Companion to FUMIKI_COLORS.md and FUMIKI_SPACING.md*
