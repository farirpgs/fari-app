import produce from "immer";
import React, { useState } from "react";
import { Id } from "../../domains/Id/Id";
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
  const [userId] = useStorageEntity<string>({
    defaulValue: Id.generate(),
    key: "fari-user-id",
    localStorage: window.localStorage,
  });
  const [userName, setUserName] = useStorageEntity<string>({
    defaulValue: Id.generate(),
    key: "fari-user-name",
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
    state: { themeMode, userId, userName },
    actions: {
      setThemeMode,
      toggleThemeMode,
      setThemeModeTemporarily,
      setUserName,
    },
  };
}

export const SettingsContext = React.createContext<
  ReturnType<typeof useSettings>
>(undefined as any);
