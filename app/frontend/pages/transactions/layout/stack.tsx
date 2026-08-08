import React from "react";
import { useTransactionContext } from "../context-provider";

const Stack = (props: {
  children: React.ReactNode;
  items: Array<React.ReactNode>;
  textAlign?: "left" | "right";
  className?: string;
}) => {
  const { textAlign = "left", className: extraClassName } = props;

  const className = [`text-${textAlign}`, "flex", "flex-col", extraClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <div>{props.children}</div>
      {props.items.map((item, index) => (
        <StackItem key={index}>{item}</StackItem>
      ))}
    </div>
  );
};

const StackItem = (props: { children: React.ReactNode }) => {
  return <div className="text-sm px-2">{props.children}</div>;
};

export { Stack };
