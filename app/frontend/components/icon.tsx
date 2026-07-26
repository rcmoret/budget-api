const IconDictionary = {
  "angle-double-left": "fas fa-angle-double-left",
  "angle-double-right": "fas fa-angle-double-right",
  "arrow-right": "fas fa-arrow-right",
  "arrow-up": "fas fa-arrow-up",
  "arrow-down": "fas fa-arrow-down",
  bars: "fas fa-bars",
  bold: "fas fa-bold",
  calendar: "fas fa-calendar",
  "caret-down": "fas fa-caret-down",
  "caret-right": "fas fa-caret-right",
  "check-circle": "fas fa-check-circle",
  circle: "fas fa-circle",
  "external-arrow": "fas fa-external-link-alt",
  coins: "fas fa-coins",
  "plus-circle": "fas fa-plus-circle",
  plus: "fa fa-plus",
  edit: "fa  fa-edit",
  "folder-open": "far fa-folder-open",
  gears: "fa fa-gears",
  italic: "fas fa-italic",
  "money-check": "fas fa-money-check",
  paperclip: "fas fa-paperclip",
  "sticky-note": "fas fa-sticky-note",
  "times-circle": "fas fa-times-circle",
  trash: "fas fa-trash",
  underline: "fas fa-underline",
};

type IconName = keyof typeof IconDictionary;

const Icon = ({ name }: { name: IconName }) => {
  const className = IconDictionary[name] || name;
  return <i className={className} />;
};

const GreenCheck = () => {
  return (
    <div className="p-1 text-xs bg-green-600 text-chartreuse-300 rounded">
      <Icon name="check-circle" />
    </div>
  );
};

export { Icon, type IconName, GreenCheck };
