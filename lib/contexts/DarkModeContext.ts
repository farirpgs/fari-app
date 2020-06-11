import { useMediaQuery } from "@material-ui/core";
import React, { useEffect, useState } from "react";

const key = "prefers-dark-mode";

export function useDarkMode() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const prefersDarkTheme = localStorage.getItem(key) === "true";
  const [darkMode, setDarkMode] = useState(prefersDarkTheme || prefersDarkMode);

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
