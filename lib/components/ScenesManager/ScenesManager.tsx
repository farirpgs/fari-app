import produce from "immer";
import React, { useContext } from "react";
import { useHistory } from "react-router";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import {
  ISavableScene,
  ScenesContext,
} from "../../contexts/SceneContext/ScenesContext";
import { getUnix } from "../../domains/dayjs/getDayJS";
import { FariEntity } from "../../domains/fari-entity/FariEntity";
import { SceneFactory } from "../../domains/scene/SceneFactory";
import { IScene } from "../../hooks/useScene/IScene";
import { Manager } from "../Manager/Manager";

type IProps = {};

export const ScenesManager: React.FC<IProps> = (props) => {
  const history = useHistory();
  const scenesManager = useContext(ScenesContext);
  const logger = useLogger();

  function onAdd() {
    const newScene = scenesManager.actions.add();
    if (scenesManager.state.managerCallback) {
      scenesManager.state.managerCallback(newScene);
    } else {
      history.push(`/scenes/${newScene.id}`);
    }

    scenesManager.actions.closeManager();

    logger.info("ScenesManager:onAdd");
  }

  function onItemClick(scene: ISavableScene) {
    if (scenesManager.state.managerCallback) {
      scenesManager.state.managerCallback(scene);
    } else {
      history.push(`/scenes/${scene.id}`);
    }

    scenesManager.actions.closeManager();
    logger.info("ScenesManager:onItemClick");
  }

  function onUndoDelete(scene: ISavableScene) {
    scenesManager.actions.upsert(scene);
    logger.info("ScenesManager:onUndoDelete");
  }

  function onDelete(scene: ISavableScene) {
    scenesManager.actions.remove(scene.id);
    logger.info("ScenesManager:onDelete");
  }

  function onDuplicate(scene: ISavableScene) {
    scenesManager.actions.duplicate(scene.id);
    logger.info("ScenesManager:onDuplicate");
  }

  function onImport(sceneFile: FileList | null) {
    FariEntity.import<ISavableScene>({
      filesToImport: sceneFile,
      fariType: "scene",
      onImport: (sceneToImport) => {
        const migratedScene = SceneFactory.migrate(sceneToImport);
        const sceneWithNewTimestamp = produce(
          migratedScene,
          (draft: IScene) => {
            draft.lastUpdated = getUnix();
          }
        );
        scenesManager.actions.upsert(sceneWithNewTimestamp);
      },
    });
    logger.info("ScenesManager:onImport");
  }

  function onExport(scene: ISavableScene) {
    FariEntity.export({
      element: scene,
      fariType: "scene",
      name: scene.name,
    });
    logger.info("ScenesManager:onExport");
  }

  return (
    <Manager
      list={scenesManager.state.scenes}
      getViewModel={(s) => ({
        id: s.id,
        name: s.name,
        lastUpdated: s.lastUpdated,
        group: s.group,
      })}
      mode={scenesManager.state.mode}
      onItemClick={onItemClick}
      onAdd={onAdd}
      onDelete={onDelete}
      onDuplicate={onDuplicate}
      onUndo={onUndoDelete}
      onClose={scenesManager.actions.closeManager}
      onImport={onImport}
      onExport={onExport}
    />
  );
};

ScenesManager.displayName = "ScenesManager";
