import produce from "immer";
import React, { useEffect, useState } from "react";
import { arraySort } from "../domains/array/arraySort";
import { IScene } from "../routes/Play/hooks/useScene/IScene";

export type ISavableScene = Pick<
  IScene,
  "id" | "name" | "aspects" | "version" | "lastUpdated"
>;

export const ScenesContext = React.createContext<ReturnType<typeof useScenes>>(
  undefined as any
);

export function useScenes() {
  const key = "fari-scenes";
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

  function addOrUpdate(scene: IScene) {
    const exists = scenes.find((s) => s.id === scene.id);

    if (!exists) {
      add(scene);
    } else {
      update(scene);
    }
  }

  function add(scene: IScene) {
    const newScene: ISavableScene = {
      id: scene.id,
      name: scene.name,
      aspects: scene.aspects,
      version: scene.version,
      lastUpdated: scene.lastUpdated,
    };
    setScenes((draft: Array<ISavableScene>) => {
      return [newScene, ...draft];
    });
  }

  function update(scene: IScene | undefined) {
    if (!scene) {
      return;
    }
    const newScene: ISavableScene = {
      id: scene.id,
      name: scene.name,
      aspects: scene.aspects,
      version: scene.version,
      lastUpdated: scene.lastUpdated,
    };

    setScenes((draft: Array<ISavableScene>) => {
      return draft.map((c) => {
        if (c.id === scene.id) {
          return newScene;
        }
        return c;
      });
    });
  }

  function remove(id: string | undefined) {
    setScenes((draft: Array<ISavableScene>) => {
      return draft.filter((c) => c.id !== id);
    });
  }

  return {
    state: {
      scenes: sortedScenes,
    },
    actions: {
      addOrUpdate,
      remove,
    },
  };
}

export function migrateScenes(characters: Array<ISavableScene>) {
  return produce(characters, (draft) => {
    draft.forEach((c) => {});
  });
}
