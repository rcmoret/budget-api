# Building with the Budget design system

Tailwind CSS v4 + daisyUI 5, themed with a custom palette called **merrimack**.
Components are plain React — there is no theme provider or context to wrap.

## Theme setup

The theme is applied by a `data-theme` attribute on a root element. The light
palette is also bound to `:root`, so **light needs no attribute**; dark does:

```html
<div data-theme="merrimack">…</div>       <!-- light (also the :root default) -->
<div data-theme="merrimack-dark">…</div>  <!-- dark -->
```

Both themes define the same token set, so anything written with semantic colours
switches automatically. `html { font-family: Questrial, Arial }` — Questrial and
FontAwesome 6 Free both ship in `fonts/`; do not link a CDN for either.

## Styling idiom

Utility classes, always on **semantic theme colours** — never Tailwind's raw
palette (`bg-slate-100`, `text-gray-500`) and never hex. Raw palette colours do
not change with the theme and will look wrong in dark mode.

| Family | Values | Use |
|---|---|---|
| `bg-` `text-` `border-` `outline-` `from-` `to-` | `primary` `secondary` `accent` `neutral` `info` `success` `warning` `error` | brand + status |
| same prefixes | `*-content` for each above (e.g. `text-primary-content`) | foreground **on** that colour |
| `bg-` `text-` `border-` `outline-` | `base-100` `base-200` `base-300` `base-content` | surfaces + body text |

`base-100` is the page surface, `base-200` a raised panel, `base-300` a border
tint, `base-content` the body text colour. Opacity modifiers are idiomatic here:
`text-base-content/70` for muted text, `bg-white/60` for translucent chips.

daisyUI component classes are available and themed: `btn` (`btn-primary` …
`btn-error`, plus `btn-ghost` `btn-outline` `btn-circle` and `btn-xs`…`btn-xl`),
`input` (`input-secondary`, `input-xs`…`input-xl`), `radio`, `checkbox`,
`toggle`, `badge`, `progress`, `tooltip`, `card`, `alert`, `menu`, `table`.

Three app-specific classes exist for round icon actions and page scaffolding:
`round-cta` (with `cancel-cta` / `info-cta`), `grid-page-split`, and
`grid-page-header`. Tokens are readable directly as `var(--color-primary)`,
`var(--radius-box)`, `var(--radius-field)`, `var(--border)` when a utility
doesn't fit.

## Where the truth is

Read `_ds/<folder>/styles.css` and its imports for the generated utilities and
the full token block, and each component's `<Name>.prompt.md` for its real API
and usage examples. Money is always passed as **integer cents**, never floats.

## Idiomatic example

Library components for the controls; theme utilities for your own layout glue.

```jsx
<div data-theme="merrimack" className="bg-base-100 p-4">
  <GroupLabel>Fixed expenses</GroupLabel>

  <ActiveItemCard id="cat-rent" label={
    <CardLabel label="Rent"><EditButton showForm={openForm} /></CardLabel>
  }>
    <CardRow>
      <span className="mr-auto text-base-content/70">Budgeted</span>
      <AmountSpan amount={185000} colorize="none" />
    </CardRow>
    <CardRow>
      <span className="mr-auto text-base-content/70">Remaining</span>
      <AmountSpan amount={-4250} colorize="normal" />
    </CardRow>
  </ActiveItemCard>
</div>
```

`AmountSpan` takes cents and colours by sign: `colorize="normal"` paints
negatives with `error` and positives with `success`, `"reverse"` swaps them, and
`"none"` leaves the base colour.

## Not part of the component API

`window.BudgetDS` also exposes `initNavigationLinks`, `useAppConfigStore`,
`useDispatchNotificationStore` and `useBudgetMonthStore`. These are the app's own
zustand stores, included so the preview cards can seed the state that the
prop-less components read. They are not design-system API — an app supplies that
state from its page props.

## Components needing a live app context

`PageComponent`, `LeftColumn`, `AccountMenuComponent`, `PrimaryAccountLink`,
`IndividualAccountLinks`, `NeighborLinks`, `CreateEventSelectComponent` and
`CreateEventSelectProvider` are built on Inertia's router and the app's stores.
They render, but their links and submits need a real page context — prefer
composing `ActiveItemCard`, `CardRow`, `GroupLabel` and the form controls for
new screens.
