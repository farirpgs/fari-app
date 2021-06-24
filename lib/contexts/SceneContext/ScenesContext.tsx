import React from "react";
import { getUnix } from "../../domains/dayjs/getDayJS";
import { FariEntity } from "../../domains/fari-entity/FariEntity";
import { Id } from "../../domains/Id/Id";
import { SceneFactory } from "../../domains/scene/SceneFactory";
import { useGroups } from "../../hooks/useGroups/useGroups";
import { IScene } from "../../hooks/useScene/IScene";
import { useStorageEntities } from "../../hooks/useStorageEntities/useStorageEntities";

export const ScenesContext = React.createContext<ReturnType<typeof useScenes>>(
  undefined as any
);

export function useScenes(props?: { localStorage: Storage }) {
  const localStorage = props?.localStorage ?? window.localStorage;
  const key = "fari-scenes";

  const [scenes, setScenes] = useStorageEntities<IScene>({
    key: key,
    localStorage: localStorage,
    migrationFunction: SceneFactory.migrate,
  });

  const groups = useGroups(scenes, (s) => s.group);

  function add() {
    const newScene: IScene = SceneFactory.makeSavableScene();
    setScenes((draft: Array<IScene>) => {
      return [newScene, ...draft];
    });
    return newScene;
  }

  function upsert(scene: IScene | IScene | undefined) {
    if (!scene) {
      return;
    }
    const exists = scenes.find((s) => s.id === scene.id);

    const id = scene.id || Id.generate(); // If the file was exported without an id, it was exported as a template
    const sceneToUpsert = {
      ...scene,
      id: id,
      lastUpdated: getUnix(),
    };
    if (!exists) {
      setScenes((draft: Array<IScene>) => {
        return [sceneToUpsert, ...draft];
      });
    } else {
      setScenes((draft: Array<IScene>) => {
        return draft.map((c) => {
          if (c.id === scene.id) {
            return sceneToUpsert;
          }
          return c;
        });
      });
    }
    return sceneToUpsert;
  }

  function remove(id: string | undefined) {
    setScenes((draft: Array<IScene>) => {
      return draft.filter((s) => s.id !== id);
    });
  }

  function duplicate(id: string | undefined) {
    const match = scenes.find((s) => s.id === id);
    if (!match) {
      return;
    }
    const newScene = SceneFactory.duplicate(match);
    setScenes((draft: Array<IScene>) => {
      return [...draft, newScene];
    });
    return newScene;
  }

  async function importEntity(sceneFile: FileList | null) {
    const sceneToImport = await FariEntity.import<IScene>({
      filesToImport: sceneFile,
      fariType: "scene",
    });
    const migratedScene = SceneFactory.migrate(sceneToImport);
    const match = scenes.find((s) => s.id === migratedScene.id);
    return { scene: migratedScene, exists: !!match };
  }

  function exportEntity(scene: IScene) {
    FariEntity.export({
      element: scene,
      fariType: "scene",
      name: scene.name,
    });
  }
  function exportEntityAsTemplate(scene: IScene) {
    const template = SceneFactory.makeATemplate(scene);
    FariEntity.export({
      element: template,
      fariType: "scene",
      name: template.name,
    });
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
      exportEntityAsTemplate,
    },
  };
}

export const defaultSceneName = "";
export const defaultSceneVersion = 2;
