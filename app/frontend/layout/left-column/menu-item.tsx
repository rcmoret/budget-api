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

export { MenuItems };
