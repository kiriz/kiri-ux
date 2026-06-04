# Navigation Patterns

| Pattern | Use when | Destinations | Avoid when |
|---------|----------|--------------|-----------|
| **Header nav** | Top-level sections, marketing | 2–5 | >5 (crowds) |
| **Sidebar** | App with many sections | 5–20 | Content/reading pages |
| **Breadcrumb** | Show position in hierarchy | depth ≥2 | Flat structures |
| **Tabs** | Switch views of the *same* object | 2–6 | Navigating to different objects |

## Header vs Sidebar

The dividing line is **destination count and persistence**. A header holds 2–5 links and suits content sites. A sidebar holds 5–20 and suits tools where the user constantly switches context. If you're unsure, start with a header — promoting to a sidebar later is cheap; the reverse feels like clutter.

## Tabs vs navigation

Tabs switch **views of one thing** (a claim's Overview / Sources / History). They do not navigate to different things. If clicking changes the URL to a different resource, that's navigation (links), not tabs. Tabs keep you on the same resource. Misusing tabs for navigation breaks the back button's mental model.

## Breadcrumb

Only earns its place at hierarchy depth ≥2. At depth 1 it's noise. Always make every segment except the last a link; the last (current page) is plain text. Truncate the middle on narrow viewports, never the ends.

## Active state

Use `aria-current="page"` for the active link — it's the accessibility signal *and* the CSS hook (`[aria-current="page"]`). Never rely on color alone for active state; the components add weight + background so it survives colorblindness and the hue-rotation theming.

## When NOT to

- 🚫 Don't put >7 items in a header — that's a sidebar.
- 🚫 Don't use tabs that load new pages — that's navigation.
- 🚫 Don't omit `aria-current` — keyboard/SR users lose their place.
