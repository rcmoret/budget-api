import { AccountTabs } from "@/pages/accounts/tabs";
import { Row } from "@/components/common/Row";

import { AccountSummary, AccountShow } from "@/types/account";

interface ComponentProps {
  accounts: AccountSummary[];
  selectedAccount: AccountShow;
}

const AccountShowComponent = (props: ComponentProps) => {
  const { accounts, selectedAccount } = props;

  return (
    <>
      <AccountTabs accounts={accounts} selectedAccount={selectedAccount} />
      <Row
        styling={{
          margin: "p-2 mt-12",
          backgroundColor: "bg-gradient-to-t from-blue-400 to-white",
          flexAlign: "justify-end",
          fontSize: "text-xl",
        }}
      >
        <div className="py-4 underline">Manage Accounts</div>
      </Row>
    </>
  );
};

export default AccountShowComponent;
