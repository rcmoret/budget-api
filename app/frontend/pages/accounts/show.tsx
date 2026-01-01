import { useEffect } from "react";
import { useAppConfigContext } from "@/components/layout/Provider";
import { AccountTabs } from "@/pages/accounts/tabs";

import { AccountSummary, AccountShow } from "@/types/account";
import { Transactions } from "./transactions";

interface ComponentProps {
  accounts: AccountSummary[];
  selectedAccount: AccountShow;
}

const AccountShowComponent = (props: ComponentProps) => {
  const { selectedAccount } = props;
  const { appConfig, setAccount, setAccounts, setBudgetConfig } = useAppConfigContext();
  const { items } = selectedAccount.metadata
  const accounts = props.accounts.filter((a) => !a.isArchived)

  useEffect(() => {
    setAccounts(accounts)

    setBudgetConfig({
      data: {
        ...appConfig.budget.data,
        ...selectedAccount.metadata,
        items,
      }
    })

    setAccount({
      isCashFlow: selectedAccount.isCashFlow,
      key: selectedAccount.key,
      slug: selectedAccount.slug,
    })
  }, [items, selectedAccount.key])

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
