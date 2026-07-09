import { useEffect } from "react";
import {
  useDispatchNotificationStore,
  CLOSE_ANIMATION_MS,
  type Notification,
  type NotificationKind,
} from "./store";
import { NotificationsCollectionType } from "@/types/page_props";
import { Collapse } from "@/components/collapse";

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
  alert: "bg-error/80 border-gray-800 text-error-content",
  info: "bg-info/85 border-gray-500 text-info-content",
  notice: "bg-success/85 border-gray-700 text-success-content",
  warning: "bg-warning/70 border-gray-500 text-warning-content",
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

  const innerClassName = [
    kindClassName[item.kind],
    "rounded",
    "border-1",
    "shadow-md",
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
    <Collapse
      open={!isClosing}
      fade
      durationMs={CLOSE_ANIMATION_MS}
      innerClassName={innerClassName}
    >
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
    </Collapse>
  );
};

const Notifications = (props: {
  notifications: NotificationsCollectionType;
}) => {
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
