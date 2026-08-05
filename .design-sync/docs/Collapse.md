---
category: Layout
---

# Collapse

Height-animated show/hide using a `grid-template-rows: 0fr → 1fr` transition, so it animates to the content's natural height with no measurement. Set `fade` to cross-fade opacity too, and `subgrid` when the collapse must keep participating in a parent subgrid.

```jsx
<Collapse open={isOpen} fade durationMs={300}>
  <CardRow>Hidden detail</CardRow>
</Collapse>
```
