import React from "react";

const IconDictionary = {
  "angle-double-left": "fas fa-angle-double-left",
  "angle-double-right": "fas fa-angle-double-right",
  "arrow-right": "fas fa-arrow-right",
  calendar: "fas fa-calendar",
  "caret-down": "fas fa-caret-down",
  "caret-right": "fas fa-caret-right",
  edit: "fa  fa-edit",
  "money-check": "fas fa-money-check",
  "sticky-note": "fas fa-sticky-note",
  trash: "fas fa-trash",
};

type IconName = keyof typeof IconDictionary;

const Icon = ({ name }: { name: IconName }) => {
  const className = IconDictionary[name] || name;
  return <span className={className} />;
};

export { Icon, IconName };
