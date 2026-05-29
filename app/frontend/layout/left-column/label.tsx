import { Link } from "@inertiajs/react";

const outerClassName = [
  "z-30",
  "top-0",
  "flex",
  "flex-col",
  "gap-2",
  "bg-primary",
].join(" ");

const innerClassName = (props: { isSelected: boolean }) => {
  return [
    ...(props.isSelected
      ? ["dark:bg-base-100/30", "bg-base-100/15", "font-semibold"]
      : []),
    "text-primary-content",
    "text-xl",
    "py-2",
    "pl-2",
    "flex",
    "flex-col",
    "justify-center",
    "rounded",
    "z-30",
    "mx-1",
  ].join(" ");
};

const SelectedLabel = (props: { name: string }) => {
  return (
    <div className={outerClassName}>
      <div className={innerClassName({ isSelected: true })}>{props.name}</div>
    </div>
  );
};

const UnselectedLabel = (props: { name: string; href: string }) => {
  return (
    <div className={outerClassName}>
      <Link href={props.href}>
        <div className={innerClassName({ isSelected: false })}>
          {props.name}
        </div>
      </Link>
    </div>
  );
};

export { SelectedLabel, UnselectedLabel };
