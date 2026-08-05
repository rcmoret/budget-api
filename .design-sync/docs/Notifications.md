---
category: Feedback
---

# Notifications

Flash-message stack driven by the notification store. Each item animates in and out through `Collapse` with `fade`, and is coloured by `kind` — `alert` (error), `info`, `notice` (success) and `warning`. Renders nothing when the store is empty.

Placed automatically by `PageComponent` and `PublicShell`; dispatch through the
store rather than rendering this directly.
