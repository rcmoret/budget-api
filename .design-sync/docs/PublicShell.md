---
category: Layout
---

# PublicShell

Client shell for server-rendered, non-Inertia pages (Devise sign-in and friends). Initialises only the logged-out-safe stores — theme reconciliation and flash notifications — then renders `Notifications`.

```jsx
<PublicShell notifications={flashNotifications} />
```
