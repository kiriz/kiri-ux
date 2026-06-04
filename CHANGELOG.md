# Changelog

All notable changes to kiri-ux. Format: [Keep a Changelog](https://keepachangelog.com).
Breaking changes are tagged `[BREAKING]` and bump the major version.

## [Unreleased]

## [1.0.0] — 2026-06-04

### Added
- Three-tier token system: `tokens/primitives/` (color, space, type, shadow, radius, motion), `tokens/semantic/` (color, space, type, shadow roles).
- 12-step HSL color scales (neutral + primary) with single-variable `--primary-hue` rotation; success/warning/error/info families.
- `tokens/themes/`: `base.css` (dark default), `light.css` (`data-theme="light"` override), `_template.css` (documented project starter), `factwatch.css` (first consumer theme).
- Layout primitives: container, stack, cluster, auto-grid, sidebar shell (`base/layout.css`).
- Accessibility utilities: `sr-only`, skip-link, focus helpers (`base/a11y.css`).
- Components: button, badge, nav (header/sidebar/breadcrumb/tabs), card (+ news variant), confidence bar, stat box, data table, timeline, alert, spinner, skeleton, empty state, toast, form field/input/select, sort bar, filter bar, code block, pipeline, dropdown, modal, accordion.
- `components/interaction.js`: keyboard-navigable, focus-trapped dropdown/modal/accordion/tabs/toast (progressive enhancement).
- GitHub Pages demo with live hue rotation + dark/light toggle.
- CI: stylelint + hardcoded-color guard. Pages deploy workflow.
- UX pattern docs: layout, navigation, data-display, feedback, forms, motion.

### Notes
- First consumer (FactWatch) migration tracked separately.
