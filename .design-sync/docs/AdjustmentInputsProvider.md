---
category: Forms
---

# AdjustmentInputsProvider

Context provider that binds `AdjustmentInput` and `TotalInput` to one budget item in the shared adjustment store. `objectKey` selects the item; `editing` ("adjustment" | "total" | "both") decides which field starts editable.

```jsx
<AdjustmentInputsProvider objectKey={item.key} editing="both">
  <AdjustmentInput /><TotalInput />
</AdjustmentInputsProvider>
```
