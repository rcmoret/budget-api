---
category: Actions
---

# CloseButton

Round red cancel button (`.round-cta.cancel-cta`), 6 spacing units square, showing a ✘ glyph. The primary "dismiss / cancel" affordance on forms and panels.

```jsx
<CloseButton title="Cancel" ariaLabel="Cancel edit" onClick={dismiss} />
```

Pair with `CheckMarkButton` for a confirm/cancel pair. Not to be confused with
`CtaCloseButton`, a near-duplicate from `components/cta`.

**Disabled is not visually distinct.** In `ctas.css`, `&.cancel-cta` is declared
after `&:disabled` at equal specificity, so the red fill wins and a disabled
CloseButton looks identical to an enabled one. `CtaCloseButton`, which has no
`.cancel-cta`, does grey out correctly.
