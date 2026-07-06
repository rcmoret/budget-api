const GroupLabel = (props: { children: React.ReactNode }) => {
  const groupLabelClassName = [
    "from-accent/70",
    "dark:from-accent/90",
    "to-accent/40",
    "dark:to-accent/66",
    "shadow-md",
    "text-base-content",
    "dark:text-accent-content",
    "flex",
    "gap-2",
    "px-4",
    "py-2",
    "rounded",
    "text-xl",
    "tracking-wide",
    "bg-gradient-to-r",
  ].join(" ");

  return <div className={groupLabelClassName}>{props.children}</div>;
};

export { GroupLabel };
