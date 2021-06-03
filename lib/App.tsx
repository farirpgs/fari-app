import CssBaseline from "@material-ui/core/CssBaseline";
import { StylesProvider, ThemeProvider } from "@material-ui/core/styles";
import * as Sentry from "@sentry/react";
import React, { ReactNode, useContext } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { AppAnalytics } from "./components/AppAnalytics/AppAnalytics";
import { AppRouter } from "./components/AppRouter/AppRouter";
import { CharactersManager } from "./components/CharactersManager/CharactersManager";
import { ErrorReport } from "./components/ErrorBoundary/ErrorReport";
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

export function App() {
  return (
    <AppContexts>
      <AppRouter />
    </AppContexts>
  );
}

function AppContexts(props: { children: ReactNode }) {
  const darkModeManager = useDarkMode();
  const charactersManager = useCharacters();
  const scenesManager = useScenes();
  const diceManager = useDice();

  return (
    <DarkModeContext.Provider value={darkModeManager}>
      <CharactersContext.Provider value={charactersManager}>
        <ScenesContext.Provider value={scenesManager}>
          <DiceContext.Provider value={diceManager}>
            <AppProviders>{props.children}</AppProviders>
          </DiceContext.Provider>
        </ScenesContext.Provider>
      </CharactersContext.Provider>
    </DarkModeContext.Provider>
  );
}

function AppProviders(props: { children: ReactNode }) {
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
              <AppAnalytics />
              <ScenesManager />
              <CharactersManager />
              {props.children}
            </BrowserRouter>
          </HelmetProvider>
        </Sentry.ErrorBoundary>
      </StylesProvider>
    </ThemeProvider>
  );
}
AppProviders.displayName = "AppProvider";

/**
 * for dynamic keys
 */
export function useMark() {
  const { t } = useTranslate();

  t("common.language.dev");
  t("common.language.de");
  t("common.language.en");
  t("common.language.es");
  t("common.language.eo");
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
  t("character-dialog.template.DresdenFilesAccelerated");
  t("character-dialog.template.VentureCity");
  t("character-dialog.template.IronEddaAccelerated");
  t("character-dialog.template.Heartbreaker");
  t("character-dialog.template.FateAccelerated");
  t("character-dialog.template.FateCondensed");
  t("character-dialog.template.FateCore");
  t("character-dialog.template.Dnd5e");
  t("character-dialog.template.TheWitchIsDead");
  t("character-dialog.template.EdgeOfTheEmpire");
  t("character-dialog.template.EdgeOfTheEmpire_FR");
  t("character-dialog.template.Maze");
  t("character-dialog.template.Blank");
}
