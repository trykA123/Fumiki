# Fumiki — Spacing & Layout

> Spatial rhythm, breakpoints, grids, and content structure for all three themes.

---

## 1. Spacing Scale

Fumiki uses an 8px base unit with a consistent scale. All spacing uses CSS custom properties.

```css
:root {
  --space-0:  0px;
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-7:  32px;
  --space-8:  40px;
  --space-9:  48px;
  --space-10: 56px;
  --space-11: 64px;
  --space-12: 80px;
  --space-13: 96px;
  --space-14: 128px;
}
```

### Usage Guidelines

| Context | Token | Value |
|---|---|---|
| Inline element gap (icon + label) | `--space-2` | 8px |
| Input padding (horizontal) | `--space-3` to `--space-4` | 12–16px |
| Input padding (vertical) | `--space-2` to `--space-3` | 8–12px |
| Card internal padding | `--space-5` to `--space-6` | 20–24px |
| Between elements inside a card | `--space-3` to `--space-4` | 12–16px |
| Between cards | `--space-5` | 20px |
| Section spacing (between sections) | `--space-8` to `--space-9` | 40–48px |
| Page padding (mobile) | `--space-4` to `--space-5` | 16–20px |
| Page padding (tablet) | `--space-7` to `--space-8` | 32–40px |
| Page padding (desktop) | `--space-8` to `--space-9` | 40–48px |
| Page top spacing (below nav) | `--space-7` to `--space-9` | 32–48px |

---

## 2. Spacing Per Theme

Each theme has a different spatial personality. This is defined via a spacing multiplier on specific contexts, not by changing the base scale.

### Sumi — Tight, efficient

```css
[data-theme="sumi"] {
  --card-padding: var(--space-5);       /* 20px */
  --card-gap: var(--space-4);           /* 16px — between cards */
  --section-gap: var(--space-8);        /* 40px — between sections */
  --page-padding-mobile: var(--space-4); /* 16px */
  --page-padding-tablet: var(--space-7); /* 32px */
  --page-padding-desktop: var(--space-8); /* 40px */
  --content-max-width: 860px;
  --list-item-padding: var(--space-3) var(--space-4); /* 12px 16px */
  --list-item-gap: 2px;                /* Near-seamless list rows */
  --element-gap: var(--space-3);        /* 12px — inside components */
}
```

### Kami — Generous, breathable

```css
[data-theme="kami"] {
  --card-padding: var(--space-6);        /* 24px */
  --card-gap: var(--space-5);            /* 20px */
  --section-gap: var(--space-9);         /* 48px */
  --page-padding-mobile: var(--space-5); /* 20px */
  --page-padding-tablet: var(--space-8); /* 40px */
  --page-padding-desktop: var(--space-9); /* 48px */
  --content-max-width: 740px;            /* Narrower — book-like proportions */
  --list-item-padding: var(--space-4) var(--space-5); /* 16px 20px */
  --list-item-gap: var(--space-2);       /* 8px — more breathing room */
  --element-gap: var(--space-4);         /* 16px */
}
```

### Mori — Very generous, contemplative (ma)

```css
[data-theme="mori"] {
  --card-padding: var(--space-6);          /* 24px */
  --card-gap: var(--space-5);              /* 20px */
  --section-gap: var(--space-10);          /* 56px */
  --page-padding-mobile: var(--space-5);   /* 20px */
  --page-padding-tablet: var(--space-8);   /* 40px */
  --page-padding-desktop: var(--space-10); /* 56px */
  --content-max-width: 800px;
  --list-item-padding: var(--space-4) var(--space-5); /* 16px 20px */
  --list-item-gap: var(--space-3);         /* 12px — most spacious */
  --element-gap: var(--space-4);           /* 16px */
}
```

---

## 3. Breakpoints

```css
/* Breakpoints */
--bp-sm:  375px;   /* Small phone */
--bp-md:  640px;   /* Large phone / small tablet */
--bp-lg:  768px;   /* Tablet portrait */
--bp-xl:  1024px;  /* Tablet landscape / small desktop */
--bp-2xl: 1280px;  /* Desktop */
```

### Responsive Behavior

