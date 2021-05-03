import React, { useEffect, useState } from "react";

const key = "prefers-dark-mode";

export function useDarkMode() {
  const prefersDarkThemeFromStorage =
    localStorage?.getItem(key) === "true" ?? false;
  const [darkMode, setDarkMode] = useState(prefersDarkThemeFromStorage);
  const [temporaryDarkMode, setDarkModeTemporarily] = useState<boolean>();

  useEffect(() => {
    localStorage?.setItem(key, darkMode.toString());
  }, [darkMode]);

  const isDark = temporaryDarkMode ?? darkMode;
  return {
    state: { darkMode: isDark },
    actions: { setDarkMode, setDarkModeTemporarily },
  };
}

export const DarkModeContext = React.createContext<
  ReturnType<typeof useDarkMode>
>(undefined as any);
