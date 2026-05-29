const MenuItemList = (props: { children: React.ReactNode }) => {
  const listClassName = [
    "rounded",
    "flex",
    "flex-col",
    "gap-1",
    "py-4",
    "max-h-2/3",
    "overflow-y-scroll",
    "text-content-base",
    "bg-neutral",
    "[&::-webkit-scrollbar]:w-0",
    "[scrollbar-width:none]",
  ].join(" ");

  const boxShadows = [
    "inset 0 2px 8px -3px var(--color-primary)",
    "inset 0 -2px 8px -3px var(--color-primary)",
  ];

  return (
    <div className="relative mx-2 h-full">
      <div
        className={listClassName}
        style={{ boxShadow: boxShadows.join(", ") }}
      >
        {props.children}
      </div>
    </div>
  );
};

type MenuItemProps = {
  children: React.ReactNode;
};

const MenuItems = (props: MenuItemProps & { label: string }) => {
  const navItemClassName = ["flex", "flex-col", "gap-2", "py-3"].join(" ");

  return (
    <div aria-label={props.label} className={navItemClassName}>
      {props.children}
    </div>
  );
};

export { MenuItems, MenuItemList };
