import { useTheme } from "@material-ui/core";
import React, { useContext } from "react";
import { useHistory } from "react-router";
import { v4 as uuidV4 } from "uuid";
import {
  ISavableScene,
  ScenesContext
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

  function onImport(scenesToImport: FileList | null) {
    if (scenesToImport) {
      var reader = new FileReader();
      reader.onload = function (event) {
        if (event.target) {
          if (event.target.result) {
            var importingScene = JSON.parse(event.target.result.toString()) as ISavableScene;
            importingScene.id = uuidV4();
            scenesManager.actions.upsert(importingScene);
          }
        }
      }
      reader.readAsText(scenesToImport[0]);
    }
  }

  function onExport(scene: ISavableScene) {
    var sceneDataAsString = JSON.stringify(scene);
    var sceneDataAsBlob = new Blob([sceneDataAsString], { type: "text/plain" });
    var downloadURL = URL.createObjectURL(sceneDataAsBlob);
    var secretLink = document.createElement("a");
    secretLink.href = downloadURL;
    secretLink.download = scene.name + "_data.json";
    secretLink.click();
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
