import CssBaseline from "@material-ui/core/CssBaseline";
import { StylesProvider, ThemeProvider } from "@material-ui/core/styles";
import * as Sentry from "@sentry/react";
import React, { useContext } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./components/AppRouter/AppRouter";
import { CharactersManager } from "./components/CharactersManager/CharactersManager";
import { ErrorReport } from "./components/ErrorBoundary/ErrorReport";
import { History } from "./components/History/History";
import { ScenesManager } from "./components/ScenesManager/ScenesManager";
import { env } from "./constants/env";
import {
  CharactersContext,
  useCharacters,
} from "./contexts/CharactersContext/CharactersContext";
import {
  DarkModeContext,
  useDarkMode,
} from "./contexts/DarkModeContext/DarkModeContext";
import { DiceContext, useDice } from "./contexts/DiceContext/DiceContext";
import {
  ScenesContext,
  useScenes,
} from "./contexts/SceneContext/ScenesContext";
import { useTranslate } from "./hooks/useTranslate/useTranslate";
import { AppDarkTheme, AppLightTheme } from "./theme";

export const App: React.FC<{}> = () => {
  const darkModeManager = useDarkMode();
  const charactersManager = useCharacters();
  const scenesManager = useScenes();
  const diceManager = useDice();
  return (
    <DndProvider backend={HTML5Backend}>
      <DarkModeContext.Provider value={darkModeManager}>
        <CharactersContext.Provider value={charactersManager}>
          <ScenesContext.Provider value={scenesManager}>
            <DiceContext.Provider value={diceManager}>
              <AppProvider />
            </DiceContext.Provider>
          </ScenesContext.Provider>
        </CharactersContext.Provider>
      </DarkModeContext.Provider>
    </DndProvider>
  );
};
App.displayName = "App";

export const AppProvider: React.FC<{}> = (props) => {
  const store = useContext(DarkModeContext);

  return (
    <ThemeProvider theme={store.state.darkMode ? AppDarkTheme : AppLightTheme}>
      <StylesProvider injectFirst>
        <CssBaseline />
        <Sentry.ErrorBoundary fallback={ErrorReport} showDialog>
          <HelmetProvider>
            <BrowserRouter>
              <Helmet
                htmlAttributes={{
                  "client-build-number": env.buildNumber,
                  "client-hash": env.hash,
                  "client-context": env.context,
                }}
              />
              <History />
              <ScenesManager />
              <CharactersManager />
              <AppRouter />
            </BrowserRouter>
          </HelmetProvider>
        </Sentry.ErrorBoundary>
      </StylesProvider>
    </ThemeProvider>
  );
};
AppProvider.displayName = "AppProvider";

/**
 * for dynamic keys
 */
function useMark() {
  const { t } = useTranslate();

  t("common.language.dev");
  t("common.language.de");
  t("common.language.en");
  t("common.language.es");
  t("common.language.fr");
  t("common.language.gl");
  t("common.language.pt-BR");
  t("common.language.ru");
  t("common.language.it");

  t("oracle.value.No");
  t("oracle.value.NoAnd");
  t("oracle.value.Yes");
  t("oracle.value.YesAnd");
  t("oracle.value.YesBut");

  t("character-dialog.template.FateOfCthulhu");
  t("character-dialog.template.Dnd5e");
  t("character-dialog.template.TheWitchIsDead");
  t("character-dialog.template.Accelerated");
  t("character-dialog.template.CoreCondensed");
  t("character-dialog.template.Blank");
}
