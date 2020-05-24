import React, { useEffect } from "react";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { usePeerConnections as usePeerConnection } from "../../hooks/usePeerJS/usePeerConnection";
import { usePeerHost } from "../../hooks/usePeerJS/usePeerHost";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { useCharacters } from "../Characters/hooks/useCharacters";
import { IPeerActions } from "./IPeerActions";
import { PlayPage } from "./PlayPage";
import { sanitizeSceneName, useScene } from "./useScene/useScene";
import { useUserId } from "./useUserId/useUserId";

const debug = false;

export const PlayRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const idFromParams = props.match.params.id;
  const userId = useUserId();
  const sceneManager = useScene(userId, idFromParams);
  const sceneName = sceneManager.state.scene.name;
  const pageTitle = sanitizeSceneName(sceneName);
  const characterManager = useCharacters();
  const { t } = useTranslate();

  const hostManager = usePeerHost({
    onConnectionDataReceive(id: string, peerAction: IPeerActions) {
      if (peerAction.action === "roll") {
        sceneManager.actions.updatePlayerRoll(id, peerAction.payload);
      }
      if (peerAction.action === "update-fate-point") {
        sceneManager.actions.updatePlayerFatePoints(id, peerAction.payload);
      }
      if (peerAction.action === "played-in-turn-order") {
        sceneManager.actions.updatePlayerPlayedDuringTurn(
          id,
          peerAction.payload
        );
      }
    },
    debug: debug,
  });
  const connectionsManager = usePeerConnection({
    onHostDataReceive(newScene) {
      sceneManager.actions.safeSetScene(newScene);
    },
    debug: debug,
  });

  useEffect(() => {
    hostManager.actions.sendToConnections(sceneManager.state.scene);
  }, [sceneManager.state.scene]);

  useEffect(() => {
    if (isGM) {
      sceneManager.actions.updatePlayers(hostManager.state.connections);
    }
  }, [hostManager.state.connections]);

  const isGM = !idFromParams;
  const shareLink = `${location.origin}/play/${hostManager.state.hostId}`;

  return (
    <>
      <PageMeta
        title={pageTitle || t("home-route.play-online.title")}
        description={t("home-route.play-online.description")}
      ></PageMeta>

      <PlayPage
        sceneManager={sceneManager}
        characterManager={characterManager}
        connectionsManager={connectionsManager}
        isLoading={
          hostManager.state.loading || connectionsManager.state.loading
        }
        idFromParams={idFromParams}
        shareLink={shareLink}
        userId={userId}
        error={hostManager.state.error}
      ></PlayPage>
    </>
  );
};

PlayRoute.displayName = "PlayRoute";
