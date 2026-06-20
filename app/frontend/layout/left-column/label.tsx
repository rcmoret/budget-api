import { Link } from "@inertiajs/react";

const innerClassName = (props: { isSelected: boolean }) => {
  return [
    ...(props.isSelected
      ? ["bg-base-300", "font-semibold"]
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

type SelectedLabelProps = {
  name: string;
  href?: string;
  classes?: Array<string>;
  children?: React.ReactNode;
}

const SelectedLabel = (props: SelectedLabelProps) => {
  const suppliedClasses = props.classes ?? []
  const className = ["bg-primary", ...suppliedClasses].join(" ")

  if (!!props.href) {
    return (
      <div className={className}>
        <Link href={props.href}>
          <div className={innerClassName({ isSelected: true })}>
            {props.name}
          </div>
        </Link>
        {props.children}
      </div>
    )
  }
  return (
    <div className={className}>
      <div tabIndex={0} role="button" className={innerClassName({ isSelected: true })}>{props.name}</div>
      {props.children}
    </div>
  );
};

const UnselectedLabel = (props: { name: string; href: string }) => {
  return (
    <div className="bg-primary">
      <Link href={props.href}>
        <div className={innerClassName({ isSelected: false })}>
          {props.name}
        </div>
      </Link>
    </div>
  );
};

export { SelectedLabel, UnselectedLabel };
