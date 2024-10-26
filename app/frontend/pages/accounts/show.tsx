import { AccountTabs } from "@/pages/accounts/tabs";

import { AccountSummary, AccountShow } from "@/types/account";
import { Transactions } from "./transactions";

interface ComponentProps {
  accounts: AccountSummary[];
  selectedAccount: AccountShow;
}

const AccountShowComponent = (props: ComponentProps) => {
  console.log({ props })
  const { accounts, selectedAccount } = props;

  return (
    <>
      <AccountTabs accounts={accounts} selectedAccount={selectedAccount} />
      <Transactions
        initialBalance={selectedAccount.balancePriorTo}
        budget={selectedAccount.metadata}
        transactions={selectedAccount.transactions}
      />
    </>
  );
};

export default AccountShowComponent;
