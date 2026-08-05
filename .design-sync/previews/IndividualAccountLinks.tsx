import {
  IndividualAccountLinks,
  initNavigationLinks,
} from "@budget/design-system";

// Takes no props — it renders whatever is in the account-navigation store, so a
// preview has to seed that store first (an app does this from its page props).
const accounts = [
  { key: "a1", name: "Checking", slug: "checking", href: "/accounts/checking", balance: 248350 },
  { key: "a2", name: "Savings", slug: "savings", href: "/accounts/savings", balance: 1204000 },
  { key: "a3", name: "Credit Card", slug: "credit-card", href: "/accounts/credit-card", balance: -87425 },
];

const Seeded = (props: { children: React.ReactNode }) => {
  initNavigationLinks(accounts);
  return <>{props.children}</>;
};

export const AccountList = () => (
  <Seeded>
    <div className="w-64 rounded bg-secondary text-secondary-content text-sm">
      <IndividualAccountLinks />
    </div>
  </Seeded>
);
