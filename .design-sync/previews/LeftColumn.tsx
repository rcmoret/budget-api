import {
  LeftColumn,
  initNavigationLinks,
  useAppConfigStore,
} from "@budget/design-system";

// The app's primary navigation column. Reads the navigation and app-config
// stores, so a preview seeds the routes and account list it renders from.
useAppConfigStore.setState({
  namespace: "budget",
  appRoutes: {
    accountMenuRoute: "/accounts",
    budgetDashboardRoute: "/budget",
    createBudgetEventsRoute: "/budget/events",
    currentRoute: "/budget",
    manageAccountsRoute: "/accounts/manage",
    manageBudgetCategoriesRoute: "/budget/categories",
    userProfileRoute: "/profile",
    userSignOutRoute: "/sign-out",
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

export const Default = () => (
  <Seeded>
    <div className="h-[28rem] flex"><LeftColumn /></div>
  </Seeded>
);
