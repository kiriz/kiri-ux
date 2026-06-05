# kiri-ux

[![CI](https://github.com/kiriz/kiri-ux/actions/workflows/ci.yml/badge.svg)](https://github.com/kiriz/kiri-ux/actions/workflows/ci.yml)
[![Pages](https://github.com/kiriz/kiri-ux/actions/workflows/pages.yml/badge.svg)](https://github.com/kiriz/kiri-ux/actions/workflows/pages.yml)
[![Live demo](https://img.shields.io/badge/demo-kiriz.github.io%2Fkiri--ux-3b82f6)](https://kiriz.github.io/kiri-ux/)
[![Vanilla CSS](https://img.shields.io/badge/CSS-vanilla%20%C2%B7%20no%20deps-8b5cf6)](https://github.com/kiriz/kiri-ux)

**A token-driven, dark-mode-first design system. Vanilla CSS + minimal JS. Reused across every project.**

Live demo: https://kiriz.github.io/kiri-ux

---

## Why this exists

Every project hand-rolling its own CSS means hardcoded colors, drift between projects, and reinventing the same components. `kiri-ux` is the single source of truth for visual and interaction decisions. Add it once, pick a theme, and the hardest UI problems — dark mode, accessible focus rings, sidebar layout, loading/empty states — are already solved.

## Architecture: three tiers, never skip

```
primitive   →   semantic   →   component
  hsl(...)      --color-       .btn references
  raw value     surface        --color-surface
```

- **Primitives** (`tokens/primitives/`) — raw values. 12-step HSL color scales, an 8-point spacing grid, a 1.25 type scale, sub-atomic shadows. Never referenced directly by components.
- **Semantic** (`tokens/semantic/`) — role names. `--color-surface`, `--color-on-surface`, `--color-primary`. This is what components reference. Roles stay constant; only the primitives they point at change per theme.
- **Components** (`components/`) — `.btn`, `.card`, `.alert`. Reference only semantic tokens. No hardcoded colors (enforced by CI).

Rotating a single `--primary-hue` re-tints the entire system because every color flows through the scale.

## Quick start

### Option A — git submodule (recommended for active development)

```bash
git submodule add https://github.com/kiriz/kiri-ux site/kiri-ux
```

```html
<link rel="stylesheet" href="kiri-ux/tokens/themes/base.css">
<link rel="stylesheet" href="kiri-ux/tokens/themes/yourproject.css"><!-- optional -->
<link rel="stylesheet" href="kiri-ux/components/index.css">
<script src="kiri-ux/components/interaction.js" defer></script>
```

Pull updates deliberately: `git submodule update --remote site/kiri-ux`.

### Option B — GitHub Pages CDN (production, versioned)

```html
<link rel="stylesheet" href="https://kiriz.github.io/kiri-ux/tokens/themes/base.css">
<link rel="stylesheet" href="https://kiriz.github.io/kiri-ux/components/index.css">
```

## Create a project theme (≤ 5 lines)

Copy `tokens/themes/_template.css` to `tokens/themes/yourproject.css`:

```css
:root {
  --primary-hue: 160;   /* teal — the one knob that matters */
  --neutral-hue: 200;   /* surface warmth */
  --scaling: 1;         /* density: 0.9 compact, 1.1 comfortable */
  --radius-scaling: 1;  /* 0 sharp, 1.5 rounded */
}
```

## Dark / light mode

Dark is default. Toggle light with one attribute, no JS:

```html
<html data-theme="light">
```

## Component catalog (Ant-style 7 groups)

| Group | Components |
|-------|-----------|
| **General** | Button, Badge |
| **Layout** | Container, Stack, Cluster, Auto-grid, Sidebar shell |
| **Navigation** | Header, Sidebar, Breadcrumb, Tabs |
| **Data Entry** | Form field, Input, Select, Sort bar, Filter bar |
| **Data Display** | Card (+ news variant), Confidence bar, Stat box, Data table, Timeline |
| **Feedback** | Alert, Spinner, Skeleton, Empty state, Toast |
| **Interaction** | Dropdown, Modal, Accordion |
| **Specialized** | Code block, Pipeline (numbered trace) |

Each is documented in [the demo](https://kiriz.github.io/kiri-ux) with "when to use / when NOT to use" and a copyable snippet.

## UX patterns

Beyond components, `patterns/` documents the *decisions*:

- [`patterns/layout.md`](patterns/layout.md) — sidebar vs full-width vs centered
- [`patterns/navigation.md`](patterns/navigation.md) — header vs sidebar vs breadcrumb vs tabs
- [`patterns/data-display.md`](patterns/data-display.md) — cards vs tables vs timelines
- [`patterns/feedback.md`](patterns/feedback.md) — toast vs alert vs empty state
- [`patterns/forms.md`](patterns/forms.md) — field layout, validation timing
- [`patterns/motion.md`](patterns/motion.md) — when motion clarifies vs distracts

## Contributing

1. Edit tokens/components/patterns.
2. `npx stylelint "**/*.css"` + `bash scripts/check-hardcoded-colors.sh` must pass.
3. Breaking changes (anything requiring consuming-project updates) are tagged `[BREAKING]` in `CHANGELOG.md` and bump the major version.

## Versioning

Tags become CDN versions: `kiriz.github.io/kiri-ux/v{major}.{minor}/`. Major = breaking, minor = additive, patch = fixes. Consuming projects pin to a submodule commit and update deliberately.

## Prior art

Architecture informed by [Primer CSS](https://github.com/primer/css) (two-tier tokens, semantic naming), [Radix Themes](https://github.com/radix-ui/themes) (12-step scales, `--scaling`), [Open Props](https://github.com/argyleink/open-props) (sub-atomic shadows), and [Ant Design](https://ant.design) (component taxonomy, motion principles).
