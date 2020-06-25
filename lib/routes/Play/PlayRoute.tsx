import React, { useContext, useEffect } from "react";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { CharactersContext } from "../../contexts/CharactersContext";
import { usePeerConnections } from "../../hooks/usePeerJS/usePeerConnections";
import { usePeerHost } from "../../hooks/usePeerJS/usePeerHost";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { IPeerActions } from "./IPeerActions";
import { PlayPage } from "./PlayPage";
import { sanitizeSceneName, useScene } from "./useScene/useScene";
import { useUserId } from "./useUserId/useUserId";

const debug = true;

export const PlayRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const idFromParams = props.match.params.id;
  const userId = useUserId();
  const charactersManager = useContext(CharactersContext);

  const sceneManager = useScene(userId, idFromParams, charactersManager);
  const sceneName = sceneManager.state.scene.name;
  const pageTitle = sanitizeSceneName(sceneName);
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
      if (peerAction.action === "update-character") {
        sceneManager.actions.updatePlayerCharacter(id, peerAction.payload);
      }
    },
    debug: debug,
  });
  const connectionsManager = usePeerConnections({
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
      />

      <PlayPage
        sceneManager={sceneManager}
        charactersManager={charactersManager}
        connectionsManager={connectionsManager}
        isLoading={
          hostManager.state.loading || connectionsManager.state.loading
        }
        idFromParams={idFromParams}
        shareLink={shareLink}
        userId={userId}
        error={hostManager.state.error}
      />
    </>
  );
};

PlayRoute.displayName = "PlayRoute";
