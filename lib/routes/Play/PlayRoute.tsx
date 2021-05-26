import React, { useContext, useEffect, useMemo } from "react";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Scene, SceneMode } from "../../components/Scene/Scene";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { ScenesContext } from "../../contexts/SceneContext/ScenesContext";
import { usePeerConnections } from "../../hooks/usePeerJS/usePeerConnections";
import { usePeerHost } from "../../hooks/usePeerJS/usePeerHost";
import { IPeerMeta, useScene } from "../../hooks/useScene/useScene";
import { useSession } from "../../hooks/useScene/useSession";
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
  const myBinderManager = useContext(MyBinderContext);

  const sceneManager = useScene({
    userId: userId,
    charactersManager: charactersManager,
  });
  const sessionManager = useSession({
    userId: userId,
    charactersManager: charactersManager,
  });
  const sceneName = sceneManager.state.scene?.name ?? "";
  const pageTitle = useMemo(() => {
    return previewContentEditable({ value: sceneName });
  }, [sceneName]);
  const { t } = useTranslate();

  const hostManager = usePeerHost({
    onConnectionDataReceive(id: string, peerAction: IPeerActions) {
      if (peerAction.action === "roll") {
        sessionManager.actions.updatePlayerRoll(id, peerAction.payload);
      }
      if (peerAction.action === "update-main-point-counter") {
        sessionManager.actions.updatePlayerCharacterMainPointCounter(
          id,
          peerAction.payload.points,
          peerAction.payload.maxPoints
        );
      }
      if (peerAction.action === "played-in-turn-order") {
        sessionManager.actions.updatePlayerPlayedDuringTurn(
          id,
          peerAction.payload
        );
      }
      if (peerAction.action === "update-character") {
        sessionManager.actions.updatePlayerCharacter(id, peerAction.payload);
      }
      if (peerAction.action === "load-character") {
        sessionManager.actions.loadPlayerCharacter(id, peerAction.payload);
      }
    },
    debug: debug,
  });
  const connectionsManager = usePeerConnections({
    onHostDataReceive(newData) {
      sceneManager.actions.overrideScene(newData.scene);
      sessionManager.actions.overrideSession(newData.session);
    },
    debug: debug,
  });

  const isGM = !idFromParams;
  const shareLink = `${location.origin}/play/${hostManager.state.hostId}`;
  const shouldRenderPlayerJoinGameScreen =
    !isGM && !connectionsManager!.state.isConnectedToHost;

  useEffect(() => {
    hostManager.actions.sendToConnections({
      scene: sceneManager.state.scene,
      session: sessionManager.state.session,
    });
  }, [sceneManager.state.scene, sessionManager.state.session]);

  useEffect(() => {
    if (isGM) {
      sessionManager.actions.updatePlayersWithConnections(
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
          sessionManager={sessionManager}
          sceneManager={sceneManager}
          scenesManager={scenesManager}
          charactersManager={charactersManager}
          connectionsManager={connectionsManager}
          myBinderManager={myBinderManager}
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
