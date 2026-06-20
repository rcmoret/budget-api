import { PageComponent, pageHeadingClassName } from "@frontend/layout";
import { AccountProps } from "@frontend/types/account";

type AccountIndexProps = {
  accounts: Array<AccountProps>;
  metadata: {
    namespace: string;
    pageName: string;
  };
};

const Header = () => {
  return (
    <div className="flex flex-row justify-between items-center p-4 border-b border-seconary">
      <h1 className={pageHeadingClassName}>Accounts</h1>
    </div>
  );
};

const Accounts = (props: AccountIndexProps) => {
  const { accounts, metadata } = props;

  return (
    <PageComponent
      mainId="manage-accounts"
      metadata={metadata}
      header={<Header />}
      rightColumn={null}
    >
      <div className="px-8 py-4">
        {accounts.map((a) => (
          <div key={a.key}>{a.name}</div>
        ))}
      </div>
    </PageComponent>
  );
};

export default Accounts;
