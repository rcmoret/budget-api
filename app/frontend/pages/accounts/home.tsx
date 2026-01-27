import { AccountTabs } from "@/pages/accounts/tabs";
import { AccountSummary } from "@/types/account";

const AccountsHome = (props: { accounts: AccountSummary[] }) => {
  const { accounts } = props;
  return <AccountTabs accounts={accounts} selectedAccount={null} />;
};

export default AccountsHome;
