import CssBaseline from "@material-ui/core/CssBaseline";
import { StylesProvider, ThemeProvider } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import {
  CharactersContext,
  useCharacters,
} from "../lib/contexts/CharactersContext/CharactersContext";
import {
  DarkModeContext,
  useDarkMode,
} from "../lib/contexts/DarkModeContext/DarkModeContext";
import { DiceContext, useDice } from "../lib/contexts/DiceContext/DiceContext";
import {
  ScenesContext,
  useScenes,
} from "../lib/contexts/SceneContext/ScenesContext";
import { AppDarkTheme, AppLightTheme } from "../lib/theme";

/**
 * The Fate Font is served using the `-s` option on the package.json
 * Also see .storybook/preview-head.html
 */
export function StoryProvider(props: {
  children: JSX.Element;
  theme: "light" | "dark";
}) {
  const darkModeManager = useDarkMode();
  const charactersManager = useCharacters();
  const scenesManager = useScenes();
  const diceManager = useDice();

  useEffect(() => {
    if (props.theme === "dark") {
      darkModeManager.actions.setDarkMode(true);
    } else {
      darkModeManager.actions.setDarkMode(false);
    }
  }, [props.theme]);

  return (
    <DarkModeContext.Provider value={darkModeManager}>
      <CharactersContext.Provider value={charactersManager}>
        <ScenesContext.Provider value={scenesManager}>
          <DiceContext.Provider value={diceManager}>
            <ThemeProvider
              theme={
                darkModeManager.state.darkMode ? AppDarkTheme : AppLightTheme
              }
            >
              <StylesProvider injectFirst>
                <BrowserRouter>
                  <CssBaseline />
                  <HelmetProvider>{props.children}</HelmetProvider>
                </BrowserRouter>
              </StylesProvider>
            </ThemeProvider>
          </DiceContext.Provider>
        </ScenesContext.Provider>
      </CharactersContext.Provider>
    </DarkModeContext.Provider>
  );
}
