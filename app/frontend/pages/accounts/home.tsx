import { AccountTabs } from "@/pages/accounts/tabs";
import { AccountSummary } from "@/types/account";
import { Row } from "@/components/common/Row";

const AccountsHome = (props: { accounts: AccountSummary[] }) => {
  console.log({ props })
  const { accounts } = props;
  return (
    <AccountTabs accounts={accounts} selectedAccount={null} />
  )
};

export default AccountsHome;
