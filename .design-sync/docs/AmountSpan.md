---
category: Data Display
---

# AmountSpan

Renders integer **cents** as formatted currency and colours it by sign. `colorize="normal"` paints negatives with the error token and positives with success; `"reverse"` swaps them (spending views, where a positive number is bad); `"none"` leaves it at base content colour. `only` restricts colouring to one sign.

```jsx
<AmountSpan amount={-4250} colorize="normal" />
<AmountSpan amount={125000} colorize="reverse" decorate showCents={false} />
```
