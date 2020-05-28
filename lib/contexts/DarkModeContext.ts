import { useMediaQuery } from "@material-ui/core";
import React, { useState } from "react";

export function useDarkMode() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  return {
    state: { darkMode },
    actions: { setDarkMode },
  };
}

export const DarkModeContext = React.createContext<
  ReturnType<typeof useDarkMode>
>(undefined);
