import { useEffect } from "react";
import { create } from "zustand";
import { router } from "@inertiajs/react";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { AccountProps } from "@frontend/types/account";
import { generateKeyIdentifier } from "@frontend/utils/KeyIdentifier";
import { appClient } from "@frontend/utils/app-client";

type LocalAccountType = AccountProps & { isArchived: boolean };

type AccountsManagerState = {
  activeAccounts: Array<LocalAccountType>;
  archivedAccounts: Array<LocalAccountType>;
  newAccountKey: string;
  showArchivedAccounts: boolean;
  showFormKey: string | null;

  handleDragEnd: (e: DragEndEvent) => Promise<void>;
  onDismiss: () => void;
  resetNewAccountKey: () => void;
  setAccounts: (accounts: Array<AccountProps>) => void;
  setShowFormKey: (key: string | null) => void;
  toggleArchivedAccounts: () => void;
};

const partitionAccounts = (accounts: Array<AccountProps>) => {
  const active: Array<LocalAccountType> = [];
  const archived: Array<LocalAccountType> = [];
  for (const account of accounts) {
    if (account.archivedAt) {
      archived.push({ ...account, isArchived: true });
    } else {
      active.push({ ...account, isArchived: false });
    }
  }
  return { active, archived };
};

const useAccountsManagerStore = create<AccountsManagerState>((set, get) => ({
  activeAccounts: [],
  archivedAccounts: [],
  newAccountKey: generateKeyIdentifier(),
  showArchivedAccounts: false,
  showFormKey: null,

  handleDragEnd: async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const current = get().activeAccounts;
    const oldIndex = current.findIndex((a) => a.key === active.id);
    const newIndex = current.findIndex((a) => a.key === over.id);
    const reordered = arrayMove(current, oldIndex, newIndex);
    set({ activeAccounts: reordered });

    await Promise.all(
      reordered.map((account, index) => {
        const body = { account: { priority: index + 1 } };
        if (account.priority !== body.account.priority) {
          return appClient.put(`/account/${account.key}`, { body });
        }
      }),
    );

    router.reload();
  },
  onDismiss: () => set({ showFormKey: null }),
  resetNewAccountKey: () => set({ newAccountKey: generateKeyIdentifier() }),
  setAccounts: (accounts) => {
    const { active, archived } = partitionAccounts(accounts);
    set({ activeAccounts: active, archivedAccounts: archived });
  },
  setShowFormKey: (showFormKey) => set({ showFormKey }),
  toggleArchivedAccounts: () =>
    set((s) => ({ showArchivedAccounts: !s.showArchivedAccounts })),
}));

const useHasArchivedAccounts = () =>
  useAccountsManagerStore((s) => s.archivedAccounts.length > 0);

const useShowNewAccountForm = () =>
  useAccountsManagerStore((s) => s.showFormKey === s.newAccountKey);

const useInitAccountsManagerStore = (accounts: Array<AccountProps>) => {
  const setAccounts = useAccountsManagerStore((s) => s.setAccounts);
  const onDismiss = useAccountsManagerStore((s) => s.onDismiss);

  useEffect(() => {
    setAccounts(accounts);
  }, [accounts, setAccounts]);

  useEffect(() => {
    useAccountsManagerStore.setState({
      newAccountKey: generateKeyIdentifier(),
      showArchivedAccounts: false,
      showFormKey: null,
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onDismiss]);
};

export {
  useAccountsManagerStore,
  useHasArchivedAccounts,
  useInitAccountsManagerStore,
  useShowNewAccountForm,
};
