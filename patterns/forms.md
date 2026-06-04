# Form Patterns

## Field anatomy

Always: **label + control + (hint | error)**. The `form-field` wrapper bundles them and wires `aria-describedby`. A placeholder is never a substitute for a label — it vanishes on input and fails screen readers.

```html
<div class="form-field">
  <label class="form-field__label" for="email">Email</label>
  <input class="input" id="email" type="email" aria-describedby="email-hint">
  <span class="form-field__hint" id="email-hint">We never share this.</span>
</div>
```

## Validation timing

| Trigger | When |
|---------|------|
| **On blur** | Validate a single field after the user leaves it |
| **On submit** | Validate the whole form; focus the first error |
| **On input** | Only for live-strength meters (password) or format masks — never for error display (too noisy) |

The rule: **don't show an error before the user has finished.** Validate the field on blur, the form on submit. Showing "invalid email" while someone is still typing the third character is hostile.

## Error display

- Mark the field: add `form-field--invalid` (borders the control red).
- Name the error specifically under the field: "That username is taken." not "Invalid input."
- On submit, move focus to the first invalid field so keyboard users land on the problem.

## Layout

- **Single column** by default. Multi-column forms increase completion time and error rates.
- Group related fields with a `stack`; separate groups with `--space-lg`.
- Place the primary submit button left-aligned or full-width on mobile; never hide it below the fold.

## Selects

Use the styled `.select` (native `<select>` underneath) for ≤ ~12 options. Above that, a searchable combobox is better — but that's a project-level component, not a kiri-ux primitive (out of scope).

## When NOT to

- 🚫 Don't use placeholder as label.
- 🚫 Don't validate-and-error on every keystroke.
- 🚫 Don't multi-column a form without a measured reason.
- 🚫 Don't disable the submit button to indicate errors — show *why* instead.
