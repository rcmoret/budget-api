import { ReactNode, useContext, createContext } from "react";
import { BudgetData, SelectBudgetCategory, DiscretionaryData } from "@/types/budget";
import { AccountSummary } from "@/types/account";
import { useToggle } from "@/lib/hooks/useToogle";

type TAppConfigBudget = {
  categories: SelectBudgetCategory[];
  data: BudgetData;
  discretionary: DiscretionaryData;
}

type TAppConfig = {
  metadata: {
    namespace: "budget" | "accounts";
    page: {
      name: string; // we could probably enumerate these /shrug/
    }
  };
  accounts: Array<AccountSummary>;
  account: AccountSummary & {
    isCashFlow: boolean;
    includeArchived: boolean;
    showTransferForm: boolean;
  };
  budget: TAppConfigBudget;
}

type TConfigContext = {
  appConfig: TAppConfig;
  setAccount: (props: {
    key?: string;
    isCashFlow?: boolean;
    slug?: string;
  }) => void;
  setAccounts: (a: Array<AccountSummary>) => void;
  setAppConfig: (props: TAppConfig) => void;
  setBudgetConfig: (props: {
    data?: BudgetData, 
    discretionary?: DiscretionaryData,
    categories?: Array<SelectBudgetCategory>
  }) => void;
  toggles: {
    showAccruals: boolean;
    toggleAccruals: () => void;
    showClearedMonthly: boolean;
    toggleClearedMonthly: () => void;
    showOptionsMenu: boolean;
    toggleOptionsMenu: () => void;
    showDeletedItems: boolean;
    toggleDeletedItems: () => void;
    showTransferForm: boolean;
    toggleTransferForm: () => void;
  }
}

const AppConfigContext = createContext<TConfigContext | null>(null)

const Provider = (props: {
  appConfig: TAppConfig;
  setAppConfig: (props: TAppConfig) => void;
  children: ReactNode }) => {
  const { children, ...context } = props
  const { appConfig, setAppConfig } = context

  const [ showAccruals, toggleAccruals ] = useToggle(false)
  const [ showClearedMonthly, toggleClearedMonthly] = useToggle(false)
  const [ showDeletedItems, toggleDeletedItems ] = useToggle(false)
  const [ showTransferForm, toggleTransferForm ] = useToggle(false)
  const [ showOptionsMenu, toggleOptionsMenu ] = useToggle(false)

  const value = {
    ...context,
    setAccount: (props: {
      key?: string;
      isCashFlow?: boolean;
      slug?: string;
    }) => {
      setAppConfig({
        ...appConfig,
        account: {
          ...appConfig.account,
          ...props
        }
      })
    },
    setAccounts: (accounts: Array<AccountSummary>) => {
      setAppConfig({
        ...appConfig,
        accounts
      })
    },
    setBudgetConfig: (props: {
      data?: BudgetData; 
      discretionary?: DiscretionaryData;
      categories?: Array<SelectBudgetCategory>;
    }) => {
      setAppConfig({
        ...appConfig,
        budget: {
          ...appConfig.budget,
          ...props,
        }
      })
    },
    toggles: {
      showAccruals,
      toggleAccruals,
      showClearedMonthly,
      toggleClearedMonthly,
      showDeletedItems,
      toggleDeletedItems,
      showOptionsMenu,
      toggleOptionsMenu,
      showTransferForm,
      toggleTransferForm
    }
  }

  return (
    <AppConfigContext.Provider value={value}>
      {children}
    </AppConfigContext.Provider>
  )
}

const useAppConfigContext = () => {
  const context = useContext(AppConfigContext);
  if (!context) {
    throw new Error("useAppConfigContext must be used within a Budget Dashboard Item Context Provider")
  }

  return context;
}

export { useAppConfigContext, AppConfigContext, Provider, TAppConfig }
