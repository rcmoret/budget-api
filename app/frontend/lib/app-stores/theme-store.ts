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

type ThemeState = {
  theme: Theme;
  toggleTheme: () => void;
};

const useThemeStore = create<ThemeState>((set) => ({
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

const useTheme = () => useThemeStore((s) => s.theme);
const useToggleTheme = () => useThemeStore((s) => s.toggleTheme);
const useIsDarkTheme = () => useThemeStore((s) => s.theme === DARK_THEME);

// Reconcile the DOM with the stored/preferred theme on mount; the server
// renders a fixed data-theme, and toggleTheme handles subsequent changes.
const useInitTheme = () => {
  useEffect(() => {
    applyTheme(useThemeStore.getState().theme);
  }, []);
};

export {
  useInitTheme,
  useIsDarkTheme,
  useTheme,
  useThemeStore,
  useToggleTheme,
};
