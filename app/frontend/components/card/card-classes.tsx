const cardBgValue = "bg-base-300";
const formBgValue = "bg-base-300/25";
const rowClassName = ["flex", "flex-row", "justify-between"].join(" ");

const outerCardClassName = (props: {
  bgColor: string;
  flex?: boolean;
  additional?: Array<string>;
}) => {
  const { bgColor, additional = [], flex = true } = props;
  return [
    bgColor,
    "card",
    "shadow-md",
    "py-2",
    "px-4",
    ...(flex ? ["flex", "flex-col", "gap-2"] : []),
    ...additional,
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
