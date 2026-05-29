import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import {
  useDispatchNotificationStore,
  type Notification,
  type NotificationKind,
} from "./store";

type NotificationsProps = {
  alerts: Array<string>;
  info: Array<string>;
  notices: Array<string>;
  warnings: Array<string>;
};
// notice: "bg-success/85 outline-success text-success-content",
// warning: "bg-warning/70 outline-warning text-warning-content",
// alert: "bg-error/80 outline-error text-error-content",

const kindClassName: Record<NotificationKind, string> = {
  alert: "bg-error/80 outline-gray-800 text-error-content",
  info: "bg-info/85 outline-gray-500 text-info-content",
  notice: "bg-success/85 outline-gray-700 text-success-content",
  warning: "bg-warning/70 outline-gray-500 text-warning-content",
};

const buildNotifications = (
  notifications: NotificationsProps | undefined,
): Array<Notification> => {
  if (!notifications) return [];
  const { alerts = [], info = [], notices = [], warnings = [] } = notifications;
  return [
    ...alerts.map((message, i) => ({
      id: `page-alert-${i}`,
      kind: "alert" as const,
      message,
    })),
    ...warnings.map((message, i) => ({
      id: `page-warning-${i}`,
      kind: "warning" as const,
      message,
    })),
    ...info.map((message, i) => ({
      id: `page-info-${i}`,
      kind: "info" as const,
      message,
    })),
    ...notices.map((message, i) => ({
      id: `page-notice-${i}`,
      kind: "notice" as const,
      message,
    })),
  ];
};

const NotificationItem = (props: {
  item: Notification;
  isClosing: boolean;
  onDismiss: () => void;
}) => {
  const { item, isClosing, onDismiss } = props;

  const wrapperClassName = [
    "grid",
    "transition-all",
    "duration-1000",
    "ease-in-out",
    kindClassName[item.kind],
    "rounded",
    "outline-1",
    "shadow-md",
    isClosing
      ? "grid-rows-[0fr] opacity-0 mb-0"
      : "grid-rows-[1fr] opacity-100 mb-1",
  ].join(" ");

  const itemClassName = [
    "w-full",
    "px-4",
    "py-2",
    "flex",
    "items-center",
    "justify-between",
    "gap-2",
  ].join(" ");

  return (
    <div className={wrapperClassName}>
      <div className="overflow-hidden min-h-0">
        <div className={itemClassName}>
          <span>&bull; {item.message}</span>
          <button
            type="button"
            onClick={onDismiss}
            className="btn btn-ghost btn-xs btn-circle"
            title="dismiss notification"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const { props } = usePage<{ notifications: NotificationsProps }>();
  const items = useDispatchNotificationStore((s) => s.items);
  const closingIds = useDispatchNotificationStore((s) => s.closingIds);
  const resetItems = useDispatchNotificationStore((s) => s.resetItems);
  const beginClose = useDispatchNotificationStore((s) => s.beginClose);

  useEffect(() => {
    resetItems(buildNotifications(props.notifications));
  }, [props.notifications, resetItems]);

  if (!items.length) return null;

  return (
    <div className="w-full mb-4 grid gap-1">
      {items.map((item) => (
        <NotificationItem
          key={item.id}
          item={item}
          isClosing={closingIds.has(item.id)}
          onDismiss={() => beginClose(item.id)}
        />
      ))}
    </div>
  );
};

export { Notifications };
