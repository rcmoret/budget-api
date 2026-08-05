---
category: Layout
---

# PageComponent

The application page frame: left navigation column, a sticky page header, a scrolling `<main>`, and a right aside carrying `Notifications` plus a `RightColumnWrapper`. Composes `LeftColumn` internally, so it expects the app's navigation stores to be populated.

```jsx
<PageComponent mainId="budget" header={<HeaderComponent title="Budget" />} rightColumn={panel}>
  {rows}
</PageComponent>
```
