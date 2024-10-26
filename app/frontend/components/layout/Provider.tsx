import { ReactNode, createContext, useState } from "react";
import { BudgetData } from "@/types/budget";

type TAppConfig = {
  showConfigMenu: boolean;
  account: {
    includeArchived: boolean;
  };
  budget: {
    showAccruals: boolean;
    showClearedMonthly: boolean;
    showDeletedItems: boolean;
    data: BudgetData;
    multiItemForm: {
      display: boolean;
      items: string[];
    };
  };
}

const initialConfig: TAppConfig = {
  showConfigMenu: false,
  account: {
    includeArchived: false,
  },
  budget: {
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
      isSetUp: false
    },
    multiItemForm: {
      display: false,
      items: [],
    },
  },
}

const AppConfigContext = createContext({
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
