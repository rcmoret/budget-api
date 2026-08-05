# /design-sync notes — daisy-themed-budget

Repo-specific gotchas for future syncs. Read this before re-running.

## Shape

This is a Rails + Inertia **app**, not a published component package. Three
consequences shape the whole setup:

- **No build, no `dist/`.** `.design-sync/prepare.sh` (wired as `cfg.buildCmd`)
  generates the two inputs the converter needs — a `.d.ts` tree and a compiled
  stylesheet. Always run it before `package-build.mjs`.
- **No package entry.** `.design-sync/ds-entry.ts` is a hand-maintained barrel
  defining the public surface, passed via `--entry`. Adding a component to the
  design system means editing **both** `ds-entry.ts` and `componentSrcMap`.
- **`package.json` had no `name`.** We added `"name"` and `"types"`. The `name`
  is required: `lib/dts.mjs`'s `loadDts` walks up for the nearest *named*
  `package.json` and crashed on `/package.json` (ENOENT) without it.

## The invocation

Two flags are load-bearing and neither is inferable from `config.json`:

```
./.design-sync/prepare.sh
node .ds-sync/resync.mjs \
  --config .design-sync/config.json \
  --node-modules node_modules \
  --out ds-bundle \
  --entry .design-sync/ds-entry.ts
```

- **`--node-modules node_modules`** — the *repo root*, not `.ds-sync/node_modules`.
  The latter holds only the sync toolchain (tailwind/esbuild/playwright/ts-morph);
  React lives at the repo root, and `emit.mjs` hard-fails on `react not found`.
- **`--entry .design-sync/ds-entry.ts`** — required. `cfg` has no `entry` key, so
  without the flag `package-build.mjs` falls back to resolving `cfg.pkg` as a real
  installed package and ENOENTs on
  `node_modules/@budget/design-system/package.json` (nothing is installed under
  that name). With it, `dts.mjs` walks up from the entry to the nearest *named*
  `package.json` — which is why the repo-root `name` field matters.

## Ordering trap — re-run prepare.sh AFTER authoring previews

`ds-styles.css` has `@source "./previews"`. Tailwind scans sources at compile
time, so a preview authored *after* the last CSS compile gets no classes and
renders unstyled (this bit us once: `w-20` silently missing). Sequence is
always **author previews → `prepare.sh` → `package-build.mjs`**.

## Tailwind safelist is load-bearing

Tailwind v4 only emits classes it finds in scanned sources. The app uses
`text-error` but not `text-accent`, so an unsafelisted build shipped a
stylesheet where half the theme was unreachable — and the design agent writes
*new* markup against that frozen stylesheet. The `@source inline(...)` block in
`ds-styles.css` safelists the semantic colour/size vocabulary that
`conventions.md` documents. **If you add vocabulary to conventions.md, add it to
the safelist too**, or the header will name classes that do nothing.

## Vendored assets (both committed, both deliberate)

- **FontAwesome Free 6.7.2** (`vendor/fontawesome/`). The app loads FA from a CDN
  kit `<script>` in `app/views/layouts/application.html.erb`, which never reaches
  the bundle. Split on purpose: `fa-fonts.css` holds only `@font-face` (consumed
  by `cfg.extraFonts`, which copies the woff2 and rewrites `url()`), while
  `fa-icons.css` holds the icon/style rules and is `@import`ed into the Tailwind
  entry — `extractFonts` only lifts `@font-face`, so the icon rules must travel
  through the stylesheet. The `.ttf` `src` fallbacks were stripped (not shipped).
  All 23 names in `Icon`'s dictionary verify, including v4 aliases
  (`angle-double-left`, `edit`, `gears`).
- **Questrial** (`vendor/questrial/`, latin + latin-ext, OFL). `main.css` loads it
  from `fonts.googleapis.com`, which doesn't resolve in the bundle — every design
  would have fallen back to Arial. The remote `@import` is left in place as a
  harmless second source.

## lib fork

`.design-sync/overrides/source-kit.mjs` (declared in `cfg.libOverrides`) yields
`'general'` for the dir-derived group so the `category:` frontmatter in
`.design-sync/docs/` wins for **every** component. Upstream only lets a doc
category win when the dir group is already generic, which split siblings across
`cta` and `actions`. Diff it against `lib/source-kit.mjs` on re-sync.

## Known render warns (expected — not new)

