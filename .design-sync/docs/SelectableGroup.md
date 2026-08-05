---
category: Forms
---

# SelectableGroup

Labelled wrapper around a set of `RadioInput` / `SelectableInput` rows. Renders the group label, then provides the shared `name` and `disabled` state through context — the children read it, so never set `name` on them individually.

```jsx
<SelectableGroup name="scope" groupLabel="Apply to" disabled={saving}>
  <RadioInput value="month" checked={…} onChange={…}>This month</RadioInput>
  <RadioInput value="all" checked={…} onChange={…}>Every month</RadioInput>
</SelectableGroup>
```
