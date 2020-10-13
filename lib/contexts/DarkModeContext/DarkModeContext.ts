import React, { useEffect, useState } from "react";

const key = "prefers-dark-mode";

export function useDarkMode() {
  const prefersDarkThemeFromStorage =
    localStorage?.getItem(key) === "true" ?? false;
  const [darkMode, setDarkMode] = useState(prefersDarkThemeFromStorage);

  useEffect(() => {
    localStorage?.setItem(key, darkMode.toString());
  }, [darkMode]);

  return {
    state: { darkMode },
    actions: { setDarkMode },
  };
}

export const DarkModeContext = React.createContext<
  ReturnType<typeof useDarkMode>
>(undefined as any);
