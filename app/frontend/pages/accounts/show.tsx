import { useContext, useEffect } from "react";
import { AppConfigContext } from "@/components/layout/Provider";
import { AccountTabs } from "@/pages/accounts/tabs";

import { AccountSummary, AccountShow } from "@/types/account";
import { Transactions } from "./transactions";

interface ComponentProps {
  accounts: AccountSummary[];
  selectedAccount: AccountShow;
}

const AccountShowComponent = (props: ComponentProps) => {
  const { accounts, selectedAccount } = props;
  const { appConfig, setAppConfig } = useContext(AppConfigContext);

  useEffect(() => {
    setAppConfig({
      ...appConfig,
      budget: {
        ...appConfig.budget,
        data: {
          ...appConfig.budget.data,
          ...selectedAccount.metadata
        }
      },
      accounts: accounts.map(({ key, name }) => ({ key, name })),
      account: {
        ...appConfig.account,
        isCashFlow: selectedAccount.isCashFlow,
        key: selectedAccount.key,
        slug: selectedAccount.slug,
      }
    })
  }, [])

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
