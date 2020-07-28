import produce from "immer";
import React, { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { arraySort } from "../../domains/array/arraySort";
import { IScene } from "../../hooks/useScene/IScene";

export type ISavableScene = Pick<
  IScene,
  "id" | "name" | "aspects" | "version" | "lastUpdated"
>;

export const ScenesContext = React.createContext<ReturnType<typeof useScenes>>(
  undefined as any
);

export enum ScenesManagerMode {
  Redirect,
  Use,
  Close,
}

export function useScenes() {
  const key = "fari-scenes";
  const [mode, setMode] = useState(ScenesManagerMode.Close);
  const [selectedScene, setSelectedScene] = useState<ISavableScene | undefined>(
    undefined
  );

  const [scenes, setScenes] = useState<Array<ISavableScene>>(() => {
    // load from local storage
    try {
      const localStorageScenes = localStorage.getItem(key);
      if (localStorageScenes) {
        const parsed = JSON.parse(localStorageScenes);
        const migrated = migrateScenes(parsed);
        return migrated;
      }
    } catch (error) {
      console.error(error);
    }
    return [];
  });

  const sortedScenes = arraySort(scenes, [
    (c) => ({ value: c.lastUpdated, direction: "desc" }),
  ]);

  useEffect(() => {
    // sync local storage
    try {
      const serialized = JSON.stringify(scenes);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(error);
    }
  }, [scenes]);

  function openManager(newMode: ScenesManagerMode) {
    setMode(newMode);
  }

  function closeManager() {
    setMode(ScenesManagerMode.Close);
  }

  function add() {
    const newScene: ISavableScene = makeDefaultSavableScene();
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
      aspects: scene.aspects,
      version: scene.version,
      lastUpdated: new Date().getTime(),
    };
    if (!exists) {
      setScenes((draft: Array<ISavableScene>) => {
        return [newScene, ...draft];
      });
    } else {
      setScenes((draft: Array<ISavableScene>) => {
        return draft.map((c) => {
          if (c.id === scene.id) {
            return newScene;
          }
          return c;
        });
      });
    }
    select(newScene);
  }

  function remove(id: string | undefined) {
    setScenes((draft: Array<ISavableScene>) => {
      return draft.filter((c) => c.id !== id);
    });
  }

  function select(scene: ISavableScene) {
    setSelectedScene(scene);
  }

  function clearSelected() {
    setSelectedScene(undefined);
  }

  return {
    state: {
      mode: mode,
      selectedScene,
      scenes: sortedScenes,
    },
    actions: {
      openManager,
      closeManager,
      select,
      clearSelected,
      add,
      upsert,
      remove,
    },
  };
}

function makeDefaultSavableScene(): ISavableScene {
  return {
    id: uuidV4(),
    name: defaultSceneName,
    aspects: defaultSceneAspects,
    version: defaultSceneVersion,
    lastUpdated: new Date().getTime(),
  };
}

export function migrateScenes(characters: Array<ISavableScene>) {
  return produce(characters, (draft) => {
    draft.forEach((c) => {});
  });
}

export const defaultSceneName = "";
export const defaultSceneAspects = {};
export const defaultSceneVersion = 1;
