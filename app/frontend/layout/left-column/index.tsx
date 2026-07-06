import { MenuItems } from "./menu-item";
import { useNamespace } from "@frontend/layout/app-config-store";
import { Link } from "@inertiajs/react";
import { AppConfigItems } from "./config-items";
import { AccountLinks } from "./account-links";

const accountsIndexUrl = "/accounts";
const budgetCategoryIndexUrl = "/budget";

const TopMenuItems = () => {
  const namespace = useNamespace();
  const label = namespace === "budget" ? "Budget" : "Accounts";

  return (
    <MenuItems label={label}>
      <Link href={budgetCategoryIndexUrl}>
        <div
          className="top-level-link"
          aria-current={namespace === "budget" ? "page" : undefined}
        >
          Budget
        </div>
      </Link>

      <div className="dropdown">
        <div
          className="top-level-link flex items-center"
          aria-current={namespace === "accounts" ? "page" : undefined}
        >
          <Link href={accountsIndexUrl}>Accounts</Link>
          <button
            tabIndex={0}
            aria-label="Toggle accounts menu"
            aria-haspopup="true"
            className="px-1"
          >
            ▾
          </button>
        </div>
        <AccountLinks />
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

  return (
    <div className="flex flex-col gap-2 rounded">
      <div className={menuLabelClassName}>
        <Link href="/accounts/manage">Manage Accounts</Link>
      </div>
      <div className={menuLabelClassName}>
        <Link href="/budget/categories">Manage Categories</Link>
      </div>
      <AppConfigItems />
      <div className="text-primary-content text-sm mx-2 pt-4 pb-8 border-t border-neutral">
        Logout
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
