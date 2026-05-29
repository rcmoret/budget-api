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
  namespace: string;
  budgetMonth: null;
  setNamespace: (namespace: string) => void;
  showAccruals: boolean;
  toggleShowAccruals: () => void;
  theme: Theme;
  toggleTheme: () => void;
};

const useAppConfigStore = create<AppConfigState>((set) => ({
  namespace: "",
  budgetMonth: null,
  setNamespace: (namespace) => set({ namespace }),
  showAccruals: false,
  toggleShowAccruals: () => set((s) => ({ showAccruals: !s.showAccruals })),
  theme: getInitialTheme(),
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

const useInitAppConfigStore = (namespace: string) => {
  const setNamespace = useAppConfigStore((s) => s.setNamespace);
  const theme = useAppConfigStore((s) => s.theme);

  useEffect(() => {
    setNamespace(namespace);
  }, [namespace, setNamespace]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
};

export {
  useAppConfigStore,
  useInitAppConfigStore,
  useIsDarkTheme,
  useNamespace,
  useShowAccruals,
  useTheme,
  useToggleShowAccruals,
  useToggleTheme,
};
