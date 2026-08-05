---
category: Icons
---

# GreenCheck

A check-circle glyph on a green chip — the compact "done / cleared" marker used in list rows.

```jsx
<GreenCheck />
```

**Known issue:** the glyph is styled `text-chartreuse-300`, which is not a class
this Tailwind build generates, so the check inherits `base-content` (dark) rather
than the intended light green. The chip background (`bg-green-600`) is correct.
