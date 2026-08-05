import {
  Notifications,
  useDispatchNotificationStore,
} from "@budget/design-system";

// Reads the notification store and renders nothing when it is empty. Seeded
// directly here rather than through resetItems, which also schedules the 3s
// auto-dismiss and would empty the card before it is captured.
useDispatchNotificationStore.setState({
  items: [
    { id: "n1", kind: "notice", message: "Budget saved." },
    { id: "n2", kind: "info", message: "3 transactions imported." },
    { id: "n3", kind: "warning", message: "Groceries is over budget." },
    { id: "n4", kind: "alert", message: "Could not reach the bank feed." },
  ],
  closingIds: new Set<string>(),
});

export const AllKinds = () => (
  <div className="w-96"><Notifications /></div>
);
