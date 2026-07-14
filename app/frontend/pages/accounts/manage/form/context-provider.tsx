import { Form } from "@inertiajs/react";
import { useContext, createContext } from "react";
import { useAccountShowContext } from "@/pages/accounts/account-context-provider";
import {
  useAccountsManagerStore,
  useShowNewAccountForm,
} from "@/pages/accounts/store";
import { getRedirectQueryParams } from "@/lib/app-stores/app-config-store";

type AccountFormContextType = {
  isDirty: boolean;
};

const AccountFormContext = createContext<AccountFormContextType | null>(null);

const AccountFormProvider = (props: { children: React.ReactNode }) => {
  const { account } = useAccountShowContext();
  const onDismiss = useAccountsManagerStore((s) => s.onDismiss);
  const resetNewAccountKey = useAccountsManagerStore(
    (s) => s.resetNewAccountKey,
  );
  const showNewAccountForm = useShowNewAccountForm();

  const formMethod = showNewAccountForm ? "post" : "put";

  const baseUrl = showNewAccountForm ? `/account` : `/account/${account.key}`;

  const accountManageReturnQueryParams = getRedirectQueryParams();

  const formUrl = `${baseUrl}?${accountManageReturnQueryParams}`;

  const onSuccess = () => {
    onDismiss();
    if (showNewAccountForm) resetNewAccountKey();
  };

  return (
    <Form action={formUrl} method={formMethod} onSuccess={onSuccess}>
      {({ isDirty }) => (
        <AccountFormContext.Provider value={{ isDirty }}>
          {props.children}
        </AccountFormContext.Provider>
      )}
    </Form>
  );
};

const useAccountFormContext = (): AccountFormContextType => {
  const context = useContext(AccountFormContext);

  if (!context) {
    throw new Error(
      "useAccountFormContext must be used within AccountFormProvider",
    );
  }

  return context;
};

export { AccountFormProvider, useAccountFormContext };
