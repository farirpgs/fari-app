import React, { useContext, useEffect } from "react";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Scene, SceneMode } from "../../components/Scene/Scene";
import { CharactersContext } from "../../contexts/CharactersContext";
import { ScenesContext } from "../../contexts/ScenesContext";
import { usePeerConnections } from "../../hooks/usePeerJS/usePeerConnections";
import { usePeerHost } from "../../hooks/usePeerJS/usePeerHost";
import {
  IPeerMeta,
  sanitizeSceneName,
  useScene,
} from "../../hooks/useScene/useScene";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { useUserId } from "../../hooks/useUserId/useUserId";
import { JoinAGame } from "./JoinAGameRoute";
import { IPeerActions } from "./types/IPeerActions";

const debug = true;

export const PlayRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const idFromParams = props.match.params.id;
  const userId = useUserId();
  const charactersManager = useContext(CharactersContext);
  const scenesManager = useContext(ScenesContext);

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
  const shouldRenderPlayerJoinGameScreen =
    !isGM && !connectionsManager!.state.isConnectedToHost;

  return (
    <>
      <PageMeta
        title={pageTitle || t("home-route.play-online.title")}
        description={t("home-route.play-online.description")}
      />
      {shouldRenderPlayerJoinGameScreen ? (
        <JoinAGame
          connecting={connectionsManager?.state.connectingToHost ?? false}
          error={connectionsManager?.state.connectingToHostError}
          onSubmitCharacter={(character) => {
            connectionsManager?.actions.connect<IPeerMeta>(
              idFromParams,
              userId,
              {
                character: character,
              }
            );
          }}
          onSubmitPlayerName={(playerName) => {
            connectionsManager?.actions.connect<IPeerMeta>(
              idFromParams,
              userId,
              {
                playerName: playerName,
              }
            );
          }}
        />
      ) : (
        <Scene
          mode={SceneMode.PlayOnline}
          sceneManager={sceneManager}
          scenesManager={scenesManager}
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
      )}
    </>
  );
};

PlayRoute.displayName = "PlayRoute";
