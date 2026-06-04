# Layout Patterns

When to reach for each shell.

## Decision tree

```
Does the app have ≥5 persistent destinations the user moves between?
├─ YES → layout-with-sidebar   (the app shell — FactWatch, dashboards, admin)
└─ NO
   ├─ Is this a reading/content page (article, docs, form)?
   │  └─ YES → container--narrow   (≤768px, optimal line length 45–75ch)
   └─ Is this a landing/marketing or dashboard overview?
      └─ YES → container (1280px) with grid-auto card sections
```

## The three shells

### `layout-with-sidebar` — app shell
Persistent left nav, scrollable main. Sidebar is `position: sticky` full-height. Collapses to a top panel at ≤768px with **no JS**. Use for any tool the user lives in.

```html
<div class="layout-with-sidebar">
  <aside class="sidebar"><nav class="nav-sidebar">…</nav></aside>
  <main class="main"><div class="container">…</div></main>
</div>
```

### `container` — centered content
Max-width 1280px, auto margins, responsive padding. `--narrow` (768px) for reading, `--wide` (1536px) for data-dense dashboards. This is the default for most pages.

### `grid-auto` — responsive card fields
`repeat(auto-fill, minmax(--grid-min, 1fr))`. Set `--grid-min` to control column count implicitly. 280px ≈ 3–4 cols on desktop, 1 on mobile. Never write media queries for card grids — the grid handles it.

## Spacing rhythm

Use `stack` (vertical) and `cluster` (horizontal) over manual margins. They centralize gap into one token and prevent margin-collapse surprises. Reserve `--space-section-gap` for between major page sections, `--space-card-pad` inside cards.

## When NOT to

- 🚫 Don't use `layout-with-sidebar` for ≤3 destinations — a header nav is lighter.
- 🚫 Don't hardcode pixel widths — use `container` variants and `--grid-min`.
- 🚫 Don't nest containers — one per page region.
