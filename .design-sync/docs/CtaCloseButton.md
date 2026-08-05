---
category: Actions
---

# CtaCloseButton

Variant of the round cancel button exported from `components/cta`. Identical markup to `CloseButton` except it applies `.cancel` rather than `.cancel-cta`.

**`.cancel` is not defined in `ctas.css`**, so this renders with the base
`.round-cta` styling only — no red background. Prefer `CloseButton` unless you
are deliberately matching the `components/cta` trio.

```jsx
<CtaCloseButton title="Cancel" ariaLabel="Cancel" onClick={dismiss} />
```
