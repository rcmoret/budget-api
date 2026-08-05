---
category: Forms
---

# TotalInput

Amount field bound to the *total* side of an adjustment/total pair; editing it back-solves the adjustment. Requires an enclosing `AdjustmentInputsProvider`.

```jsx
<AdjustmentInputsProvider objectKey={item.key} editing="total">
  <TotalInput />
</AdjustmentInputsProvider>
```
