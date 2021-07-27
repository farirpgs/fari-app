import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider, Theme, StyledEngineProvider } from "@material-ui/core/styles";
import StylesProvider from '@material-ui/styles/StylesProvider';
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
import { DiceContext, useDice } from "./contexts/DiceContext/DiceContext";
import { InjectionsContext } from "./contexts/InjectionsContext/InjectionsContext";
import {
  IFolders,
  MyBinderContext,
  useMyBinder,
} from "./contexts/MyBinderContext/MyBinderContext";
import {
  ScenesContext,
  useScenes,
} from "./contexts/SceneContext/ScenesContext";
import {
  SettingsContext,
  useSettings,
} from "./contexts/SettingsContext/SettingsContext";
import { CharacterFactory } from "./domains/character/CharacterFactory";
import { CharacterTemplates } from "./domains/character/CharacterType";
import { SceneFactory } from "./domains/scene/SceneFactory";
import { IScene } from "./hooks/useScene/IScene";
import { useTranslate } from "./hooks/useTranslate/useTranslate";
import { getDefaultInjections } from "./services/injections";
import { AppDarkTheme, AppLightTheme } from "./theme";


declare module '@material-ui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const injections = getDefaultInjections();

export function App() {
  return (
    <AppContexts>
      <AppRouter />
    </AppContexts>
  );
}

function AppContexts(props: { children: ReactNode }) {
  const settingsManager = useSettings();
  const charactersManager = useCharacters();
  const scenesManager = useScenes();
  const diceManager = useDice({
    defaultCommands: settingsManager.state.diceCommandIds,
    onCommandSetsChange(commandSetOptions) {
      const commandSetIds = commandSetOptions.map((l) => l.id);
      settingsManager.actions.setDiceCommandsIds(commandSetIds);
    },
  });
  const myBinderManager = useMyBinder();

  return (
    <React.Suspense fallback={null}>
      <InjectionsContext.Provider value={injections}>
        <DndProvider backend={HTML5Backend}>
          <SettingsContext.Provider value={settingsManager}>
            <CharactersContext.Provider value={charactersManager}>
              <ScenesContext.Provider value={scenesManager}>
                <DiceContext.Provider value={diceManager}>
                  <MyBinderContext.Provider value={myBinderManager}>
                    <AppProviders>{props.children}</AppProviders>
                  </MyBinderContext.Provider>
                </DiceContext.Provider>
              </ScenesContext.Provider>
            </CharactersContext.Provider>
          </SettingsContext.Provider>
        </DndProvider>
      </InjectionsContext.Provider>
    </React.Suspense>
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
    onImport(
      importPaths: FileList | null
    ): Promise<{ entity: any | undefined }>;
    onImportAddAsNew(entity: any): void;
    onImportUpdateExisting(entity: any): void;
    onExport(element: IManagerViewModel): void;
    onExportAsTemplate(element: IManagerViewModel): void;
  };

  const folders: Record<IFolders, Array<IManagerViewModel>> = {
    characters: charactersManager.state.characters.map(
      (c): IManagerViewModel => ({
        id: c.id as string,
        group: c.group,
        name: previewContentEditable({ value: c.name }),
        lastUpdated: c.lastUpdated,
        type: "characters",
        original: c,
      })
    ),
    scenes: scenesManager.state.scenes.map(
      (s): IManagerViewModel => ({
        id: s.id as string,
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
      async onImport(importPaths) {
        const { character, exists } =
          await charactersManager.actions.importEntity(importPaths);

        if (!exists) {
          charactersManager.actions.upsert(character);
          return { entity: undefined };
        } else {
          return {
            entity: character,
          };
        }
      },
      onImportAddAsNew(character) {
        charactersManager.actions.addIfDoesntExist(
          CharacterFactory.duplicate(character)
        );
      },
      onImportUpdateExisting(character) {
        charactersManager.actions.upsert(character);
      },
      onExport(element) {
        charactersManager.actions.exportEntity(element.original);
      },
      onExportAsTemplate(element) {
        charactersManager.actions.exportEntityAsTemplate(element.original);
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
      async onImport(importPaths) {
        const { scene, exists } = await scenesManager.actions.importEntity(
          importPaths
        );

        if (!exists) {
          scenesManager.actions.upsert(scene);
          return { entity: undefined };
        } else {
          return {
            entity: scene,
          };
        }
      },
      onImportAddAsNew(scene: IScene) {
        scenesManager.actions.upsert(SceneFactory.duplicate(scene));
      },
      onImportUpdateExisting(scene) {
        scenesManager.actions.upsert(scene);
      },
      onExport(element) {
        scenesManager.actions.exportEntity(element.original);
      },
      onExportAsTemplate(element) {
        scenesManager.actions.exportEntityAsTemplate(element.original);
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
        return handler[folder].onImport(importPaths);
      }}
      onImportAddAsNew={(folder, entity) => {
        return handler[folder].onImportAddAsNew(entity);
      }}
      onImportUpdateExisting={(folder, entity) => {
        return handler[folder].onImportUpdateExisting(entity);
      }}
      onExport={(folder, element) => {
        handler[folder].onExport(element);
      }}
      onExportAsTemplate={(folder, element) => {
        handler[folder].onExportAsTemplate(element);
      }}
    />
  );
}

function AppProviders(props: { children: ReactNode }) {
  const store = useContext(SettingsContext);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider
        theme={store.state.themeMode === "dark" ? AppDarkTheme : AppLightTheme}
      >
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
    </StyledEngineProvider>
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
}
