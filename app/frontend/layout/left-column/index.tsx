import { MenuItems } from "./menu-item";
import { useAppRoutes, useNamespace } from "@frontend/layout/app-config-store";
import { Link } from "@inertiajs/react";
import { AppConfigItems } from "./config-items";
import { AccountMenuComponent } from "./account-menu-item";

const TopMenuItems = () => {
  const namespace = useNamespace();
  const label = namespace === "budget" ? "Budget" : "Accounts";
  const budgetDashboardUrl = useAppRoutes("budgetDashboardRoute");
  console.log(budgetDashboardUrl);

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
  const signOutRoute = useAppRoutes("userSignOutRoute");

  return (
    <div className="flex flex-col gap-2 rounded">
      <div className={menuLabelClassName}>
        <Link href={manageAccountsRoute}>Manage Accounts</Link>
      </div>
      <div className={menuLabelClassName}>
        <Link href={manageBudgetCategoriesRoute}>Manage Categories</Link>
      </div>
      <AppConfigItems />
      <div className="text-primary-content text-sm mx-2 pt-4 pb-8 border-t border-neutral">
        <Link href={signOutRoute}>Logout</Link>
      </div>
    </div>
  );
};

const LeftColumn = () => {
  const leftColumnClassName = [
    "lg:w-60",
    "md:w-44",
    "w-32",
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
