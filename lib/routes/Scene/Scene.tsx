import { Snackbar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { routerHistory } from "../../components/History/History";
import { SceneService } from "../../services/scene-service/SceneService";
import { IScene } from "../../types/IScene";
import { useAspects } from "./hooks/useAspects";
import { useBadGuys } from "./hooks/useBadGuys";
import { ScenePure } from "./ScenePure";
import { googleAnalyticsService } from "../../services/injections";
import { Chat } from "./Chat";

const defaultScene = { badGuys: [], characters: [] };

export const Scene: React.FC<{
  match: {
    params: {
      sceneId?: string;
      peerId?: string;
    };
  };
}> = props => {
  const { sceneId, peerId: peerIdFromParams } = props.match.params;
  const [isLoading, setIsLoading] = useState(true);
  const [scene, setScene] = useState<IScene>(defaultScene);
  const [sceneCreatedSnackBar, setSceneCreatedSnackBar] = React.useState({
    visible: false
  });
  const [sceneUpdatedSnackBar, setSceneUpdatedSnackBar] = React.useState({
    visible: false
  });
  const [isSceneNotFound, setIsSceneNotFound] = useState(false);

  const aspectsManager = useAspects(setScene);
  const badGuyManager = useBadGuys(setScene);

  async function loadScene(sceneId: string) {
    if (sceneId) {
      if (!scene._id) {
        setIsLoading(true);
      }

      const result = await new SceneService().get(sceneId);

      if (!result) {
        setIsSceneNotFound(true);
      } else {
        setScene({
          ...result,
          badGuys: !!result.badGuys ? result.badGuys : []
        });
        googleAnalyticsService.sendEvent({
          category: "Scene",
          action: "Get"
        });
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }

  async function saveScene() {
    if (!!scene._id) {
      await new SceneService().update(scene);
      googleAnalyticsService.sendEvent({
        category: "Scene",
        action: "Update"
      });

      await loadScene(scene._id);
      setSceneUpdatedSnackBar({ visible: true });
    } else {
      const id = await new SceneService().add(scene);
      googleAnalyticsService.sendEvent({
        category: "Scene",
        action: "Create"
      });

      setSceneCreatedSnackBar({
        visible: true
      });
      routerHistory.push(`/scenes/${id}`);
    }
  }

  useEffect(() => {
    loadScene(sceneId);
  }, [sceneId]);

  return (
    <>
      <ScenePure
        sceneId={sceneId}
        scene={scene}
        isLoading={isLoading}
        isSceneNotFound={isSceneNotFound}
        setScene={setScene}
        saveScene={saveScene}
        aspectsManager={aspectsManager}
        badGuyManager={badGuyManager}
      ></ScenePure>
      <Chat></Chat>
      {renderSnackBars()}
    </>
  );

  function renderSnackBars() {
    return (
      <>
        <Snackbar
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={sceneUpdatedSnackBar.visible}
          onClose={() => setSceneUpdatedSnackBar({ visible: false })}
          message={<span id="message-id">Scene Updated</span>}
        />
        <Snackbar
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={sceneCreatedSnackBar.visible}
          onClose={() => setSceneCreatedSnackBar({ visible: false })}
          message={<span id="message-id">Scene Created</span>}
        />
      </>
    );
  }
};

Scene.displayName = "Scene";
