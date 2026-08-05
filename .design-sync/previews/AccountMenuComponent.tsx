import {
  AccountMenuComponent,
  initNavigationLinks,
  useAppConfigStore,
} from "@budget/design-system";

// Expandable account switcher: a primary link plus a collapsible list of the
// remaining accounts. Reads the account-navigation store and the app routes, so
// a preview seeds both. Collapsed at rest — the dropdown opens on click.
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
  { key: "a3", name: "Credit Card", slug: "credit-card", href: "/accounts/credit-card", balance: -87425 },
];

const Seeded = (props: { children: React.ReactNode }) => {
  initNavigationLinks(accounts);
  return <>{props.children}</>;
};

export const InLeftColumn = () => (
  <Seeded>
    <div className="w-64 bg-primary p-3 rounded text-primary-content">
      <AccountMenuComponent />
    </div>
  </Seeded>
);
