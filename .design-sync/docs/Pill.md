---
category: Data Display
---

# Pill

A small rounded status chip. `themeOption` takes a `NotificationKind` —
`"alert"`, `"info"`, `"notice"` or `"warning"` — and reuses the same palette as
`Notifications`, so a Pill always matches the banner styling for the same kind.
`"notice"` is the success/positive tone; there is no `"success"` value.

```jsx
<Pill themeOption="notice">Cleared</Pill>
<Pill themeOption="warning">Pending</Pill>
<Pill themeOption="alert">Overdue</Pill>
```
