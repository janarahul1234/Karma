import { createContext, useContext, useEffect } from "react";

import useThemeStore from "@/stores/themeStore";
import { Theme } from "@/constants";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const body = document.querySelector("body");
    body.classList.toggle("dark", theme === Theme.DARK);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }

  return context;
}
