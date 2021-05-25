import React from "react";
import { getUnix } from "../../domains/dayjs/getDayJS";
import { FariEntity } from "../../domains/fari-entity/FariEntity";
import { Id } from "../../domains/Id/Id";
import { SceneFactory } from "../../domains/scene/SceneFactory";
import { useGroups } from "../../hooks/useGroups/useGroups";
import { IScene } from "../../hooks/useScene/IScene";
import { useStorageEntities } from "../../hooks/useStorageEntities/useStorageEntities";

export type ISavableScene = Pick<
  IScene,
  "id" | "name" | "indexCards" | "version" | "lastUpdated" | "group" | "notes"
>;

export const ScenesContext = React.createContext<ReturnType<typeof useScenes>>(
  undefined as any
);

export function useScenes(props?: { localStorage: Storage }) {
  const localStorage = props?.localStorage ?? window.localStorage;
  const key = "fari-scenes";

  const [scenes, setScenes] = useStorageEntities<ISavableScene>({
    key: key,
    localStorage: localStorage,
    migrationFunction: SceneFactory.migrate,
  });

  const groups = useGroups(scenes, (s) => s.group);

  function add() {
    const newScene: ISavableScene = SceneFactory.makeSavableScene();
    setScenes((draft: Array<ISavableScene>) => {
      return [newScene, ...draft];
    });
    return newScene;
  }

  function upsert(scene: IScene | ISavableScene | undefined) {
    if (!scene) {
      return;
    }
    const exists = scenes.find((s) => s.id === scene.id);

    const newScene: ISavableScene = {
      id: scene.id,
      name: scene.name,
      group: scene.group,
      indexCards: scene.indexCards,
      version: scene.version,
      notes: scene.notes,
      lastUpdated: scene.lastUpdated,
    };
    if (!exists) {
      setScenes((draft: Array<ISavableScene>) => {
        return [newScene, ...draft];
      });
    } else {
      setScenes((draft: Array<ISavableScene>) => {
        return draft.map((c) => {
          if (c.id === scene.id) {
            return { ...newScene, lastUpdated: getUnix() };
          }
          return c;
        });
      });
    }
    return newScene;
  }

  function remove(id: string | undefined) {
    setScenes((draft: Array<ISavableScene>) => {
      return draft.filter((c) => c.id !== id);
    });
  }

  function duplicate(id: string | undefined) {
    setScenes((draft: Array<ISavableScene>) => {
      const match = draft.find((c) => c.id === id);

      return [
        ...draft,
        {
          ...match,
          id: Id.generate(),
          lastUpdated: getUnix(),
          name: `${match?.name} Copy`,
        } as ISavableScene,
      ];
    });
  }

  function importEntity(sceneFile: FileList | null) {
    FariEntity.import<ISavableScene>({
      filesToImport: sceneFile,
      fariType: "scene",
      onImport: (sceneToImport) => {
        const migratedScene = SceneFactory.migrate(sceneToImport);
        upsert(migratedScene);
      },
    });
    // logger.info("ScenesManager:onImport");
  }

  function exportEntity(scene: ISavableScene) {
    FariEntity.export({
      element: scene,
      fariType: "scene",
      name: scene.name,
    });
    // logger.info("ScenesManager:onExport");
  }

  return {
    state: {
      scenes: scenes,
      groups: groups,
    },
    actions: {
      add,
      upsert,
      remove,
      duplicate,
      importEntity,
      exportEntity,
    },
  };
}

export const defaultSceneName = "";
export const defaultSceneVersion = 2;
