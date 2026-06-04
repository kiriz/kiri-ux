# Feedback Patterns

| Pattern | Lifetime | Use for | Dismissal |
|---------|----------|---------|-----------|
| **Toast** | Transient (4s) | Confirmation of a completed action | Auto |
| **Alert** | Persistent | In-context status the user should keep seeing | Manual / never |
| **Empty state** | Until populated | A list/grid with zero items | N/A |
| **Spinner / Skeleton** | Until loaded | Async wait | Auto on load |

## Toast vs Alert — the critical distinction

A **toast disappears**. Only use it for information the user does **not** need to act on: "Saved", "Copied", "Sent". 

An **alert persists**. Use it for anything the user must read or act on: validation summaries, rate-limit warnings, degraded-state notices. **Never put an actionable error in a toast** — it vanishes before the user can respond. This is the single most common feedback mistake.

## Loading: spinner vs skeleton

- **Skeleton** when you know the *shape* of what's coming (a card, a table row). It reduces layout shift and feels faster because the structure appears instantly.
- **Spinner** when the result shape is unknown or the wait is short (<1s) and indeterminate.

Prefer skeletons for content areas; spinners for buttons (`aria-busy="true"`) and small indeterminate waits.

## Empty states earn their keep

A blank area reads as "broken." Every list/grid needs an empty state with: an icon, a one-line title naming what's absent, and a sentence on what will fill it (or a CTA to fill it). FactWatch's "No claims yet — the agent will populate this on its next run" is the model: it explains *why* it's empty and *when* it won't be.

## Copy/voice

- Confirmations: past tense, terse. "Saved." not "Your changes have been saved successfully."
- Errors: what happened + what to do. "Rate limit reached. Retrying in 30s." not "Error 429."
- Empty: reassure + direct. Name the absence, name the fix.

## Accessibility

- Toast region: `aria-live="polite"`, each toast `role="status"`.
- Alert: `role="alert"` for errors (interrupts), `role="status"` for info (waits).
- Spinner: `aria-label="Loading"`; never a bare animated div.

## When NOT to

- 🚫 Don't toast an error that needs action.
- 🚫 Don't stack >3 toasts — batch or summarize.
- 🚫 Don't show a spinner for >2s with no context — switch to a skeleton or progress text.
