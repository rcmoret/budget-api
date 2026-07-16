import { kindClassName } from "@/layout/notifications";
import { NotificationKind } from "@/lib/app-stores/notification-store";

type ThemeOption = "warning" | "success"; // | "tertiary"

const pillClassName = (themeOption: NotificationKind) =>
  [
    kindClassName[themeOption],
    "shadow-sm",
    "rounded-lg",
    "px-3",
    "py-0.5",
    "text-xs",
  ].join(" ");

const Pill = (props: {
  children: React.ReactNode;
  themeOption: NotificationKind;
}) => {
  return (
    <div className={pillClassName(props.themeOption)}>{props.children}</div>
  );
};

export { Pill };
