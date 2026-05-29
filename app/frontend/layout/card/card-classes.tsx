const cardBgValue = "bg-accent/15";
const formBgValue = "bg-accent/30";
const rowClassName = ["flex", "flex-row", "justify-between"].join(" ");

const outerCardClassName = (props: {
  bgColor: string;
  additional?: Array<string>;
}) => {
  return [
    props.bgColor,
    "card",
    "shadow-md",
    "py-2",
    "px-4",
    "flex",
    "flex-col",
    "gap-2",
    ...(props.additional || []),
  ].join(" ");
};

const innerCardClassName = [
  "flex",
  "flex-col",
  "gap-1",
  "px-1",
  "text-sm",
].join(" ");

export {
  cardBgValue,
  formBgValue,
  rowClassName,
  outerCardClassName,
  innerCardClassName,
};
