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
  const bgColor = isSelected ? "bg-sky-200" : "bg-gray-100";
  const borderColor = isSelected ? "border-sky-600" : "border-gray-400"
  const padding = "p-4";
  const width = "sm:min-w-[30%] md:min-w-[10%] lg:min-w-[12%] whitespace-nowrap";
  const styles = ["rounded", bgColor, padding, width].join(" ");

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
      <div
        className="absolute top-0 left-0 w-4 h-full z-20"
        style={{ background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)" }}
      >
      </div>
      <Row styling={{ position: "relative", overflow: "overflow-scroll", gap: "gap-4" }}>
        {accounts.map((account) => (
          <IndividualTab
            key={account.key}
            account={account}
            isSelected={account.key === props.selectedAccount?.key}
          />
        ))}
      </Row>
      <div
        className="absolute top-0 h-full z-20"
        style={{
          right: 0,
          width: "120px",
          background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,1.0) 70%)"
        }}
      >
      </div>
    </Row>
  );
};

export { AccountTabs };
