import produce from "immer";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ManagerMode } from "../../components/Manager/Manager";
import { arraySort } from "../../domains/array/arraySort";
import { getUnix, getUnixFrom } from "../../domains/dayjs/getDayJS";
import { Id } from "../../domains/Id/Id";
import { useGroups } from "../../hooks/useGroups/useGroups";
import { IScene } from "../../hooks/useScene/IScene";

export type ISavableScene = Pick<
  IScene,
  "id" | "name" | "aspects" | "version" | "lastUpdated" | "group"
>;

type IManagerCallback = (scene: ISavableScene) => void | undefined;

export const ScenesContext = React.createContext<ReturnType<typeof useScenes>>(
  undefined as any
);

export function useScenes(props?: { localStorage: Storage }) {
  const localStorage = props?.localStorage ?? window.localStorage;
  const key = "fari-scenes";
  const [mode, setMode] = useState(ManagerMode.Close);
  const managerCallback = useRef<IManagerCallback | undefined>(undefined);

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
      if (!process.env.IS_JEST) {
        console.error(error);
      }
    }
    return [];
  });

  const sortedScenes = useMemo(() => {
    return arraySort(scenes, [
      (s) => {
        const lastUpdate = getUnixFrom(s.lastUpdated);
        return { value: lastUpdate, direction: "desc" };
      },
    ]);
  }, [scenes]);

  const groups = useGroups(sortedScenes, (s) => s.group);

  useEffect(() => {
    // sync local storage
    try {
      const serialized = JSON.stringify(scenes);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(error);
    }
  }, [scenes]);

  function openManager(newMode: ManagerMode, callback?: IManagerCallback) {
    setMode(newMode);
    managerCallback.current = callback;
  }

  function closeManager() {
    setMode(ManagerMode.Close);
    managerCallback.current = undefined;
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
      group: scene.group,
      aspects: scene.aspects,
      version: scene.version,
      lastUpdated: getUnix(),
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
    return newScene;
  }

  function remove(id: string | undefined) {
    setScenes((draft: Array<ISavableScene>) => {
      return draft.filter((c) => c.id !== id);
    });
  }

  return {
    state: {
      mode: mode,
      scenes: sortedScenes,
      groups: groups,
      managerCallback: managerCallback.current,
    },
    actions: {
      openManager,
      closeManager,
      add,
      upsert,
      remove,
    },
  };
}

function makeDefaultSavableScene(): ISavableScene {
  return {
    id: Id.get(),
    name: defaultSceneName,
    group: undefined,
    aspects: defaultSceneAspects,
    version: defaultSceneVersion,
    lastUpdated: getUnix(),
  };
}

export function migrateScenes(scenes: Array<ISavableScene>) {
  return scenes.map((s) => {
    return migrateScene(s);
  });
}

export function migrateScene(scene: ISavableScene) {
  return produce(scene, (draft) => {
    // todo...
  });
}

export const defaultSceneName = "";
export const defaultSceneAspects = {};
export const defaultSceneVersion = 1;
