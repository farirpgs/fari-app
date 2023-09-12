"use client";

import * as Sentry from "@sentry/react";
import { ReactNode, useContext } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { useRouter } from "next/navigation";
import ThemeRegistry from "../app/ThemeRegistry";
import { previewContentEditable } from "./components/ContentEditable/ContentEditable";
import { ErrorReport } from "./components/ErrorBoundary/ErrorReport";
import { IManagerViewModel, MyBinder } from "./components/MyBinder/MyBinder";
import { AppI18nProvider } from "./contexts/AppI18nContext/AppI18nContext";
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
import { DefaultTemplatesPaths } from "./domains/character/DefaultTemplates";
import {
  IIndexCardCollection,
  IndexCardCollectionFactory,
} from "./domains/index-card-collection/IndexCardCollectionFactory";
import { SceneFactory } from "./domains/scene/SceneFactory";
import { IScene } from "./hooks/useScene/IScene";
import { useTranslate } from "./hooks/useTranslate/useTranslate";
import { getDefaultInjections } from "./services/injections";

const injections = getDefaultInjections();

export function AppProviders(props: { children: ReactNode }) {
  const settingsManager = useSettings();
  const charactersManager = useCharacters();
  const scenesManager = useScenes();
  const indexCardCollectionsManager = useIndexCardCollections();
  const diceManager = useDice();
  const myBinderManager = useMyBinder();

  return (
    <InjectionsContext.Provider value={injections}>
      <AppI18nProvider>
        <DndProvider backend={HTML5Backend}>
          <SettingsContext.Provider value={settingsManager}>
            <CharactersContext.Provider value={charactersManager}>
              <ScenesContext.Provider value={scenesManager}>
                <IndexCardCollectionsContext.Provider
                  value={indexCardCollectionsManager}
                >
                  <DiceContext.Provider value={diceManager}>
                    <MyBinderContext.Provider value={myBinderManager}>
                      <InternalProviders>{props.children}</InternalProviders>
                    </MyBinderContext.Provider>
                  </DiceContext.Provider>
                </IndexCardCollectionsContext.Provider>
              </ScenesContext.Provider>
            </CharactersContext.Provider>
          </SettingsContext.Provider>
        </DndProvider>
      </AppI18nProvider>
    </InjectionsContext.Provider>
  );
}

function MyBinderManager() {
  const scenesManager = useContext(ScenesContext);
  const charactersManager = useContext(CharactersContext);
  const indexCardCollectionsManager = useContext(IndexCardCollectionsContext);
  const myBinderManager = useContext(MyBinderContext);
  const router = useRouter();

  type IHandlers = {
    onSelect(element: IManagerViewModel): void;
    onSelectOnNewTab(element: IManagerViewModel): void;
    onAdd(): void;
    onDelete(element: IManagerViewModel): void;
    onDuplicate(element: IManagerViewModel): void;
    onUndo(element: IManagerViewModel): void;
    onImport(importPaths: any | null): Promise<{ entity: any | undefined }>;
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
      }),
    ),
    "scenes": scenesManager.state.scenes.map(
      (s): IManagerViewModel => ({
        id: s.id as string,
        group: s.group,
        name: previewContentEditable({ value: s.name }),
        lastUpdated: s.lastUpdated,
        type: "scenes",
        original: s,
      }),
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
        }),
      ),
  };
  const handler: Record<IFolders, IHandlers> = {
    "characters": {
      async onAdd() {
        const newCharacter = await charactersManager.actions.add({
          template: {
            name: "Blank",
            publisher: "Blank",
            fetchPath: DefaultTemplatesPaths.Blank,
          },
        });

        if (myBinderManager.state.managerCallback.current) {
          myBinderManager.state.managerCallback.current(newCharacter);
        } else {
          router.push(`/characters/${newCharacter.id}?advanced=true`);
        }
        myBinderManager.actions.close();
      },
      onSelect(element) {
        if (myBinderManager.state.managerCallback.current) {
          myBinderManager.state.managerCallback.current(element.original);
        } else {
          router.push(`/characters/${element.id}`);
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
        const { entity, exists } =
          await charactersManager.actions.importEntity(importPaths);

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
          CharacterFactory.duplicate(character),
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
          router.push(`/scenes/${newScene.id}`);
        }
        myBinderManager.actions.close();
      },
      onSelect(element) {
        if (myBinderManager.state.managerCallback.current) {
          myBinderManager.state.managerCallback.current(element.original);
        } else {
          router.push(`/scenes/${element.id}`);
        }
        myBinderManager.actions.close();
      },
      onSelectOnNewTab(element) {
        if (typeof window === "undefined") return;
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
        const { entity, exists } =
          await scenesManager.actions.importEntity(importPaths);

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
          router.push(`/cards/${newEntity.id}`);
        }
        myBinderManager.actions.close();
      },
      onSelect(element) {
        if (myBinderManager.state.managerCallback.current) {
          myBinderManager.state.managerCallback.current(element.original);
        } else {
          router.push(`/cards/${element.id}`);
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
          IndexCardCollectionFactory.duplicate(entity),
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
          element.original,
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

function InternalProviders(props: { children: ReactNode }) {
  return (
    <ThemeRegistry options={{ key: "mui" }}>
      <Sentry.ErrorBoundary
        fallback={
          <>
            <ErrorReport />
          </>
        }
        showDialog
      >
        <MyBinderManager />
        {props.children}
      </Sentry.ErrorBoundary>
    </ThemeRegistry>
  );
}

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
