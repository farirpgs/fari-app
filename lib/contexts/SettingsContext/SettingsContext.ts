import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect, useState } from "react";
import { IBlock } from "../../domains/character/types";
import { IDiceCommandSetId, IRollDiceOptions } from "../../domains/dice/Dice";
import { Id } from "../../domains/Id/Id";
import { useStorageEntity } from "../../hooks/useStorageEntities/useStorageEntity";

type IThemeMode = "dark" | "light" | undefined;

const oldDarkThemeLocalStorageKey = "prefers-dark-mode";
const oldDarkThemeLocalStorageValue =
  localStorage?.getItem(oldDarkThemeLocalStorageKey) === "true";

export function useSettings() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const systemMode = prefersDarkMode ? "dark" : "light";

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
  const [blocksInClipboard, setBlocksInClipboard] = useStorageEntity<
    Array<IBlock>
  >({
    defaultValue: [],
    key: "fari-blocks-in-clipboard",
    localStorage: window.localStorage,
  });

  useEffect(() => {
    setBlocksInClipboard([]);
  }, []);

  const appThemeMode = temporaryThemeMode ?? themeMode ?? systemMode;

  return {
    computed: {
      hasBlocksInClipboard: blocksInClipboard?.length > 0,
    },
    state: {
      themeMode: appThemeMode,
      userId,
      userName,
      diceCommandIds: diceCommandIds,
      diceOptions,
      gameTemplate,
      blocksInClipboard,
    },
    actions: {
      setThemeMode,
      setThemeModeTemporarily,
      setUserName,
      setDiceCommandsIds: setDiceCommandsIds,
      setGameTemplate,
      setDiceOptions,
      setBlocksInClipboard,
    },
  };
}

export const SettingsContext = React.createContext<
  ReturnType<typeof useSettings>
>(undefined as any);
