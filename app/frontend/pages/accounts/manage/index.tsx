import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PageComponent, pageHeadingClassName } from "@frontend/layout";
import { AccountProps } from "@frontend/types/account";
import { SortableCard } from "./card/sortable-card";
import {
  useAccountsManagerStore,
  useHasArchivedAccounts,
  useInitAccountsManagerStore,
  useShowNewAccountForm,
} from "./store";
import { ToggleSlider } from "@frontend/components/slider";
import { AccountShowProvider } from "./account-context-provider";
import { AccountCard } from "./card";
import { NewForm } from "./form";
import { PageProps } from "@/types/page_props";

type AccountManageProps = PageProps & {
  accounts: Array<AccountProps>;
};

const ArchivedAccountsComponent = () => {
  const archivedCount = useAccountsManagerStore(
    (s) => s.archivedAccounts.length,
  );
  const showArchivedAccounts = useAccountsManagerStore(
    (s) => s.showArchivedAccounts,
  );
  const toggleArchivedAccounts = useAccountsManagerStore(
    (s) => s.toggleArchivedAccounts,
  );

  const label = showArchivedAccounts
    ? "Showing all archived accounts"
    : `${archivedCount} archived accounts not shown`;

  const buttonTitle = showArchivedAccounts
    ? "hide archived accounts"
    : "show archived accounts";

  return (
    <div>
      <div className="flex flex-row justify-between items-center mt-4 px-8">
        <label htmlFor="toggle-archived-accounts" className="text-sm">
          {label}
        </label>
        <div className="tooltip tooltip-left" data-tip={buttonTitle}>
          <ToggleSlider
            toggleValue={showArchivedAccounts}
            onClick={toggleArchivedAccounts}
            id="toggle-archived-accounts"
          />
        </div>
      </div>
    </div>
  );
};

const AccountsManager = (props: AccountManageProps) => {
  useInitAccountsManagerStore(props.accounts);

  return <Accounts />;
};

const ArchievedAccountsList = () => {
  const archivedAccounts = useAccountsManagerStore((s) => s.archivedAccounts);

  return (
    <div className="mt-8">
      <div className="mb-4">Archived Accounts</div>
      {archivedAccounts.map((account) => (
        <AccountShowProvider key={account.key} account={account}>
          <AccountCard />
        </AccountShowProvider>
      ))}
    </div>
  );
};

const NewFormButton = () => {
  const newAccountKey = useAccountsManagerStore((s) => s.newAccountKey);
  const onDismiss = useAccountsManagerStore((s) => s.onDismiss);
  const setShowFormKey = useAccountsManagerStore((s) => s.setShowFormKey);
  const showNewAccountForm = useShowNewAccountForm();

  const className = ["btn", "btn-sm", "btn-success", "btn-wide"].join(" ");

  if (showNewAccountForm) {
    return (
      <div className="flex justify-end">
        <button
          type="button"
          className={className}
          onClick={onDismiss}
          title="close new account form"
        >
          Close Form
        </button>
      </div>
    );
  } else {
    return (
      <div className="flex justify-end">
        <button
          type="button"
          className={className}
          onClick={() => setShowFormKey(newAccountKey)}
          title="open new account form"
        >
          + New Account
        </button>
      </div>
    );
  }
};

const Header = () => {
  return (
    <>
      <h1 className={pageHeadingClassName}>Manage Accounts</h1>
      <NewFormButton />
    </>
  );
};

const RightColumn = () => {
  const hasArchivedAccounts = useHasArchivedAccounts();

  if (hasArchivedAccounts) {
    return <ArchivedAccountsComponent />;
  } else {
    return <div></div>;
  }
};

const Accounts = () => {
  const activeAccounts = useAccountsManagerStore((s) => s.activeAccounts);
  const handleDragEnd = useAccountsManagerStore((s) => s.handleDragEnd);
  const showArchivedAccounts = useAccountsManagerStore(
    (s) => s.showArchivedAccounts,
  );
  const showNewAccountForm = useShowNewAccountForm();

  return (
    <PageComponent
      mainId="accounts-manage"
      header={<Header />}
      rightColumn={<RightColumn />}
    >
      {showNewAccountForm && <NewForm />}
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext
          items={activeAccounts.map((a) => a.key)}
          strategy={verticalListSortingStrategy}
        >
          {activeAccounts.map((account) => (
            <SortableCard key={account.key} account={account} />
          ))}
        </SortableContext>
      </DndContext>
      {showArchivedAccounts && <ArchievedAccountsList />}
    </PageComponent>
  );
};

export default AccountsManager;
