import { useEffect } from "react";
import { create } from "zustand";

const LIGHT_THEME = "merrimack";
const DARK_THEME = "merrimack-dark";
const THEME_STORAGE_KEY = "app-theme";

type Theme = typeof LIGHT_THEME | typeof DARK_THEME;
type ThemePreference = "system" | "light" | "dark";

const systemTheme = (): Theme =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? DARK_THEME
    : LIGHT_THEME;

const resolvePreference = (preference: ThemePreference): Theme => {
  if (preference === "light") return LIGHT_THEME;
  if (preference === "dark") return DARK_THEME;
  return systemTheme();
};

// sessionStorage, not localStorage: an override set by toggleTheme should
// only live for the tab/window it was set in. A new tab/window has none, so
// it falls back to the user's saved theme preference (see useInitTheme) —
// that's what makes the preference a "new session" default rather than
// something that fights the in-session toggle.
const storedTheme = (): null | Theme => {
  if (typeof window === "undefined") return null;
  const stored = window.sessionStorage.getItem(THEME_STORAGE_KEY);
  return stored === LIGHT_THEME || stored === DARK_THEME ? stored : null;
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return LIGHT_THEME;
  // The saved preference isn't available yet at module load — it arrives
  // with page props once Inertia mounts. This is just the best guess to
  // paint with in the meantime; useInitTheme reconciles it below.
  return storedTheme() ?? systemTheme();
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
        window.sessionStorage.setItem(THEME_STORAGE_KEY, next);
      }
      return { theme: next };
    }),
}));

const useTheme = () => useThemeStore((s) => s.theme);
const useToggleTheme = () => useThemeStore((s) => s.toggleTheme);
const useIsDarkTheme = () => useThemeStore((s) => s.theme === DARK_THEME);

// Reconciles the DOM (and store) once the user's saved theme preference is
// available from page props. A per-tab override already set this session by
// toggleTheme always wins; a brand new session (new tab/window) has none, so
// it falls back to the saved preference (system/light/dark).
const useInitTheme = (themePreference: ThemePreference) => {
  useEffect(() => {
    const theme = storedTheme() ?? resolvePreference(themePreference);
    applyTheme(theme);
    useThemeStore.setState({ theme });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themePreference]);
};

export {
  useInitTheme,
  useIsDarkTheme,
  useTheme,
  useThemeStore,
  useToggleTheme,
  type ThemePreference,
};
