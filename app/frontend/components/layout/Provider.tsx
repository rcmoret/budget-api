import { ReactNode, createContext, useState } from "react";
import { BudgetData, SelectBudgetCategory, DiscretionaryData } from "@/types/budget";

type TAppConfig = {
  showConfigMenu: boolean;
  accounts: Array<{
    key: string;
    name: string;
  }>;
  account: {
    isCashFlow: boolean;
    includeArchived: boolean;
    key: string;
    showTransferForm: boolean;
    slug: string;
  };
  budget: {
    showAccruals: boolean;
    showClearedMonthly: boolean;
    showDeletedItems: boolean;
    categories: SelectBudgetCategory[];
    data: BudgetData;
    discretionary: DiscretionaryData;
  };
}

const initialConfig: TAppConfig = {
  showConfigMenu: false,
  account: {
    isCashFlow: false,
    includeArchived: false,
    key: "",
    showTransferForm: false,
    slug: "",
  },
  accounts: [],
  budget: {
    categories: [],
    showAccruals: false,
    showDeletedItems: false,
    showClearedMonthly: false,
    data: {
      isCurrent: false,
      totalDays: 0,
      firstDate: "2000-01-01",
      lastDate: "2099-12-31",
      daysRemaining: 0,
      month: 1,
      year: 2000,
      isClosedOut: false,
      isSetUp: false,
      items: []
    },
    discretionary: {
      amount: 0,
      overUnderBudget: 0,
      transactionsTotal: 0,
      transactionDetails: []
    }
  },
}

type TConfigContext = {
  appConfig: TAppConfig;
  setAppConfig: (props: TAppConfig) => void;
}

const AppConfigContext = createContext<TConfigContext>({
  appConfig: initialConfig,
  setAppConfig: (props: TAppConfig): TAppConfig => { return props },
})

const Provider = ({ children }: { children: ReactNode }) => {
  const [appConfig, setAppConfig] = useState<TAppConfig>(initialConfig)

  return (
    <AppConfigContext.Provider value={{ appConfig, setAppConfig }}>
      {children}
    </AppConfigContext.Provider>
  )
}

export { AppConfigContext, Provider, TAppConfig }
