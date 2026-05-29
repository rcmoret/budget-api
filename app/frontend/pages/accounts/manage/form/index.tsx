import { AccountProps } from "@frontend/types/account";
import {
  AccountShowProvider,
  useAccountShowContext,
} from "../account-context-provider";
import { AccountFormProvider, useAccountFormContext } from "./context-provider";
import { useAccountsManagerStore, useShowNewAccountForm } from "../store";
import { AccountCard } from "../card";
import { CardRow } from "@/layout/card";
import { RadioInput } from "@/components/radio";

const NewForm = () => {
  const newAccountKey = useAccountsManagerStore((s) => s.newAccountKey);
  const account: AccountProps = {
    key: newAccountKey,
    objectKey: "",
    name: "",
    slug: "",
    isCashFlow: true,
    balance: 0,
    archivedAt: null,
    priority: null,
  };

  return (
    <AccountShowProvider account={account}>
      <AccountCard />
    </AccountShowProvider>
  );
};

const FormWrapper = () => {
  return (
    <AccountFormProvider>
      <Form />
    </AccountFormProvider>
  );
};

const inputClassName = ["input", "input-sm"].join(" ");

const NameInput = () => {
  const { account } = useAccountShowContext();

  const inputid = `name-${account.key}`;

  return (
    <CardRow>
      <label htmlFor={inputid}>Name</label>
      <div>
        <input
          className={inputClassName}
          id={inputid}
          type="text"
          defaultValue={account.name}
          name="account.name"
        />
      </div>
    </CardRow>
  );
};

const SlugInput = () => {
  const { account } = useAccountShowContext();

  const inputid = `slug-${account.key}`;

  return (
    <CardRow>
      <label htmlFor={inputid}>Slug</label>
      <div>
        <input
          className={inputClassName}
          id={inputid}
          type="text"
          name="account.slug"
          defaultValue={account.slug}
        />
      </div>
    </CardRow>
  );
};

const NewAccountKeyInput = () => {
  const { account } = useAccountShowContext();
  return <input type="hidden" name="account.key" value={account.key} />;
};

const AccountTypeComponent = () => {
  const { account } = useAccountShowContext();

  return (
    <div className="grid gap-2">
      <label className="text-xs">Account Type</label>
      <RadioInput
        name="account.cash_flow"
        defaultChecked={account.isCashFlow}
        value="true"
      >
        Cash Flow
      </RadioInput>
      <RadioInput
        name="account.cash_flow"
        defaultChecked={!account.isCashFlow}
        value="false"
      >
        Budget Exclusion
      </RadioInput>
    </div>
  );
};

const Form = () => {
  const showNewAccountForm = useShowNewAccountForm();
  const { isDirty } = useAccountFormContext();

  const label = showNewAccountForm ? "Create" : "Update";

  return (
    <div className="grid gap-2">
      {showNewAccountForm && <NewAccountKeyInput />}
      <NameInput />
      <SlugInput />
      <AccountTypeComponent />
      <CardRow>
        <button
          type="submit"
          className="btn btn-success btn-wide"
          disabled={!isDirty}
        >
          {label}
        </button>
      </CardRow>
    </div>
  );
};

export { FormWrapper as Form, NewForm };
