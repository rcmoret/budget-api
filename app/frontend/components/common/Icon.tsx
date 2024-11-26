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
  "plus": "fa fa-plus",
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

const GreenCheck = () => {
  return (
    <div className="p-1 text-xs bg-green-600 text-chartreuse-300 rounded">
      <Icon name="check-circle" />
    </div>
  )
}

export { Icon, IconName, GreenCheck };
