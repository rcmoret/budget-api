---
category: Forms
---

# CreateEventSelectComponent

Inertia-backed form for creating a budget event against a category. Fetches its selectable events on mount and posts through `useForm`, so it needs a live Inertia page context and app routes — it is not statically renderable.

Must be rendered inside `CreateEventSelectProvider`.
