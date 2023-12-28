import { useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Id } from "../../domains/Id/Id";
import { IBlock } from "../../domains/character/types";
import { IDiceCommandId } from "../../domains/dice/Dice";
import { useStorageEntity } from "../../hooks/useStorageEntities/useStorageEntity";

type IThemeMode = "dark" | "light" | undefined;

const storage = typeof window !== "undefined" ? window.localStorage : undefined;

const oldDarkThemeLocalStorageKey = "prefers-dark-mode";
const oldDarkThemeLocalStorageValue =
  storage?.getItem(oldDarkThemeLocalStorageKey) === "true";

export function useSettings() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const systemMode = prefersDarkMode ? "dark" : "light";

  const [temporaryThemeMode, setThemeModeTemporarily] = useState<IThemeMode>();

  const [themeMode, setThemeMode] = useStorageEntity<IThemeMode>({
    defaultValue: oldDarkThemeLocalStorageValue ? "dark" : "light",
    key: "fari-theme",
    localStorage: storage,
  });
  const [userId] = useStorageEntity<string>({
    defaultValue: Id.generate(),
    key: "fari-user-id",
    localStorage: storage,
  });
  const [userName, setUserName] = useStorageEntity<string>({
    defaultValue: "",
    key: "fari-user-name",
    localStorage: storage,
  });
  const [gameTemplate, setGameTemplate] = useStorageEntity<string>({
    defaultValue: "",
    key: "fari-game-template",
    localStorage: storage,
  });
  const [diceCommandIds, setDiceCommandsIds] =
    useStorageEntity<Array<IDiceCommandId> | null>({
      defaultValue: null,
      key: "fari-dice-command-ids",
      localStorage: storage,
    });

  const [blocksInClipboard, setBlocksInClipboard] = useStorageEntity<
    Array<IBlock>
  >({
    defaultValue: [],
    key: "fari-blocks-in-clipboard",
    localStorage: storage,
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
      gameTemplate,
      blocksInClipboard,
    },
    actions: {
      setThemeMode,
      setThemeModeTemporarily,
      setUserName,
      setDiceCommandsIds: setDiceCommandsIds,
      setGameTemplate,
      setBlocksInClipboard,
    },
  };
}

export const SettingsContext = React.createContext<
  ReturnType<typeof useSettings>
>(undefined as any);
