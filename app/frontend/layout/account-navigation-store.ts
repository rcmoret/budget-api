import { AccountLinkType } from "@/types/page_props";
import { useEffect } from "react";
import { create } from "zustand";

type AccountNavigationState = {
  accounts: Array<AccountLinkType>;
};

const useAccountNavigationStore = create<AccountNavigationState>(() => ({
  accounts: [],
}));

const initNavigationLinks = (accounts: Array<AccountLinkType>) => {
  useEffect(() => {
    useAccountNavigationStore.setState({ accounts });
  }, [accounts]);
};

const getAccountLinks = () => {
  return useAccountNavigationStore((s) => s.accounts);
};

export { getAccountLinks, initNavigationLinks };
