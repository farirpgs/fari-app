import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
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
import {
  IndexCardCollectionsContext,
  useIndexCardCollections,
} from "./contexts/IndexCardCollectionsContext/IndexCardCollectionsContext";
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
import { DefaultTemplates } from "./domains/character/DefaultTemplates";
import {
  IIndexCardCollection,
  IndexCardCollectionFactory,
} from "./domains/index-card-collection/IndexCardCollectionFactory";
import { SceneFactory } from "./domains/scene/SceneFactory";
import { IScene } from "./hooks/useScene/IScene";
import { useTranslate } from "./hooks/useTranslate/useTranslate";
import { getDefaultInjections } from "./services/injections";
import { AppDarkTheme, AppLightTheme } from "./theme";

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
  const indexCardCollectionsManager = useIndexCardCollections();
  const diceManager = useDice({
    defaultCommands: settingsManager.state.diceCommandIds,
    defaultOptions: settingsManager.state.diceOptions,
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
                <IndexCardCollectionsContext.Provider
                  value={indexCardCollectionsManager}
                >
                  <DiceContext.Provider value={diceManager}>
                    <MyBinderContext.Provider value={myBinderManager}>
                      <AppProviders>{props.children}</AppProviders>
                    </MyBinderContext.Provider>
                  </DiceContext.Provider>
                </IndexCardCollectionsContext.Provider>
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
  const indexCardCollectionsManager = useContext(IndexCardCollectionsContext);
  const myBinderManager = useContext(MyBinderContext);
  const history = useHistory();

  type IHandlers = {
    onSelect(element: IManagerViewModel): void;
    onSelectOnNewTab(element: IManagerViewModel): void;
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
    "characters": charactersManager.state.characters.map(
      (c): IManagerViewModel => ({
        id: c.id as string,
        group: c.group,
        name: previewContentEditable({ value: c.name }),
        lastUpdated: c.lastUpdated,
        type: "characters",
        original: c,
      })
    ),
    "scenes": scenesManager.state.scenes.map(
      (s): IManagerViewModel => ({
        id: s.id as string,
        group: s.group,
        name: previewContentEditable({ value: s.name }),
        lastUpdated: s.lastUpdated,
        type: "scenes",
        original: s,
      })
    ),
    "index-card-collections":
      indexCardCollectionsManager.state.indexCardCollections.map(
        (s): IManagerViewModel => ({
          id: s.id as string,
          group: s.group,
          name: previewContentEditable({ value: s.name }),
          lastUpdated: s.lastUpdated,
          type: "index-card-collections",
          original: s,
        })
      ),
  };
  const handler: Record<IFolders, IHandlers> = {
    "characters": {
      async onAdd() {
        const newCharacter = await charactersManager.actions.add(
          DefaultTemplates.BlankTemplate
        );

        if (myBinderManager.state.managerCallback.current) {
          myBinderManager.state.managerCallback.current(newCharacter);
        } else {
          history.push(`/characters/${newCharacter.id}?advanced=true`);
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
      onSelectOnNewTab(element) {
        window.open(`/characters/${element.id}`, "_blank");
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
        const { entity, exists } = await charactersManager.actions.importEntity(
          importPaths
        );

        if (!exists) {
          charactersManager.actions.upsert(entity);
          return { entity: undefined };
        } else {
          return {
            entity: entity,
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
    "scenes": {
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
      onSelectOnNewTab(element) {
        window.open(`/scenes/${element.id}`);
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
        const { entity, exists } = await scenesManager.actions.importEntity(
          importPaths
        );

        if (!exists) {
          scenesManager.actions.upsert(entity);
          return { entity: undefined };
        } else {
          return {
            entity: entity,
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
    "index-card-collections": {
      onAdd() {
        const newEntity = indexCardCollectionsManager.actions.add();
        if (myBinderManager.state.managerCallback.current) {
          myBinderManager.state.managerCallback.current(newEntity);
        } else {
          history.push(`/cards/${newEntity.id}`);
        }
        myBinderManager.actions.close();
      },
      onSelect(element) {
        if (myBinderManager.state.managerCallback.current) {
          myBinderManager.state.managerCallback.current(element.original);
        } else {
          history.push(`/cards/${element.id}`);
        }
        myBinderManager.actions.close();
      },
      onSelectOnNewTab(element) {
        window.open(`/cards/${element.id}`);
      },
      onDelete(element) {
        indexCardCollectionsManager.actions.remove(element.id);
      },
      onDuplicate(element) {
        indexCardCollectionsManager.actions.duplicate(element.id);
      },
      onUndo(element) {
        indexCardCollectionsManager.actions.upsert(element.original);
      },
      async onImport(importPaths) {
        const { entity, exists } =
          await indexCardCollectionsManager.actions.importEntity(importPaths);

        if (!exists) {
          indexCardCollectionsManager.actions.upsert(entity);
          return { entity: undefined };
        } else {
          return {
            entity: entity,
          };
        }
      },
      onImportAddAsNew(entity: IIndexCardCollection) {
        indexCardCollectionsManager.actions.upsert(
          IndexCardCollectionFactory.duplicate(entity)
        );
      },
      onImportUpdateExisting(scene) {
        indexCardCollectionsManager.actions.upsert(scene);
      },
      onExport(element) {
        indexCardCollectionsManager.actions.exportEntity(element.original);
      },
      onExportAsTemplate(element) {
        indexCardCollectionsManager.actions.exportEntityAsTemplate(
          element.original
        );
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
      onSelectOnNewTab={(folder, element) => {
        handler[folder].onSelectOnNewTab(element);
      }}
      onNew={(folder) => {
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
  const settingsManager = useContext(SettingsContext);

  return (
    <ThemeProvider
      theme={
        settingsManager.state.themeMode === "dark"
          ? AppDarkTheme
          : AppLightTheme
      }
    >
      <StyledEngineProvider injectFirst>
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
      </StyledEngineProvider>
    </ThemeProvider>
  );
}
AppProviders.displayName = "AppProvider";

/**
 * for dynamic keys
 */
export function useMark() {
  const { t } = useTranslate();

  t("oracle.value.No");
  t("oracle.value.NoAnd");
  t("oracle.value.Yes");
  t("oracle.value.YesAnd");
  t("oracle.value.YesBut");

  t("my-binder.folder.characters");
  t("my-binder.folder.scenes");
  t("my-binder.folder.index-card-collections");
}
