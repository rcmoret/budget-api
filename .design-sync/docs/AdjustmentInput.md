---
category: Forms
---

# AdjustmentInput

Amount field bound to the *adjustment* side of an adjustment/total pair. Reads and writes the shared adjustment store through `AdjustmentInputsProvider` — it must be rendered inside one.

```jsx
<AdjustmentInputsProvider objectKey={item.key} editing="adjustment">
  <AdjustmentInput name="adjustment" />
</AdjustmentInputsProvider>
```
