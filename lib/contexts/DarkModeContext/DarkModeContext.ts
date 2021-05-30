import produce from "immer";
import React, { useState } from "react";
import { useStorageEntity } from "../../hooks/useStorageEntities/useStorageEntity";

type IThemeMode = "dark" | "light";

type ISettings = {
  themeMode: IThemeMode;
};

const oldDarkThemeLocalStorageKey = "prefers-dark-mode";
const oldDarkThemeLocalStorageValue =
  localStorage?.getItem(oldDarkThemeLocalStorageKey) === "true";

export function useSettings() {
  const [temporaryThemeMode, setThemeModeTemporarily] = useState<IThemeMode>();

  const [settings, setSettings] = useStorageEntity<ISettings>({
    defaulValue: {
      themeMode: oldDarkThemeLocalStorageValue ? "dark" : "light",
    },
    key: "fari-settings",
    localStorage: window.localStorage,
  });

  function setThemeMode(mode: IThemeMode) {
    setSettings(
      produce((draft: ISettings) => {
        draft.themeMode = mode;
      })
    );
  }

  function toggleThemeMode() {
    setSettings(
      produce((draft: ISettings) => {
        draft.themeMode = draft.themeMode === "light" ? "dark" : "light";
      })
    );
  }

  const themeMode = temporaryThemeMode ?? settings.themeMode;
  return {
    state: { themeMode },
    actions: { setThemeMode, toggleThemeMode, setThemeModeTemporarily },
  };
}

export const SettingsContext = React.createContext<
  ReturnType<typeof useSettings>
>(undefined as any);
