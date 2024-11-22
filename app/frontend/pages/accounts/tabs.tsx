import { Link as InertiaLink } from "@inertiajs/react";

import { AccountShow, AccountSummary } from "@/types/account";
import { Row } from "@/components/common/Row";
import { AmountSpan } from "@/components/common/AmountSpan";
import { sortByPriority } from "@/lib/models/account";

interface AccountSummaryProps {
  account: AccountSummary;
  isSelected: boolean;
}

const IndividualTab = ({ account, isSelected }: AccountSummaryProps) => {
  const bgColor = isSelected ? "bg-sky-200" : "bg-gray-200";
  const borderColor = isSelected ? "border-sky-300" : "border-gray-400"
  const padding = "p-4";
  const width = "sm:min-w-[30%] md:min-w-[10%] lg:min-w-[12%]";
  const margin = "";
  const styles = ["rounded", bgColor, padding, width, margin].join(" ");

  return (
    <div className={styles}>
      <InertiaLink href={`/account/${account.slug}/transactions`}>
        <div className={`border-b ${borderColor} border-solid`}>{account.name}</div>
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
        flexWrap: "flex-wrap",
        flexDirection: "flex-row",
        gap: "gap-4",
        rounded: "rounded",
        padding: "p-2",
        margin: "mb-2",
        overflow: "overflow-visible",
        border: "border-b-2 border-blue-100",
      }}
    >
      {accounts.map((account) => (
        <IndividualTab
          key={account.key}
          account={account}
          isSelected={account.key === props.selectedAccount?.key}
        />
      ))}
    </Row>
  );
};

export { AccountTabs };
