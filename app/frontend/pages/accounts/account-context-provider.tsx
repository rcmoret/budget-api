import { useContext, createContext } from "react";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { DraggableAttributes } from "@dnd-kit/core";
import { AccountProps } from "@frontend/types/account";
import { useAccountsManagerStore } from "./store";

type AccountManagementContextType = {
  account: AccountProps & { isArchived: boolean };
  dragAttributes: DraggableAttributes;
  dragListeners: SyntheticListenerMap | undefined;
  isFormShown: boolean;
  isNew: boolean;
  showForm: () => void;
};

const AccountManagementContext =
  createContext<AccountManagementContextType | null>(null);

type AccountShowProviderProps = {
  children: React.ReactNode;
  account: AccountProps;
  editPage?: boolean;
  dragAttributes?: DraggableAttributes;
  dragListeners?: SyntheticListenerMap;
};

const AccountShowProvider = (props: AccountShowProviderProps) => {
  const { account, children } = props;
  const { editPage = false } = props;
  const setShowFormKey = useAccountsManagerStore((s) => s.setShowFormKey);
  const showFormKey = useAccountsManagerStore((s) => s.showFormKey);

  const showForm = () => {
    editPage ? () => null : setShowFormKey(account.key);
  };

  const value: AccountManagementContextType = {
    account: {
      ...account,
      isArchived: !!account.archivedAt,
    },
    dragAttributes: props.dragAttributes ?? ({} as DraggableAttributes),
    dragListeners: props.dragListeners,
    isFormShown: editPage || showFormKey === account.key,
    isNew: false,
    showForm,
  };

  return (
    <AccountManagementContext.Provider value={value}>
      {children}
    </AccountManagementContext.Provider>
  );
};

const useAccountShowContext = (): AccountManagementContextType => {
  const context = useContext(AccountManagementContext);

  if (!context) {
    throw new Error(
      "useAccountShowContext must be used within AccountShowProvider",
    );
  }

  return context;
};

export { AccountShowProvider, useAccountShowContext };
