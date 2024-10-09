import { InertiaLink } from "@inertiajs/inertia-react";

import { AccountShow, AccountSummary } from "@/types/account";
import { Row } from "@/components/common/Row";
import { AmountSpan } from "@/components/common/AmountSpan";
import { byPriority } from "@/lib/sort_functions";

interface AccountSummaryProps {
  account: AccountSummary;
  isSelected: boolean;
}

const IndividualTab = ({ account, isSelected }: AccountSummaryProps) => {
  const bgColor = `bg-${isSelected ? "blue" : "gray"}-400`;
  const padding = "pt-4 pb-4 pr-2 pl-2";
  const width = "sm:w-[30%] md:w-[10%] lg:w-[12%]";
  const margin = "mb-2 mr-2";
  const styles = ["rounded", bgColor, padding, width, margin].join(" ");

  return (
    <div className={styles}>
      <InertiaLink href={`/account/${account.slug}/transactions`}>
        <div className="border-b border-black border-solid">{account.name}</div>
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
    .sort(byPriority);

  return (
    <Row
      styling={{
        alignItems: "items-start",
        flexWrap: "flex-wrap",
        rounded: null,
        overflow: "overflow-visible",
        backgroundColor: "bg-gradient-to-b from-blue-200 to-white",
      }}
    >
      <Row
        styling={{
          alignItems: "items-start",
          flexWrap: "flex-wrap",
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
    </Row>
  );
};

export { AccountTabs };
