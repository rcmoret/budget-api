import { AccountLinkType } from "@/types/page_props";
import { useEffect } from "react";
import { create } from "zustand";

type AccountNavigationState = {
  accounts: Array<AccountLinkType>;
  setAccounts: (accounts: Array<AccountLinkType>) => void;
};

const useAccountNavigationStore = create<AccountNavigationState>((set) => ({
  accounts: [],
  setAccounts: (accounts) => set({ accounts }),
}));

const initNavigationLinks = (accounts: Array<AccountLinkType>) => {
  const setAccounts = useAccountNavigationStore((s) => s.setAccounts);

  useEffect(() => {
    setAccounts(accounts);
  }, [accounts, setAccounts]);
};

const getAccountLinks = () => {
  return useAccountNavigationStore((s) => s.accounts);
};

export { getAccountLinks, initNavigationLinks };
