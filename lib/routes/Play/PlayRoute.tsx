import React, { useContext, useEffect } from "react";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Scene, SceneMode } from "../../components/Scene/Scene";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { ScenesContext } from "../../contexts/SceneContext/ScenesContext";
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
  const logger = useLogger();

  const idFromParams = props.match.params.id;
  const userId = useUserId();
  const charactersManager = useContext(CharactersContext);
  const scenesManager = useContext(ScenesContext);

  const sceneManager = useScene({
    userId: userId,
    gameId: idFromParams,
    charactersManager: charactersManager,
  });
  const sceneName = sceneManager.state.scene.name;
  const pageTitle = sanitizeSceneName(sceneName);
  const { t } = useTranslate();

  const hostManager = usePeerHost({
    onConnectionDataReceive(id: string, peerAction: IPeerActions) {
      if (peerAction.action === "roll") {
        sceneManager.actions.updatePlayerRoll(id, peerAction.payload);
      }
      if (peerAction.action === "update-main-point-counter") {
        sceneManager.actions.updatePlayerCharacterMainPointCounter(
          id,
          peerAction.payload.points,
          peerAction.payload.maxPoints
        );
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
      if (peerAction.action === "load-character") {
        sceneManager.actions.loadPlayerCharacter(id, peerAction.payload);
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

  const isGM = !idFromParams;
  const shareLink = `${location.origin}/play/${hostManager.state.hostId}`;
  const shouldRenderPlayerJoinGameScreen =
    !isGM && !connectionsManager!.state.isConnectedToHost;

  useEffect(() => {
    hostManager.actions.sendToConnections(sceneManager.state.scene);
  }, [sceneManager.state.scene]);

  useEffect(() => {
    if (isGM) {
      sceneManager.actions.updatePlayersWithConnections(
        hostManager.state.connections
      );
    }
  }, [hostManager.state.connections]);

  useEffect(() => {
    if (isGM) {
      logger.info("Route:Play");
      logger.info("Route:Play:GM");
    } else {
      logger.info("Route:Play");
      logger.info("Route:Play:Player");
    }
  }, []);

  return (
    <>
      <PageMeta
        title={pageTitle || t("home-route.play-online.title")}
        description={t("home-route.play-online.description")}
      />
      {shouldRenderPlayerJoinGameScreen ? (
        <JoinAGame
          idFromParams={idFromParams}
          connecting={connectionsManager?.state.connectingToHost ?? false}
          error={connectionsManager?.state.connectingToHostError}
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
export default PlayRoute;
