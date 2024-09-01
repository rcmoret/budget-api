import { ReactNode, createContext, useState } from "react";

type TAppConfig = {
  showConfigMenu: boolean;
  account: {
    includeArchived: boolean;
  };
  budget: {
    showAccruals: boolean;
    showClearedMonthly: boolean;
    showDeletedItems: boolean;
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
