import { useTheme } from "@material-ui/core";
import React, { useContext } from "react";
import { useHistory } from "react-router";
import {
  ISavableScene,
  ScenesContext,
} from "../../contexts/SceneContext/ScenesContext";
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
    />
  );
};

ScenesManager.displayName = "ScenesManager";