- `[FONT_REMOTE] "Font Awesome 6 Brands"` — the base `.fa` selector list names
  `.fa-brands`, but no component uses a brand glyph and the brands webfont is
  deliberately not shipped. Ignore.
- `tokens: N defined, M referenced (1 missing, below threshold)` — informational.

## Findings in the app's own CSS (surfaced by previews, NOT fixed here)

These are real bugs in `app/frontend/css/` worth fixing in the app:

1. **`ctas.css`: disabled `CloseButton` doesn't look disabled.** `&.cancel-cta` is
   declared after `&:disabled` at equal specificity, so the red fill wins.
   `CtaCloseButton` (no `.cancel-cta`) greys out correctly. Documented in
   `docs/CloseButton.md`.
2. **`cta/index.tsx`'s `CloseButton` applies `.cancel`, which is undefined** —
   `ctas.css` defines `.cancel-cta`. It renders with no red fill. This is why the
   two `CloseButton`s differ; exported as `CtaCloseButton`.
3. **`icon.tsx`'s `GreenCheck` uses `text-chartreuse-300`**, not a class this
   Tailwind build generates, so the glyph inherits `base-content` instead of the
   intended light green. Documented in `docs/GreenCheck.md`.
4. `main.css` has `--color-prev-bugeted` (typo, "bugeted") consumed by
   `.bg-prev-budgeted`. Left as-is — renaming is an app change.

## Name collisions resolved in the barrel

Both members of each pair are in active use; a bundle exposes one per name.

- `RadioInput` → `selectable.tsx` (controlled). `radio.tsx`'s uncontrolled one is
  exported as **`FormRadioInput`**.
- `CloseButton` → `close-button.tsx`. `cta/index.tsx`'s is **`CtaCloseButton`**.

## Removed components

- **`MenuItemList`** (2026-08-05, 49 → 48). It was dead code in the app: defined
  and exported from `layout/left-column/menu-item.tsx`, imported by nothing. Its
  sibling `MenuItems` in the same file is live (`left-column/index.tsx`) and stays.
  Removed from the component, `ds-entry.ts`, `componentSrcMap`, `previews/`,
  `docs/`, and the published project.

  **The general trap:** the barrel takes what a module *exports*, not what the app
  *uses*, so an unused export silently becomes a design-system component that the
  design agent will then build against. When adding to `ds-entry.ts`, confirm the
  symbol has a real call site — `grep -rn "<Name>" app/` returning only its own
  definition and export line means it doesn't belong in the DS.

  Removal is a 5-step edit (component, barrel, `componentSrcMap`, preview, doc) and
  the remote files must be deleted explicitly: the diff computes `deletePaths` only
  against a `--remote` anchor, so without one it reports `[]` and a dropped
  component's files linger in the project.

## Re-sync risks

- **Renaming or moving anything in the barrel silently drops it.** `ds-entry.ts`
  and `componentSrcMap` are hand-maintained; a component deleted from
  `app/frontend` fails the build loudly, but one *added* is simply absent.
- **`conventions.md` names 160 classes/tokens/components** validated against the
  build at sync time. Re-validate on every sync — a removed theme token or
  renamed component makes the header lie to the design agent. Cheap check:
  collect `\.([\w-]+)` from `ds-bundle/styles.css` + `_ds_bundle.css` into a set
  and assert every class the header names is in it, plus that
  `--color-primary` / `--radius-box` / `--radius-field` / `--border` and both
  `data-theme` values appear. Last run (2026-08-05): 135 classes + 4 tokens +
  `merrimack`/`merrimack-dark`, zero missing.
- **The vendored FA/Questrial versions are pinned by the committed files**, not a
  lockfile. If `Icon`'s dictionary gains a name, re-check it resolves.
- **`prepare.sh` runs `tsc` and tolerates errors** (`|| true`) because
  `app/frontend/pages/` has pre-existing type errors unrelated to the DS surface.
  It hard-fails only if emit produced nothing. If declaration quality degrades,
  check whether a real error started blocking emit.
- **All 48 components have authored previews.** No component falls back to the
  typographic floor card; `grep -rl "Preview not yet authored" ds-bundle/components/`
  should stay empty. Grades carry forward via the uploaded `_ds_sync.json`.
  (Was 49 — see "Removed components".)
- Playwright/chromium is installed at `~/Library/Caches/ms-playwright` (macOS
  path, not `~/.cache`). A fresh machine needs `npx playwright install chromium`.
