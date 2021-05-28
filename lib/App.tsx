import CssBaseline from "@material-ui/core/CssBaseline";
import { StylesProvider, ThemeProvider } from "@material-ui/core/styles";
import * as Sentry from "@sentry/react";
import React, { ReactNode, useContext } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter, useHistory } from "react-router-dom";
import { AppAnalytics } from "./components/AppAnalytics/AppAnalytics";
import { AppRouter } from "./components/AppRouter/AppRouter";
import { previewContentEditable } from "./components/ContentEditable/ContentEditable";
import { ErrorReport } from "./components/ErrorBoundary/ErrorReport";
import { IManagerViewModel, MyBinder } from "./components/MyBinder/MyBinder";
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
  IFolders,
  MyBinderContext,
  useMyBinder,
} from "./contexts/MyBinderContext/MyBinderContext";
import {
  ScenesContext,
  useScenes,
} from "./contexts/SceneContext/ScenesContext";
import { CharacterTemplates } from "./domains/character/CharacterType";
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
  const myBinderManager = useMyBinder();

  return (
    <DndProvider backend={HTML5Backend}>
      <DarkModeContext.Provider value={darkModeManager}>
        <CharactersContext.Provider value={charactersManager}>
          <ScenesContext.Provider value={scenesManager}>
            <DiceContext.Provider value={diceManager}>
              <MyBinderContext.Provider value={myBinderManager}>
                <AppProviders>{props.children}</AppProviders>
              </MyBinderContext.Provider>
            </DiceContext.Provider>
          </ScenesContext.Provider>
        </CharactersContext.Provider>
      </DarkModeContext.Provider>
    </DndProvider>
  );
}

function MyBinderManager() {
  const scenesManager = useContext(ScenesContext);
  const charactersManager = useContext(CharactersContext);
  const myBinderManager = useContext(MyBinderContext);
  const history = useHistory();

  type IHandlers = {
    onSelect(element: IManagerViewModel): void;
    onAdd(): void;
    onDelete(element: IManagerViewModel): void;
    onDuplicate(element: IManagerViewModel): void;
    onUndo(element: IManagerViewModel): void;
    onImport(importPaths: FileList | null): void;
    onExport(element: IManagerViewModel): void;
  };

  const folders: Record<IFolders, Array<IManagerViewModel>> = {
    characters: charactersManager.state.characters.map(
      (c): IManagerViewModel => ({
        id: c.id,
        group: c.group,
        name: previewContentEditable({ value: c.name }),
        lastUpdated: c.lastUpdated,
        type: "characters",
        original: c,
      })
    ),
    scenes: scenesManager.state.scenes.map(
      (s): IManagerViewModel => ({
        id: s.id,
        group: s.group,
        name: previewContentEditable({ value: s.name }),
        lastUpdated: s.lastUpdated,
        type: "scenes",
        original: s,
      })
    ),
  };
  const handler: Record<IFolders, IHandlers> = {
    characters: {
      async onAdd() {
        const newCharacter = await charactersManager.actions.add(
          CharacterTemplates.Blank
        );

        if (myBinderManager.state.managerCallback.current) {
          myBinderManager.state.managerCallback.current(newCharacter);
        } else {
          history.push(`/characters/${newCharacter.id}`);
        }
        myBinderManager.actions.close();
      },
      onSelect(element) {
        if (myBinderManager.state.managerCallback.current) {
          myBinderManager.state.managerCallback.current(element.original);
        } else {
          history.push(`/characters/${element.id}`);
        }
        myBinderManager.actions.close();
      },
      onDelete(element) {
        charactersManager.actions.remove(element.id);
      },
      onDuplicate(element) {
        charactersManager.actions.duplicate(element.id);
      },
      onUndo(element) {
        charactersManager.actions.upsert(element.original);
      },
      onImport(importPaths) {
        charactersManager.actions.importEntity(importPaths);
      },
      onExport(element) {
        charactersManager.actions.exportEntity(element.original);
      },
    },
    scenes: {
      onAdd() {
        const newScene = scenesManager.actions.add();
        if (myBinderManager.state.managerCallback.current) {
          myBinderManager.state.managerCallback.current(newScene);
        } else {
          history.push(`/scenes/${newScene.id}`);
        }
        myBinderManager.actions.close();
      },
      onSelect(element) {
        if (myBinderManager.state.managerCallback.current) {
          myBinderManager.state.managerCallback.current(element.original);
        } else {
          history.push(`/scenes/${element.id}`);
        }
        myBinderManager.actions.close();
      },
      onDelete(element) {
        scenesManager.actions.remove(element.id);
      },
      onDuplicate(element) {
        scenesManager.actions.duplicate(element.id);
      },
      onUndo(element) {
        scenesManager.actions.upsert(element.original);
      },
      onImport(importPaths) {
        scenesManager.actions.importEntity(importPaths);
      },
      onExport(element) {
        scenesManager.actions.exportEntity(element.original);
      },
    },
  };

  return (
    <MyBinder<IFolders>
      open={myBinderManager.state.open}
      onClose={() => {
        myBinderManager.actions.close();
      }}
      search={""}
      folder={myBinderManager.state.folder}
      canGoBack={myBinderManager.state.folder ? false : true}
      folders={folders}
      onSelect={(folder, element) => {
        handler[folder].onSelect(element);
      }}
      onAdd={(folder) => {
        handler[folder].onAdd();
      }}
      onDelete={(folder, element) => {
        handler[folder].onDelete(element);
      }}
      onDuplicate={(folder, element) => {
        handler[folder].onDuplicate(element);
      }}
      onUndo={(folder, element) => {
        handler[folder].onUndo(element);
      }}
      onImport={(folder, importPaths) => {
        handler[folder].onImport(importPaths);
      }}
      onExport={(folder, element) => {
        handler[folder].onExport(element);
      }}
    />
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
              <MyBinderManager />
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

  t("my-binder.folder.characters");
  t("my-binder.folder.scenes");

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
