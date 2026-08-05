---
category: Forms
---

# RadioInput

Controlled radio row: a full-width label containing the caller's children and a daisyUI `radio radio-sm` input on the right. The whole row is clickable and outlines itself when checked (`has-checked:outline-2`).

Use inside a `SelectableGroup`. For an uncontrolled radio driven by `name` /
`defaultChecked`, use `FormRadioInput` instead.

```jsx
<SelectableGroup name="scope" groupLabel="Apply to">
  <RadioInput value="month" checked={scope === "month"} onChange={() => setScope("month")}>
    This month
  </RadioInput>
</SelectableGroup>
```
