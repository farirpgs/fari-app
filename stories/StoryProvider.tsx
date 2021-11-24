import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import {
  CharactersContext,
  useCharacters,
} from "../lib/contexts/CharactersContext/CharactersContext";
import { DiceContext, useDice } from "../lib/contexts/DiceContext/DiceContext";
import { InjectionsContext } from "../lib/contexts/InjectionsContext/InjectionsContext";
import {
  ScenesContext,
  useScenes,
} from "../lib/contexts/SceneContext/ScenesContext";
import {
  SettingsContext,
  useSettings,
} from "../lib/contexts/SettingsContext/SettingsContext";
import { getDefaultInjections } from "../lib/services/injections";
import { AppDarkTheme, AppLightTheme } from "../lib/theme";

const injections = getDefaultInjections();

/**
 * The Fate Font and locales files are served using the `--static-dir` option on the package.json
 * Also see .storybook/preview-head.html
 */
export function StoryProvider(props: {
  children: JSX.Element;
  theme: "light" | "dark";
}) {
  const settingsManager = useSettings();
  const charactersManager = useCharacters();
  const scenesManager = useScenes();
  const diceManager = useDice({
    defaultCommands: settingsManager.state.diceCommandIds,
    defaultOptions: {
      listResults: false,
    },
    onCommandSetsChange(commandSetOptions) {
      const commandSetIds = commandSetOptions.map((l) => l.id);
      settingsManager.actions.setDiceCommandsIds(commandSetIds);
    },
  });

  useEffect(() => {
    settingsManager.actions.setThemeMode(props.theme);
  }, [props.theme]);

  return (
    <React.Suspense fallback={null}>
      <InjectionsContext.Provider value={injections}>
        <DndProvider backend={HTML5Backend}>
          <SettingsContext.Provider value={settingsManager}>
            <CharactersContext.Provider value={charactersManager}>
              <ScenesContext.Provider value={scenesManager}>
                <DiceContext.Provider value={diceManager}>
                  <StyledEngineProvider injectFirst>
                    <ThemeProvider
                      theme={
                        settingsManager.state.themeMode === "dark"
                          ? AppDarkTheme
                          : AppLightTheme
                      }
                    >
                      <CssBaseline />
                      <BrowserRouter>
                        <HelmetProvider>{props.children}</HelmetProvider>
                      </BrowserRouter>
                    </ThemeProvider>
                  </StyledEngineProvider>
                </DiceContext.Provider>
              </ScenesContext.Provider>
            </CharactersContext.Provider>
          </SettingsContext.Provider>
        </DndProvider>
      </InjectionsContext.Provider>
    </React.Suspense>
  );
}
