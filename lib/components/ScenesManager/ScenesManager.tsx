import { useTheme } from "@material-ui/core";
import produce from "immer";
import React, { useContext } from "react";
import { useHistory } from "react-router";
import { v4 as uuidV4 } from "uuid";
import {
  ISavableScene,
  migrateScene,
  ScenesContext,
} from "../../contexts/SceneContext/ScenesContext";
import { FariEntity } from "../../domains/FariEntity/FariEntity";
import { Manager } from "../Manager/Manager";

type IProps = {};

export const ScenesManager: React.FC<IProps> = (props) => {
  const history = useHistory();
  const scenesManager = useContext(ScenesContext);

  const theme = useTheme();

  function onAdd() {
    const newScene = scenesManager.actions.add();
    history.push(`/scenes/${newScene.id}`);
    scenesManager.actions.closeManager();
  }

  function onItemClick(scene: ISavableScene) {
    if (scenesManager.state.managerCallback) {
      scenesManager.state.managerCallback(scene);
    } else {
      history.push(`/scenes/${scene.id}`);
    }

    scenesManager.actions.closeManager();
  }

  function onUndo(scene: ISavableScene) {
    scenesManager.actions.upsert(scene);
  }

  function onDelete(scene: ISavableScene) {
    scenesManager.actions.remove(scene.id);
  }

  function onImport(sceneToImport: FileList | null) {
    FariEntity.import<ISavableScene>({
      filesToImport: sceneToImport,
      fariType: "scene",
      onImport: (s) => {
        const sceneWithNewId = produce(s, (draft) => {
          draft.id = uuidV4();
        });
        const migratedScene = migrateScene(sceneWithNewId);
        scenesManager.actions.upsert(migratedScene);
      },
    });
  }

  function onExport(scene: ISavableScene) {
    FariEntity.export({
      element: scene,
      fariType: "scene",
      name: scene.name,
    });
  }

  return (
    <Manager
      list={scenesManager.state.scenes}
      getViewModel={(s) => ({
        id: s.id,
        name: s.name,
        lastUpdated: s.lastUpdated,
      })}
      mode={scenesManager.state.mode}
      onItemClick={onItemClick}
      onAdd={onAdd}
      onDelete={onDelete}
      onUndo={onUndo}
      onClose={scenesManager.actions.closeManager}
      onImport={onImport}
      onExport={onExport}
    />
  );
};

ScenesManager.displayName = "ScenesManager";
