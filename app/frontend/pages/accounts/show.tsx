import { AccountTabs } from "@/pages/accounts/tabs";

import { AccountSummary, AccountShow } from "@/types/account";

interface ComponentProps {
  accounts: AccountSummary[];
  selectedAccount: AccountShow;
}

const AccountShowComponent = (props: ComponentProps) => {
  const { accounts, selectedAccount } = props;

  return (
    <AccountTabs accounts={accounts} selectedAccount={selectedAccount} />
  );
};

export default AccountShowComponent;
