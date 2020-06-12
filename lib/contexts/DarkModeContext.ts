import { useMediaQuery } from "@material-ui/core";
import React, { useEffect, useState } from "react";

const key = "prefers-dark-mode";

export function useDarkMode() {
  const prefersDarkModeFromBrowser = useMediaQuery(
    "(prefers-color-scheme: dark)"
  );
  const prefersDarkThemeFromStorage = localStorage.getItem(key) === "true";
  const defaultValue =
    prefersDarkThemeFromStorage || prefersDarkModeFromBrowser;
  const [darkMode, setDarkMode] = useState(defaultValue);

  useEffect(() => {
    localStorage.setItem(key, darkMode.toString());
  }, [darkMode]);

  return {
    state: { darkMode },
    actions: { setDarkMode },
  };
}

export const DarkModeContext = React.createContext<
  ReturnType<typeof useDarkMode>
>(undefined);
