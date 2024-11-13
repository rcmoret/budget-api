const IconDictionary = {
  "angle-double-left": "fas fa-angle-double-left",
  "angle-double-right": "fas fa-angle-double-right",
  "arrow-right": "fas fa-arrow-right",
  bars: "fas fa-bars",
  calendar: "fas fa-calendar",
  "caret-down": "fas fa-caret-down",
  "caret-right": "fas fa-caret-right",
  "check-circle": "fas fa-check-circle",
  "plus-circle": "fas fa-plus-circle",
  edit: "fa  fa-edit",
  gears: "fa fa-gears",
  "money-check": "fas fa-money-check",
  "sticky-note": "fas fa-sticky-note",
  "times-circle": "fas fa-times-circle",
  trash: "fas fa-trash",
};

type IconName = keyof typeof IconDictionary;

const Icon = ({ name }: { name: IconName }) => {
  const className = IconDictionary[name] || name;
  return <span className={className} />;
};

export { Icon, IconName };
