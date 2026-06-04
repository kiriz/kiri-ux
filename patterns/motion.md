# Motion Patterns

Adapted from Ant Design's motion philosophy: **Natural · Performant · Concise.**

## The three principles

1. **Natural** — motion follows physical intuition. Things that appear should ease *out* (decelerate into place); things that leave ease *in* (accelerate away). Use `--ease-out` for entrances, `--ease-in` for exits, `--ease-inout` for state changes that stay on screen.
2. **Performant** — animate only `transform` and `opacity` (GPU-composited). Never animate `width`, `height`, `top`, or `left` in hot paths. The accordion animates `height` deliberately and only on user action.
3. **Concise** — motion clarifies, it doesn't decorate. If an animation doesn't help the user understand *what changed* or *where something went*, cut it.

## When motion clarifies (use it)

- **Entrance/exit** of overlays (modal, dropdown, toast) — shows where the thing came from.
- **State transitions** (accordion expand, tab switch) — connects before/after.
- **Affordance feedback** (button press, hover) — confirms the system received input.
- A touch of `--ease-spring` overshoot on affordances that should feel alive (modal entrance).

## When motion distracts (cut it)

- 🚫 Decorative scroll animations on content.
- 🚫 Animating large lists item-by-item (stagger) on every render.
- 🚫 Motion longer than `--duration-slow` (320ms) for UI feedback — feels sluggish.
- 🚫 Looping/infinite motion except genuine loading indicators.

## Duration scale

| Token | Value | Use |
|-------|-------|-----|
| `--duration-fast` | 120ms | hover, press, small toggles |
| `--duration-base` | 200ms | most transitions, overlays |
| `--duration-slow` | 320ms | large surfaces, page-level |

## Reduced motion is mandatory

`prefers-reduced-motion: reduce` zeroes all duration tokens (in `primitives/motion.css`) and stops the spinner/skeleton shimmer. Never ship motion that ignores this — vestibular-disorder users depend on it. Components inherit the global reduction automatically; if you add a custom `@keyframes`, guard it with the media query.
