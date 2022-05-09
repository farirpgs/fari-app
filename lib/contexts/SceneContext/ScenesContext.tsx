import React from "react";
import { SceneFactory } from "../../domains/scene/SceneFactory";
import { useAppEntity } from "../../hooks/useAppEntity/useAppEntity";

export const ScenesContext = React.createContext<ReturnType<typeof useScenes>>(
  undefined as any
);

export function useScenes(props?: { localStorage: Storage }) {
  const entityManager = useAppEntity({
    fariType: "scene",
    localStorageKey: "fari-scenes",
    localStorage: props?.localStorage,
    onMakeEntity: SceneFactory.make,
    onDuplicate: SceneFactory.duplicate,
    onMakeTemplate: SceneFactory.makeATemplate,
    onMigration: SceneFactory.migrate,
  });

  return {
    state: {
      scenes: entityManager.state.entities,
      groups: entityManager.state.groups,
    },
    actions: entityManager.actions,
  };
}

export const defaultSceneName = "";
export const defaultSceneVersion = 2;
