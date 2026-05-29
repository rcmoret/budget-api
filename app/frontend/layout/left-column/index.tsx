import { SelectedLabel, UnselectedLabel } from "./label";
import { MenuItems } from "./menu-item";
import {
  useIsDarkTheme,
  useNamespace,
  useShowAccruals,
  useToggleShowAccruals,
  useToggleTheme,
} from "@frontend/layout/app-config-store";
import { ToggleSlider } from "@frontend/components/slider";
import { Link } from "@inertiajs/react";

const accountsIndexUrl = "/accounts";
const budgetCategoryIndexUrl = "/budget/categories";

const TopMenuItems = () => {
  const namespace = useNamespace();

  if (namespace === "accounts") {
    return (
      <MenuItems label="Accounts">
        <UnselectedLabel name="Budget" href={budgetCategoryIndexUrl} />
        <SelectedLabel name="Accounts" />
      </MenuItems>
    );
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

const outerButtonClassName = [
  "w-full",
  "overflow-hidden",
  "not-last:border-b",
  "not-last:border-neutral",
].join(" ");
const innerButtonClassName = [
  "px-2",
  "py-1",
  "flex",
  "flex-row",
  "items-center",
  "justify-between",
  "gap-2",
  "text-xs",
  "text-base-content",
  "w-full",
].join(" ");

const ThemeToggle = () => {
  const isDark = useIsDarkTheme();
  const toggleTheme = useToggleTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={outerButtonClassName}
    >
      <div className={innerButtonClassName}>
        <div>Dark Mode</div>
        <div className="grid items-center">
          <ToggleSlider toggleValue={isDark} ariaLabel="toggle dark mode" />
        </div>
      </div>
    </button>
  );
};

const BottomMenuItems = () => {
  const showAccruals = useShowAccruals();
  const toggleShowAccruals = useToggleShowAccruals();

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
      <details className="collapse rounded-none pb-4" name="my-accordion-det-1">
        <summary className="list-none [&::-webkit-details-marker]:hidden">
          <div className={menuLabelClassName}>
            <div>&#9965;</div>
            <div>Config Options</div>
          </div>
        </summary>
        <div className="collapse-content w-full px-2 py-1 mt-2 ">
          <div className="bg-secondary text-secondary-content rounded">
            <button
              type="button"
              onClick={toggleShowAccruals}
              className={outerButtonClassName}
            >
              <div className={innerButtonClassName}>
                <div>Toggle Accrual Items</div>
                <div className="grid items-center">
                  <ToggleSlider
                    toggleValue={showAccruals}
                    ariaLabel="toggle accrual items"
                  />
                </div>
              </div>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </details>
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
