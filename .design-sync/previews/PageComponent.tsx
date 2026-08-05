import {
  PageComponent,
  HeaderComponent,
  GroupLabel,
  ActiveItemCard,
  CardLabel,
  CardRow,
  AmountSpan,
  BudgetSummaryComponent,
  initNavigationLinks,
  useAppConfigStore,
} from "@budget/design-system";

// The full page frame: left navigation, a sticky header, a scrolling main and a
// right aside carrying Notifications plus a RightColumnWrapper. Composes
// LeftColumn internally, so the navigation stores need seeding.
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

export const BudgetPage = () => (
  <Seeded>
    <PageComponent
      mainId="budget-main"
      header={<HeaderComponent title="February 2026" />}
      rightColumn={
        <BudgetSummaryComponent
          label="Summary"
          values={[
            { key: "income", label: "Income", amount: { cents: 482500, display: "$4,825.00" } },
            { key: "spent", label: "Spent", amount: { cents: -359450, display: "-$3,594.50" } },
          ]}
        />
      }
    >
      <GroupLabel>Fixed expenses</GroupLabel>
      <ActiveItemCard id="cat-rent" label={<CardLabel label="Rent" />}>
        <CardRow><span className="mr-auto">Budgeted</span><AmountSpan amount={185000} colorize="none" /></CardRow>
      </ActiveItemCard>
      <ActiveItemCard id="cat-groceries" label={<CardLabel label="Groceries" />}>
        <CardRow><span className="mr-auto">Budgeted</span><AmountSpan amount={65000} colorize="none" /></CardRow>
        <CardRow><span className="mr-auto">Spent</span><AmountSpan amount={-41275} colorize="normal" /></CardRow>
      </ActiveItemCard>
    </PageComponent>
  </Seeded>
);
