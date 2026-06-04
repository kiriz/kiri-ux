# Data Display Patterns

## Cards vs Table vs Timeline

| Choose | When | Why |
|--------|------|-----|
| **Cards** | Items have ≤5 fields, are *browsed*, order is by relevance | Scannable, touch-friendly, visual hierarchy |
| **Table** | Items have many fields, are *compared*, sorting matters | Dense, alignment aids comparison |
| **Timeline** | Events are *ordered in time* or *sequential steps* | Sequence is the message |

The test: **browse vs compare.** If the user scans for one interesting item → cards. If the user compares values across rows → table. If the user follows a sequence → timeline.

## Card density

- **Standard `.card`** — rich items, ≤5 fields, generous padding. Use in `grid-auto`.
- **`.card-news`** — dense two-line layout (title + meta row) with a verdict-colored left bar. Use when scanning many items where the *verdict/status* is the primary signal. This is the FactWatch dashboard pattern.

Population threshold: below ~6 items, cards in a grid look sparse — consider a list or table. Above ~50, add filtering/sorting before the grid (use `sort-bar` + `filter-bar`).

## Table specifics

- Sticky header (`thead th` is `position: sticky`) so column meaning survives scroll.
- Alternating row background (`tr:nth-child(even)`) only above ~8 rows — below that it's visual noise.
- Sort affordance via `aria-sort` on `th.data-table__sort` — sets the arrow *and* announces to screen readers.

## Stat boxes & bars

- `stat-box` for single headline numbers (counts, totals) in a dashboard `cluster`.
- `confidence-bar` for a 0–100 proportion. Set `--bar-color` to encode meaning (e.g. verdict color), never rely on the bar length alone.

## When NOT to

- 🚫 Don't use a table for ≤3 fields browsed visually — cards read better.
- 🚫 Don't use cards to compare precise values — alignment in a table wins.
- 🚫 Don't animate `confidence-bar` fills on every render — only on value change.
