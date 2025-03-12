import { createContext, useContext, useEffect, useState } from "react";

// Create theme context
const ThemeContext = createContext({
  theme: "light",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTheme: (theme) => null,
});

export function ThemeProvider({ children, defaultTheme = "system", ...props }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove old theme class
    root.classList.remove("light", "dark");

    // Add new theme class
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      localStorage.setItem("theme", theme);
    } else {
      root.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }} {...props}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);
