import { useInitTheme } from "@/lib/app-stores/theme-store";
import { useInitNotificationStore } from "@/lib/app-stores/notification-store";
import { Notifications } from "@/layout/notifications";
import { NotificationsCollectionType } from "@/types/page_props";

type PublicShellProps = {
  notifications: NotificationsCollectionType;
};

// Client shell for server-rendered (non-Inertia) pages such as Devise. It only
// initializes stores that don't depend on logged-in data: theme reconciliation
// and flash notifications.
const PublicShell = ({ notifications }: PublicShellProps) => {
  useInitTheme();
  useInitNotificationStore(notifications);

  return <Notifications />;
};

export { PublicShell };
