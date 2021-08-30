import React, { useState } from "react";
import { IDiceCommandSetId, IRollDiceOptions } from "../../domains/dice/Dice";
import { Id } from "../../domains/Id/Id";
import { useStorageEntity } from "../../hooks/useStorageEntities/useStorageEntity";

type IThemeMode = "dark" | "light";

const oldDarkThemeLocalStorageKey = "prefers-dark-mode";
const oldDarkThemeLocalStorageValue =
  localStorage?.getItem(oldDarkThemeLocalStorageKey) === "true";

export function useSettings() {
  const [temporaryThemeMode, setThemeModeTemporarily] = useState<IThemeMode>();

  const [themeMode, setThemeMode] = useStorageEntity<IThemeMode>({
    defaultValue: oldDarkThemeLocalStorageValue ? "dark" : "light",
    key: "fari-theme",
    localStorage: window.localStorage,
  });
  const [userId] = useStorageEntity<string>({
    defaultValue: Id.generate(),
    key: "fari-user-id",
    localStorage: window.localStorage,
  });
  const [userName, setUserName] = useStorageEntity<string>({
    defaultValue: "",
    key: "fari-user-name",
    localStorage: window.localStorage,
  });
  const [gameTemplate, setGameTemplate] = useStorageEntity<string>({
    defaultValue: "",
    key: "fari-game-template",
    localStorage: window.localStorage,
  });
  const [diceCommandIds, setDiceCommandsIds] =
    useStorageEntity<Array<IDiceCommandSetId> | null>({
      defaultValue: null,
      key: "fari-dice-command-ids",
      localStorage: window.localStorage,
    });
  const [diceOptions, setDiceOptions] = useStorageEntity<IRollDiceOptions>({
    defaultValue: {
      listResults: false,
    },
    key: "fari-dice-command-options",
    localStorage: window.localStorage,
  });

  function toggleThemeMode() {
    setThemeMode(() => {
      return themeMode === "light" ? "dark" : "light";
    });
  }

  const appThemeMode = temporaryThemeMode ?? themeMode;
  return {
    state: {
      themeMode: appThemeMode,
      userId,
      userName,
      diceCommandIds: diceCommandIds,
      diceOptions,
      gameTemplate,
    },
    actions: {
      setThemeMode,
      toggleThemeMode,
      setThemeModeTemporarily,
      setUserName,
      setDiceCommandsIds: setDiceCommandsIds,
      setGameTemplate,
      setDiceOptions,
    },
  };
}

export const SettingsContext = React.createContext<
  ReturnType<typeof useSettings>
>(undefined as any);
