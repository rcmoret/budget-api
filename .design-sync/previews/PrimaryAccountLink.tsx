import {
  AccountMenuComponent,
  initNavigationLinks,
  useAppConfigStore,
} from "@budget/design-system";

// PrimaryAccountLink reads the account-menu context for its expand/collapse
// toggle, and that provider is internal to AccountMenuComponent — so the only
// true render is in situ, inside its parent.
useAppConfigStore.setState({
  namespace: "budget",
  appRoutes: {
    ...useAppConfigStore.getState().appRoutes,
    accountMenuRoute: "/accounts",
  },
});

const accounts = [
  { key: "a1", name: "Checking", slug: "checking", href: "/accounts/checking", balance: 248350 },
  { key: "a2", name: "Savings", slug: "savings", href: "/accounts/savings", balance: 1204000 },
];

const Seeded = (props: { children: React.ReactNode }) => {
  initNavigationLinks(accounts);
  return <>{props.children}</>;
};

export const InAccountMenu = () => (
  <Seeded>
    <div className="w-64 bg-primary p-3 rounded text-primary-content">
      <AccountMenuComponent />
    </div>
  </Seeded>
);
