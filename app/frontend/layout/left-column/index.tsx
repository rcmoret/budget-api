import { MenuItems } from "./menu-item";
import { useAppRoutes, useNamespace } from "@frontend/lib/app-stores/app-config-store";
import { Link } from "@inertiajs/react";
import { AppConfigItems } from "./config-items";
import { AccountMenuComponent } from "./account-menu-item";

const TopMenuItems = () => {
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
        <Link href={userProfileRoute}>Profile</Link>
      </div>
      <AppConfigItems />
      <div className="text-primary-content text-sm mx-2 pt-4 pb-8 border-t border-neutral">
        <a href={signOutRoute}>Logout</a>
      </div>
    </div>
  );
};

const LeftColumn = () => {
  const leftColumnClassName = [
    "lg:w-60",
    "md:w-44",
    "min-w-40",
    "h-screen",
    "sticky",
    "top-0",
    "grid",
    "grid-rows-[1fr_auto]",
    "pt-4",
    "text-base-content",
  ].join(" ");

  return (
    <nav className={leftColumnClassName}>
      <TopMenuItems />
      <BottomMenuItems />
    </nav>
  );
};

export { LeftColumn };
