import { MenuItems } from "./menu-item";
import {
  useAppRoutes,
  useNamespace,
} from "@frontend/lib/app-stores/app-config-store";
import { Link } from "@inertiajs/react";
import { AppConfigItems } from "./config-items";
import { AccountMenuComponent } from "./account-menu-item";
import { useToggle } from "@/utils/hooks/useToogle";
import { Icon } from "@/components/icon";

const ProfileTopLevelLink = () => (
  <div className="top-level-link" aria-current="page">
    Profile
  </div>
);

const TopMenuItems = () => {
  // TODO update the label
  const namespace = useNamespace();
  const label = namespace === "budget" ? "Budget" : "Accounts";
  const budgetDashboardUrl = useAppRoutes("budgetDashboardRoute");

  return (
    <MenuItems label={label}>
      <div
        className="top-level-link"
        aria-current={namespace === "budget" ? "page" : undefined}
      >
        <Link href={budgetDashboardUrl}>Budget</Link>
      </div>

      <div
        className="top-level-link"
        aria-current={namespace === "accounts" ? "page" : undefined}
      >
        <AccountMenuComponent />
      </div>
      {namespace === "profile" && <ProfileTopLevelLink />}
    </MenuItems>
  );
};

const BottomMenuItems = () => {
  const menuLabelClassName = [
    "flex",
    "flex-row",
    "gap-2",
    "text-sm",
    "px-2",
    "list-none",
    "text-primary-content",
    "[&::-webkit-details-marker]:hidden",
  ].join(" ");

  const manageBudgetCategoriesRoute = useAppRoutes(
    "manageBudgetCategoriesRoute",
  );
  const manageAccountsRoute = useAppRoutes("manageAccountsRoute");
  const userProfileRoute = useAppRoutes("userProfileRoute");
  const signOutRoute = useAppRoutes("userSignOutRoute");

  return (
    <div className="flex flex-col gap-2 rounded">
      <div className={menuLabelClassName}>
        <Link href={manageAccountsRoute}>Manage Accounts</Link>
      </div>
      <div className={menuLabelClassName}>
        <Link href={manageBudgetCategoriesRoute}>Manage Categories</Link>
      </div>
      <div className={menuLabelClassName}>
        <Link href={userProfileRoute}>Manage Profile</Link>
      </div>
      <AppConfigItems />
      <div className="text-primary-content text-sm mx-2 pt-4 pb-8 border-t border-neutral">
        <a href={signOutRoute}>Logout</a>
      </div>
    </div>
  );
};

const MobileRail = (props: { onOpen: () => void }) => {
  const railClassName = [
    "flex",
    "md:hidden",
    "flex-col",
    "items-center",
    "gap-4",
    "w-[52px]",
    "h-screen",
    "sticky",
    "top-0",
    "pt-3.5",
    "bg-primary",
  ].join(" ");

  return (
    <div className={railClassName}>
      <button
        type="button"
        title="Open menu"
        aria-label="Open menu"
        onClick={props.onOpen}
        className="w-9 h-9 rounded-lg grid place-items-center text-primary-content text-lg hover:bg-primary-content/10"
      >
        <Icon name="bars" />
      </button>
      <div className="w-7 h-7 rounded-lg bg-base-100 text-primary grid place-items-center text-sm font-bold">
        B
      </div>
    </div>
  );
};

const MobileDrawer = (props: { open: boolean; onClose: () => void }) => {
  const { open, onClose } = props;

  const drawerClassName = [
    "fixed",
    "top-0",
    "left-0",
    "h-full",
    "w-[248px]",
    "z-50",
    "md:hidden",
    "flex",
    "flex-col",
    "pt-4",
    "bg-primary",
    "text-base-content",
    "transition-transform",
    "duration-200",
    "ease-out",
    open ? "translate-x-0" : "-translate-x-full",
  ].join(" ");

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <nav className={drawerClassName} aria-hidden={!open}>
        <div className="flex justify-end px-3.5 pb-2">
          <button
            type="button"
            title="Close menu"
            aria-label="Close menu"
            onClick={onClose}
            className="w-7 h-7 grid place-items-center text-primary-content hover:bg-primary-content/10 rounded"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto grid grid-rows-[1fr_auto]">
          <TopMenuItems />
          <BottomMenuItems />
        </div>
      </nav>
    </>
  );
};

const LeftColumn = () => {
  const [isDrawerOpen, toggleDrawerOpen] = useToggle(false);

  const leftColumnClassName = [
    "hidden",
    "md:grid",
    "lg:w-60",
    "md:w-44",
    "min-w-40",
    "h-screen",
    "sticky",
    "top-0",
    "grid-rows-[1fr_auto]",
    "pt-4",
    "text-base-content",
  ].join(" ");

  return (
    <>
      <MobileRail onOpen={toggleDrawerOpen} />
      <MobileDrawer open={isDrawerOpen} onClose={toggleDrawerOpen} />
      <nav className={leftColumnClassName}>
        <TopMenuItems />
        <BottomMenuItems />
      </nav>
    </>
  );
};

export { LeftColumn };
