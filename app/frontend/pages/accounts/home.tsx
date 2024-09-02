import { AccountTabs } from "@/pages/accounts/tabs";
import { AccountSummary } from "@/types/account";
import { Row } from "@/components/common/Row";

const AccountsHome = (props: { accounts: AccountSummary[] }) => {
  console.log({ props })
  const { accounts } = props;
  return (
    <>
      <AccountTabs accounts={accounts} selectedAccount={null} />
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
  )
};

export default AccountsHome;
