import {
  AccountShowProvider,
  useAccountShowContext,
} from "@/pages/accounts/account-context-provider";
import { AccountCard } from "@/pages/accounts/manage/card";
import { AccountProps } from "@/types/account";
import { PageProps } from "@/types/page_props";
import { useInitAccountsManagerStore } from "../store";
import { PageComponent, pageHeadingClassName } from "@/layout";

type AccountEditProps = PageProps & {
  account: AccountProps;
};

const AccountEdit = (props: AccountEditProps) => {
  useInitAccountsManagerStore([props.account]);

  return (
    <AccountShowProvider account={props.account} editPage={true}>
      <AccountEditComponent />;
    </AccountShowProvider>
  );
};

const Header = () => {
  const { account } = useAccountShowContext();

  return (
    <>
      <h1 className={pageHeadingClassName}>Edit {account.name}</h1>
    </>
  );
};

const AccountEditComponent = () => {
  return (
    <PageComponent mainId="account-edit" header={<Header />} rightColumn={null}>
      <AccountCard />
    </PageComponent>
  );
};

export default AccountEdit;
