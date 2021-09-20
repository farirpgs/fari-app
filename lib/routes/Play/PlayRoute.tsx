import React, { useContext, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Session } from "../../components/Scene/Scene";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { useFirebaseSession } from "../../hooks/useFirebaseSession/useFirebaseSession";
import { useScene } from "../../hooks/useScene/useScene";
import { useSession } from "../../hooks/useScene/useSession";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { IPlayerInteraction } from "./types/IPlayerInteraction";

export const PlayRoute: React.FC<{
  match: {
    params: { id?: string };
  };
}> = (props) => {
  const logger = useLogger();
  const { t } = useTranslate();
  const settingsManager = useContext(SettingsContext);
  const charactersManager = useContext(CharactersContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const idFromParams = props.match.params.id;
  const playerName = query.get("name");
  const isGM = !idFromParams;
  const isPlayer = !isGM;
  const userId = settingsManager.state.userId;
  const sessionId = isPlayer ? idFromParams : userId;
  const shareLink = `${window.location.origin}/play/join/${sessionId}`;
  const firebaseSession = useFirebaseSession(sessionId);
  const sessionInfoFromFirebase = firebaseSession.state.firebaseSession?.info;
  const sceneFromFirebase = firebaseSession.state.firebaseSession?.scene;

  const sceneManager = useScene();
  const sessionManager = useSession({
    userId: userId,
    charactersManager: charactersManager,
  });

  function handlePlayerInteraction(interaction: IPlayerInteraction) {
    firebaseSession.actions.put(interaction.type, interaction.payload);
  }

  useEffect(() => {
    clearScene();
    addPlayerWhenReady();

    function clearScene() {
      if (firebaseSession.state.ready && isGM) {
        firebaseSession.actions.clearScene();
      }
    }

    function addPlayerWhenReady() {
      if (firebaseSession.state.ready && playerName) {
        firebaseSession.actions.addPlayer(userId, playerName);
      }
    }
  }, [firebaseSession.state.ready, isGM]);

  /**
   * Session Sync
   */
  useEffect(() => {
    if (isGM) {
      firebaseSession.actions.putSessionInfo(sessionManager.state.session);
    }
  }, [sessionManager.state.session]);
  useEffect(() => {
    // if (isPlayer) {
    sessionManager.actions.overrideSession(sessionInfoFromFirebase);
    // }
  }, [sessionInfoFromFirebase]);

  /**
   * Scene Sync
   */
  useEffect(() => {
    if (isGM) {
      firebaseSession.actions.putScene(sceneManager.state.scene);
    }
  }, [sceneManager.state.scene]);
  useEffect(() => {
    // if (isPlayer) {
    sceneManager.actions.overrideScene(sceneFromFirebase);
    // }
  }, [sceneFromFirebase]);

  const sceneName = sceneManager.state.scene?.name ?? "";
  const pageTitle = useMemo(() => {
    return previewContentEditable({ value: sceneName });
  }, [sceneName]);

  // const hostManager = usePeerHost({
  //   onConnectionDataReceive(id: string, peerAction: IPeerActions) {
  //     if (peerAction.action === "update-character") {
  //       sessionManager.actions.updatePlayerCharacter(id, peerAction.payload);
  //     }
  //     if (peerAction.action === "load-character") {
  //       sessionManager.actions.loadPlayerCharacter(id, peerAction.payload);
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
          sessionManager={sessionManager}
          sceneManager={sceneManager}
          isLoading={false}
          idFromParams={idFromParams}
          shareLink={shareLink}
          userId={settingsManager.state.userId}
          error={undefined}
          onPlayerInteraction={handlePlayerInteraction}
        />
      </>
    </>
  );
};

PlayRoute.displayName = "PlayRoute";
export default PlayRoute;

// connectionsManager?.actions.sendToHost<IPeerActions>({
//   action: "load-character",
//   payload: character,
// });
// connectionsManager?.actions.sendToHost<IPeerActions>({
//   action: "load-character",
//   payload: copy,
// });
// connectionsManager?.actions.sendToHost<IPeerActions>({
//   action: "roll",
//   payload: result,
// });
// connectionsManager?.actions.sendToHost<IPeerActions>({
//   action: "roll",
//   payload: result,
// });

// connectionsManager?.actions.sendToHost<IPeerActions>({
//   action: "update-character",
//   payload: updatedCharacter,
// });
// connectionsManager?.actions.sendToHost<IPeerActions>({
//   action: "played-in-turn-order",
//   payload: playedInTurnOrder,
// });

// connectionsManager?.actions.sendToHost<IPeerActions>({
//   action: "update-main-point-counter",
//   payload: { points, maxPoints },
// });