| Breakpoint | Name | Nav | Layout | Grid Columns |
|---|---|---|---|---|
| < 640px | Phone | Bottom tabs (all themes) | Single column, full width | 2 (books) |
| 640–767px | Large phone | Bottom tabs | Single column | 3 (books) |
| 768–1023px | Tablet portrait | Theme-specific (see below) | Optional split view | 4 (books) |
| 1024–1279px | Tablet landscape | Theme-specific | Split view available | 5 (books) |
| ≥ 1280px | Desktop | Theme-specific | Full layout | 6 (books) |

### Navigation Per Theme Per Breakpoint

| Breakpoint | Sumi | Kami | Mori |
|---|---|---|---|
| Phone (< 768px) | Bottom tabs | Bottom tabs | Bottom tabs |
| Tablet (768–1023px) | Top bar | Side panel | Bottom tabs (floating) |
| Desktop (≥ 1024px) | Top bar | Side panel | Floating minimal nav |

All themes collapse to bottom tabs on phone. The UX differences emerge at tablet and above.

---

## 4. Grid System

### Book Library Grid

Uses CSS Grid with `auto-fill` and `minmax` for responsive columns.

```css
.book-grid {
  display: grid;
  gap: var(--card-gap);
}

/* Phone */
.book-grid { grid-template-columns: repeat(2, 1fr); }

/* ≥ 640px */
@media (min-width: 640px) {
  .book-grid { grid-template-columns: repeat(3, 1fr); }
}

/* ≥ 768px */
@media (min-width: 768px) {
  .book-grid { grid-template-columns: repeat(4, 1fr); }
}

/* ≥ 1024px */
@media (min-width: 1024px) {
  .book-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
}
```

### Content Layout (Tablet Split View)

On tablet (≥ 768px), several pages support a split view:

| Page | Left Panel | Right Panel |
|---|---|---|
| Reader | Ebook content | Notes panel |
| Player | Player controls + cover | Chapter list / notes |
| Library detail | Book metadata | Chapters + notes |
| Profile | Bonsai | Stats + calendar |

```css
.split-view {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}

@media (min-width: 768px) {
  .split-view {
    grid-template-columns: 1fr 320px;
    gap: 1px; /* border-like divider */
  }
}

@media (min-width: 1024px) {
  .split-view {
    grid-template-columns: 1fr 380px;
  }
}
```

---

## 5. Page Structure

### General Page Template

```
┌──────────────────────────────────────┐
│  Navigation (position varies by theme)│
├──────────────────────────────────────┤
│  Page Content                        │
│  ┌──────────────────────────────────┐│
│  │  max-width: var(--content-max-w) ││
│  │  padding: var(--page-padding-*)  ││
│  │                                  ││
│  │  [Page Header]                   ││
│  │       ↓ section-gap              ││
│  │  [Section 1]                     ││
│  │       ↓ section-gap              ││
│  │  [Section 2]                     ││
│  │       ↓ section-gap              ││
│  │  [Section 3]                     ││
│  │                                  ││
│  └──────────────────────────────────┘│
│  (Navigation — if bottom tabs)       │
└──────────────────────────────────────┘
```

### Page Wrapper CSS

```css
.page {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding-left: var(--page-padding-mobile);
  padding-right: var(--page-padding-mobile);
  padding-top: var(--space-7);
  padding-bottom: var(--space-12);   /* Extra for bottom nav */
}

@media (min-width: 768px) {
  .page {
    padding-left: var(--page-padding-tablet);
    padding-right: var(--page-padding-tablet);
  }
}

@media (min-width: 1280px) {
  .page {
    padding-left: var(--page-padding-desktop);
    padding-right: var(--page-padding-desktop);
  }
}
```

### Section Spacing

```css
.section {
  margin-bottom: var(--section-gap);
}

.section:last-child {
  margin-bottom: 0;
}
```

---

## 6. Z-Index Scale

```css
:root {
  --z-base:      0;
  --z-dropdown:  100;
  --z-sticky:    200;    /* Sticky headers, controls */
  --z-overlay:   300;    /* Drawers, side panels */
  --z-modal:     400;    /* Modals, dialogs */
  --z-toast:     500;    /* Toast notifications */
  --z-tooltip:   600;    /* Tooltips */
}
```

---

## 7. Safe Areas (Mobile)

For Capacitor/PWA on notched devices:

```css
.page {
  padding-top: calc(var(--space-7) + env(safe-area-inset-top));
  padding-bottom: calc(var(--space-12) + env(safe-area-inset-bottom));
}

.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

*Companion to FUMIKI_COLORS.md and FUMIKI_TYPOGRAPHY.md*
