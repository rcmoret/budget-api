---
category: Cards
---

# ArchivedItemCard

Card shell for an archived record. Composes its own label, key identifier and `UnarchiveIcon`, so you only supply the body rows.

```jsx
<ArchivedItemCard name={account.name} itemKey={account.key} title="Unarchive" onClick={unarchive}>
  <ArchivedAtRow archivedAt={account.archivedAt} />
</ArchivedItemCard>
```
