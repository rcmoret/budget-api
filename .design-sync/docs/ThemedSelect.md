---
category: Forms
---

# ThemedSelect

`react-select` wrapped to match daisyUI's field styling. `size` mirrors daisyUI's `--size-field` scale so a ThemedSelect lines up exactly with an `input input-<size>` beside it; `variant` pins one of the theme colour tokens for the border.

```jsx
<ThemedSelect
  size="sm"
  variant="secondary"
  options={[{ value: "groceries", label: "Groceries" }]}
  onChange={setCategory}
/>
```
