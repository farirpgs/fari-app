import { useTheme } from "@material-ui/core";
import React, { useContext } from "react";
import { useHistory } from "react-router";
import {
  ISavableScene,
  ScenesContext,
  ScenesManagerMode,
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
    if (scenesManager.state.mode === ScenesManagerMode.Redirect) {
      history.push(`/scenes/${scene.id}`);
    } else {
      scenesManager.actions.select(scene);
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
      open={scenesManager.state.mode !== ScenesManagerMode.Close}
      getViewModel={(s) => ({
        id: s.id,
        name: s.name,
        lastUpdated: s.lastUpdated,
      })}
      onItemClick={onItemClick}
      onAdd={onAdd}
      onDelete={onDelete}
      onUndo={onUndo}
      onClose={scenesManager.actions.closeManager}
    />
  );
};

ScenesManager.displayName = "ScenesManager";
