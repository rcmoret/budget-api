import { useToggle } from "@/utils/hooks/useToogle";
import { IndividualAccountLinks } from "./dropdown-account-links";
import { createContext, useContext } from "react";
import { PrimaryAccountLink } from "./primary-link";
import { getAccountLinks } from "@/layout/account-navigation-store";
import { Collapse } from "@/components/collapse";
import { useNamespace } from "@/lib/app-stores/app-config-store";

type AccountMenuContextType = {
  isMenuOpen: boolean;
  renderDropdown: boolean;
  toggleMenuOpen: () => void;
};

const AccountMenuContext = createContext<null | AccountMenuContextType>(null);

const AccountMenuProvider = (props: { children: React.ReactNode }) => {
  const [isMenuOpen, toggleMenuOpen] = useToggle(false);
  const accounts = getAccountLinks();

  const value: AccountMenuContextType = {
    isMenuOpen,
    renderDropdown: !!accounts.length,
    toggleMenuOpen,
  };

  return (
    <AccountMenuContext.Provider value={value}>
      {props.children}
    </AccountMenuContext.Provider>
  );
};

const useAccountMenuContext = () => {
  const context = useContext(AccountMenuContext);

  if (!context) {
    throw new Error(
      "useAccountMenuContext must be used within an AccountMenuProvider",
    );
  }

  return context;
};

const DropdownAccountLinks = () => {
  const { isMenuOpen, renderDropdown } = useAccountMenuContext();
  const namespace = useNamespace();

  if (!renderDropdown) return null;

  const className = [
    "mx-2 z-1",
    ...(namespace === "profile" ? ["mt-2"] : ["mt-3", "absolute"]),
  ].join(" ");

  return (
    <Collapse
      open={isMenuOpen}
      fade
      durationMs={1000}
      tabIndex={-1}
      className={className}
      innerClassName="rounded text-secondary-content bg-secondary text-sm"
    >
      <IndividualAccountLinks />
    </Collapse>
  );
};

const AccountMenuComponent = () => {
  return (
    <AccountMenuProvider>
      <PrimaryAccountLink />
      <DropdownAccountLinks />
    </AccountMenuProvider>
  );
};

export {
  AccountMenuComponent,
  DropdownAccountLinks as AccountLinks,
  useAccountMenuContext,
};
