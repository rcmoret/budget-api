import { AppRoutesType, Metadata, RouteName } from "@/types/page_props";
import { useEffect } from "react";
import { create } from "zustand";

const LIGHT_THEME = "merrimack";
const DARK_THEME = "merrimack-dark";
const THEME_STORAGE_KEY = "app-theme";

type Theme = typeof LIGHT_THEME | typeof DARK_THEME;

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return LIGHT_THEME;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === LIGHT_THEME || stored === DARK_THEME) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? DARK_THEME
    : LIGHT_THEME;
};

const applyTheme = (theme: Theme) => {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
  }
};

type AppConfigState = {
  appRoutes: AppRoutesType;
  budgetEventsRoute: string;
  budgetMonth: null;
  namespace: string;
  pageName: null | string;
  redirectSegments: Array<string>;
  setBudgetEventsRoute: (r: string) => void;
  setNamespace: (namespace: string) => void;
  setPageName: (p: string) => void;
  setAppRoutesStore: (routes: AppRoutesType) => void;
  setRedirectSegments: (segments: Array<string>) => void;
  showAccruals: boolean;
  theme: Theme;
  toggleShowAccruals: () => void;
  toggleTheme: () => void;
};

const useAppConfigStore = create<AppConfigState>((set) => ({
  namespace: "",
  budgetEventsRoute: "",
  budgetMonth: null,
  pageName: null,
  appRoutes: {
    accountMenuRoute: "",
    budgetDashboardRoute: "",
    createBudgetEventsRoute: "",
    currentRoute: "",
    manageAccountsRoute: "",
    manageBudgetCategoriesRoute: "",
    userSignOutRoute: "",
  },
  redirectSegments: [],
  setNamespace: (namespace) => set({ namespace }),
  setAppRoutesStore: (appRoutes: AppRoutesType) => set({ appRoutes }),
  showAccruals: false,
  toggleShowAccruals: () => set((s) => ({ showAccruals: !s.showAccruals })),
  theme: getInitialTheme(),
  setBudgetEventsRoute: (route: string) => set({ budgetEventsRoute: route }),
  setPageName: (pageName: string) => set({ pageName }),
  setRedirectSegments: (redirectSegments: Array<string>) =>
    set({ redirectSegments }),
  toggleTheme: () =>
    set((s) => {
      const next: Theme = s.theme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
      applyTheme(next);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      }
      return { theme: next };
    }),
}));

const useNamespace = () => useAppConfigStore((s) => s.namespace);
const useShowAccruals = () => useAppConfigStore((s) => s.showAccruals);
const useToggleShowAccruals = () =>
  useAppConfigStore((s) => s.toggleShowAccruals);
const useTheme = () => useAppConfigStore((s) => s.theme);
const useToggleTheme = () => useAppConfigStore((s) => s.toggleTheme);
const useIsDarkTheme = () => useAppConfigStore((s) => s.theme === DARK_THEME);
const getRedirectQueryParams = () => {
  const redirectSegments = useAppConfigStore((s) => s.redirectSegments);

  return redirectSegments
    .map((segment) => {
      return ["redirect[segments][]", segment]
        .map((str) => encodeURIComponent(str))
        .join("=");
    })
    .join("&");
};

const getBudgetEventsRoute = () =>
  useAppConfigStore((s) => s.budgetEventsRoute);
const useAppRoutes = (routeName: RouteName) =>
  useAppConfigStore((s) => s.appRoutes[routeName]);

const useInitAppConfigStore = (props: {
  appRoutes: AppRoutesType;
  metadata: Metadata;
  redirectSegments: Array<string>;
}) => {
  const setNamespace = useAppConfigStore((s) => s.setNamespace);
  const setPageName = useAppConfigStore((s) => s.setPageName);
  const setRedirectSegments = useAppConfigStore((s) => s.setRedirectSegments);
  const setBudgetEventsRoute = useAppConfigStore((s) => s.setBudgetEventsRoute);
  const setAppRoutesStore = useAppConfigStore((s) => s.setAppRoutesStore);
  const theme = useAppConfigStore((s) => s.theme);
  const { budgetEventsRoute, namespace, pageName } = props.metadata;
  const { appRoutes } = props;

  useEffect(() => {
    setNamespace(namespace);
  }, [namespace, setNamespace]);

  useEffect(() => {
    setPageName(pageName);
  }, [pageName, setPageName]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    setRedirectSegments(props.redirectSegments);
  }, [props.redirectSegments, setRedirectSegments]);

  useEffect(() => {
    setAppRoutesStore(appRoutes);
  }, [appRoutes, setAppRoutesStore]);

  useEffect(() => {
    setBudgetEventsRoute(budgetEventsRoute);
  }, [budgetEventsRoute, setBudgetEventsRoute]);
};

export {
  getBudgetEventsRoute,
  getRedirectQueryParams,
  useAppConfigStore,
  useAppRoutes,
  useInitAppConfigStore,
  useIsDarkTheme,
  useNamespace,
  useShowAccruals,
  useTheme,
  useToggleShowAccruals,
  useToggleTheme,
};
