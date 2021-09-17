import React, { useContext, useEffect, useMemo } from "react";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { SceneMode, Session } from "../../components/Scene/Scene";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { useFirebaseSession } from "../../hooks/useFirebaseSession/useFirebaseSession";
import { useScene } from "../../hooks/useScene/useScene";
import { useSession } from "../../hooks/useScene/useSession";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const PlayRoute: React.FC<{
  match: {
    params: { id?: string };
  };
}> = (props) => {
  const logger = useLogger();
  const { t } = useTranslate();
  const settingsManager = useContext(SettingsContext);
  const charactersManager = useContext(CharactersContext);

  const idFromParams = props.match.params.id;
  const isGM = !idFromParams;
  const isPlayer = !isGM;
  const sessionId = idFromParams || settingsManager.state.userId;
  const shareLink = `${location.origin}/play/join/${sessionId}`;
  const firebaseSession = useFirebaseSession(sessionId);
  const firebaseSessionInfo = firebaseSession.state.firebaseSession?.info;
  const firebaseScene = firebaseSession.state.firebaseSession?.scene;

  const sceneManager = useScene();
  const sessionManager = useSession({
    userId: settingsManager.state.userId,
    charactersManager: charactersManager,
  });

  /**
   * Session Sync
   */
  useEffect(() => {
    if (isGM) {
      firebaseSession.actions.putSessionInfo(sessionManager.state.session);
    }
  }, [sessionManager.state.session]);
  useEffect(() => {
    if (isPlayer && firebaseSessionInfo) {
      sessionManager.actions.setSession(firebaseSessionInfo);
    }
  }, [firebaseSessionInfo]);

  /**
   * Scene Sync
   */
  useEffect(() => {
    if (isGM) {
      firebaseSession.actions.putScene(sceneManager.state.scene);
    }
  }, [sceneManager.state.scene]);
  useEffect(() => {
    if (isPlayer && firebaseScene) {
      sceneManager.actions.setScene(firebaseScene);
    }
  }, [firebaseScene]);

  const sceneName = sceneManager.state.scene?.name ?? "";
  const pageTitle = useMemo(() => {
    return previewContentEditable({ value: sceneName });
  }, [sceneName]);

  // const hostManager = usePeerHost({
  //   onConnectionDataReceive(id: string, peerAction: IPeerActions) {
  //     if (peerAction.action === "roll") {
  //       sessionManager.actions.updatePlayerRoll(id, peerAction.payload);
  //     }
  //     if (peerAction.action === "update-main-point-counter") {
  //       sessionManager.actions.updatePlayerCharacterMainPointCounter(
  //         id,
  //         peerAction.payload.points,
  //         peerAction.payload.maxPoints
  //       );
  //     }
  //     if (peerAction.action === "played-in-turn-order") {
  //       sessionManager.actions.updatePlayerPlayedDuringTurn(
  //         id,
  //         peerAction.payload
  //       );
  //     }
  //     if (peerAction.action === "update-character") {
  //       sessionManager.actions.updatePlayerCharacter(id, peerAction.payload);
  //     }
  //     if (peerAction.action === "load-character") {
  //       sessionManager.actions.loadPlayerCharacter(id, peerAction.payload);
  //     }
  //     if (peerAction.action === "pause") {
  //       sessionManager.actions.pause();
  //     }
  //     if (peerAction.action === "update-index-card") {
  //       sceneManager.actions.updateIndexCard(
  //         peerAction.payload.indexCard,
  //         "public"
  //       );
  //     }
  //   },
  //   debug: debug,
  // });
  // const connectionsManager = usePeerConnections({
  //   onHostDataReceive(newData) {
  //     sceneManager.actions.overrideScene(newData.scene);
  //     sessionManager.actions.overrideSession(newData.session);
  //   },
  //   debug: debug,
  // });

  // const shareLink = `${location.origin}/play/${hostManager.state.hostId}`;
  // const shouldRenderPlayerJoinGameScreen =
  //   !isGM && !connectionsManager!.state.isConnectedToHost;

  // useEffect(() => {
  //   hostManager.actions.sendToConnections({
  //     scene: sceneManager.state.scene,
  //     session: sessionManager.state.session,
  //   });
  // }, [sceneManager.state.scene, sessionManager.state.session]);

  // useEffect(() => {
  //   if (isGM) {
  //     sessionManager.actions.updatePlayersWithConnections(
  //       hostManager.state.connections
  //     );
  //   }
  // }, [hostManager.state.connections]);

  useEffect(() => {
    if (isGM) {
      logger.track("play_online_game", {
        as: "gm",
      });
    } else {
      logger.track("play_online_game", {
        as: "player",
      });
    }
  }, []);

  return (
    <>
      <PageMeta
        title={pageTitle || t("home-route.play-online.title")}
        description={t("home-route.play-online.description")}
      />
      <>
        <Session
          mode={SceneMode.PlayOnline}
          sessionManager={sessionManager}
          sceneManager={sceneManager}
          connectionsManager={undefined as any}
          isLoading={false}
          idFromParams={idFromParams}
          shareLink={shareLink}
          userId={settingsManager.state.userId}
          error={undefined}
        />
      </>
    </>
  );
};

PlayRoute.displayName = "PlayRoute";
export default PlayRoute;
