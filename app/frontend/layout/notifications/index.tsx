import {
  useDispatchNotificationStore,
  CLOSE_ANIMATION_MS,
  type Notification,
  type NotificationKind,
} from "@/lib/app-stores/notification-store";
import { Collapse } from "@/components/collapse";

const kindClassName: Record<NotificationKind, string> = {
  alert: "bg-error/80 border-gray-800 text-error-content",
  info: "bg-info/85 border-gray-500 text-info-content",
  notice: "bg-success/85 border-gray-700 text-success-content",
  warning: "bg-warning/70 border-gray-500 text-warning-content",
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

const Notifications = () => {
  const items = useDispatchNotificationStore((s) => s.items);
  const closingIds = useDispatchNotificationStore((s) => s.closingIds);
  const beginClose = useDispatchNotificationStore((s) => s.beginClose);

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

export { Notifications, kindClassName };
