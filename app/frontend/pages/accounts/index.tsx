// import { Link } from "@inertiajs/react";
import { MainComponent, pageHeadingClassName } from "@frontend/layout";
import { AccountProps } from "@frontend/types/account";

type AccountIndexProps = {
  accounts: Array<AccountProps>;
  metadata: {
    namespace: string;
  };
};

const Header = () => {
  return (
    <div className="flex flex-row justify-between items-center p-4 border-b border-base-200">
      <h1 className={pageHeadingClassName}>Accounts</h1>
    </div>
  );
};

const Accounts = (props: AccountIndexProps) => {
  const { accounts, metadata } = props;

  return (
    <MainComponent
      namespace={metadata.namespace}
      header={<Header />}
      rightColumn={null}
    >
      <div className="px-8 py-4">
        {accounts.map((a) => (
          <div key={a.key}>{a.name}</div>
        ))}
      </div>
    </MainComponent>
  );
};

export default Accounts;
