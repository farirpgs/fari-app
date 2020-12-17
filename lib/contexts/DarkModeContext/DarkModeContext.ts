import React, { useEffect, useState } from "react";

const key = "prefers-dark-mode";

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    return false;
  });

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
