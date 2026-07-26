import React from "react";

const FormRow = (props: { children: React.ReactNode; className?: string }) => {
  const className = [
    "grid grid-cols-subgrid col-span-full gap-2",
    props.className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={className}>{props.children}</div>;
};

export { FormRow };
