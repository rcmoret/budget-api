import { backgroundFill } from "@/lib/context-colors";

const IconDictionary = {
  "angle-double-left": "fas fa-angle-double-left",
  "angle-double-right": "fas fa-angle-double-right",
  "arrow-right": "fas fa-arrow-right",
  bars: "fas fa-bars",
  calendar: "fas fa-calendar",
  "caret-down": "fas fa-caret-down",
  "caret-right": "fas fa-caret-right",
  "check-circle": "fas fa-check-circle",
  circle: "fas fa-circle",
  download: "fas fa-download",
  edit: "fa  fa-edit",
  "external-arrow": "fas fa-external-link-alt",
  "file-image": "fas fa-file-image",
  "file-pdf": "fas fa-file-pdf",
  "folder-open": "far fa-folder-open",
  gears: "fa fa-gears",
  "money-check": "fas fa-money-check",
  paperclip: "fas fa-paperclip",
  plus: "fa fa-plus",
  "plus-circle": "fas fa-plus-circle",
  "sticky-note": "fas fa-sticky-note",
  "times-circle": "fas fa-times-circle",
  trash: "fas fa-trash",
};

type IconName = keyof typeof IconDictionary;

const Icon = ({ name }: { name: IconName }) => {
  const className = IconDictionary[name] || name;
  // aria-hidden="true" hides decorative icons from screen readers
  // The parent element (button, link) should provide the accessible name
  return <span className={className} aria-hidden="true" />;
};

const GreenCheck = () => {
  return (
    <div
      className={`p-1 text-xs ${backgroundFill("green")} text-chartreuse-300 rounded`}
    >
      <Icon name="check-circle" />
    </div>
  );
};

export { Icon, IconName, GreenCheck };
