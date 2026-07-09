type CollapseProps = {
  open: boolean;
  children: React.ReactNode;
  durationMs?: number; // default 300
  fade?: boolean; // also transition opacity (default false)
  subgrid?: boolean; // participate in a parent subgrid (default false)
  className?: string; // extra classes on the outer grid (positioning, bg, etc.)
  innerClassName?: string; // extra classes on the inner overflow wrapper
  tabIndex?: number;
};

const Collapse = (props: CollapseProps) => {
  const {
    open,
    children,
    durationMs = 300,
    fade = false,
    subgrid = false,
    className = "",
    innerClassName = "",
    tabIndex,
  } = props;

  const outerClassName = [
    "grid",
    ...(subgrid ? ["grid-cols-subgrid", "col-span-full"] : []),
    fade
      ? "transition-[grid-template-rows,opacity]"
      : "transition-[grid-template-rows]",
    "ease-in-out",
    open ? "grid-rows-[minmax(0,1fr)]" : "grid-rows-[minmax(0,0fr)]",
    ...(fade ? [open ? "opacity-100" : "opacity-0"] : []),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const wrapperClassName = [
    "overflow-hidden",
    "min-h-0",
    ...(subgrid ? ["grid", "grid-cols-subgrid", "col-span-full"] : []),
    innerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  // durationMs is dynamic → inline style; Tailwind JIT can't see `duration-${n}`.
  // The grid-rows / transition-property classes above are static literals, so JIT emits them.
  return (
    <div
      tabIndex={tabIndex}
      className={outerClassName}
      style={{ transitionDuration: `${durationMs}ms` }}
    >
      <div className={wrapperClassName}>{children}</div>
    </div>
  );
};

export { Collapse };
