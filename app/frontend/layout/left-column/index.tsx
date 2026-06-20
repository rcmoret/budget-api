import { SelectedLabel, UnselectedLabel } from "./label";
import { MenuItems } from "./menu-item";
import {
  getPageName,
  useNamespace,
} from "@frontend/layout/app-config-store";
import { Link } from "@inertiajs/react";
import { AppConfigItems } from "./config-items";
import { AccountLinks } from "./account-links";

const accountsIndexUrl = "/accounts";
const budgetCategoryIndexUrl = "/budget";

const dropDownClasses: Array<string> = [
  "dropdown dropdown-hover"
]

const AccountNamespaceMenuItems = () => {
  const pageName = getPageName()

  if (pageName === "transactions_index") {
    return (
      <MenuItems label="Accounts">
        <UnselectedLabel name="Budget" href={budgetCategoryIndexUrl} />
        <SelectedLabel name="Accounts" classes={dropDownClasses} >
          <AccountLinks />
        </SelectedLabel>
      </MenuItems>
    );
  } else {
    return (
      <MenuItems label="Accounts">
        <UnselectedLabel name="Budget" href={budgetCategoryIndexUrl} />
        <SelectedLabel name="Accounts" />
      </MenuItems>
    );
  }
}
const TopMenuItems = () => {
  const namespace = useNamespace();

  if (namespace === "accounts") {
    return <AccountNamespaceMenuItems />
  } else if (namespace === "budget") {
    return (
      <MenuItems label="Budget">
        <SelectedLabel name="Budget" />
        <UnselectedLabel name="Accounts" href={accountsIndexUrl} />
      </MenuItems>
    );
  } else {
    return (
      <MenuItems label="Budget">
        <UnselectedLabel name="Budget" href={budgetCategoryIndexUrl} />
        <UnselectedLabel name="Accounts" href={accountsIndexUrl} />
      </MenuItems>
    );
  }
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
    "bg-primary",
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
