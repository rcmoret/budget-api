import { Link as InertiaLink } from "@inertiajs/react";

import { AccountShow, AccountSummary } from "@/types/account";
import { Row } from "@/components/common/Row";
import { AmountSpan } from "@/components/common/AmountSpan";
import { byPriority as sortByPriority } from "@/lib/sort_functions";

interface AccountSummaryProps {
  account: AccountSummary;
  isSelected: boolean;
}

const IndividualTab = ({ account, isSelected }: AccountSummaryProps) => {
  const bgColor = isSelected ? "bg-sky-200" : "bg-gray-100";
  const borderColor = isSelected ? "border-sky-600" : "border-gray-400"
  const padding = "p-4";
  const width = "sm:min-w-[30%] md:min-w-[10%] lg:min-w-[12%] whitespace-nowrap";
  const styles = ["rounded", "shadow-lg", bgColor, padding, width].join(" ");

  return (
    <div className={styles}>
      <InertiaLink href={`/account/${account.slug}/transactions`}>
        <div className={`border-b-2 ${borderColor} border-solid`}>{account.name}</div>
        <div className="text-right">
          <AmountSpan amount={account.balance} />
        </div>
      </InertiaLink>
    </div>
  );
};

interface PropType {
  accounts: AccountSummary[];
  selectedAccount: AccountShow | null;
}

const AccountTabs = (props: PropType) => {
  const accounts = props.accounts
    .filter((account) => !account.isArchived)
    .sort(sortByPriority);

  return (
    <Row
      styling={{
        alignItems: "items-start",
        backgroundColor: "bg-white",
        flexWrap: "flex-nowrap",
        flexDirection: "flex-row",
        rounded: "rounded",
        padding: "p-2",
        position: "relative"
      }}
    >
      <Row styling={{ position: "relative", overflow: "overflow-scroll", gap: "gap-4", padding: "py-1" }}>
        {accounts.map((account) => (
          <IndividualTab
            key={account.key}
            account={account}
            isSelected={account.key === props.selectedAccount?.key}
          />
        ))}
      </Row>
    </Row>
  );
};

export { AccountTabs };
