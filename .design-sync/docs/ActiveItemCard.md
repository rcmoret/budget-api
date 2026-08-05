---
category: Cards
---

# ActiveItemCard

The standard card shell for a live (non-archived) record. Swaps its background to the form tint when `isFormShown` is set, so an expanded inline form reads as a distinct surface.

```jsx
<ActiveItemCard id={`account-${account.key}`} label={<CardLabel label={account.name} />}>
  <CardRow><AmountSpan amount={account.balance} colorize="normal" /></CardRow>
</ActiveItemCard>
```
