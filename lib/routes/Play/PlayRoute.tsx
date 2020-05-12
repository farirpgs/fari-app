import React, { useEffect } from "react";
import { IDiceRoll } from "../../domains/dice/IDiceRoll";
import { usePeerConnections as usePeerConnection } from "../../hooks/usePeerJS/usePeerConnection";
import { usePeerHost } from "../../hooks/usePeerJS/usePeerHost";
import { PlayPage } from "./PlayPage";
import { useScene } from "./useScene/useScene";
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

  const hostManager = usePeerHost({
    onConnectionDataReceive(id: string, roll: IDiceRoll) {
      sceneManager.actions.updatePlayerRoll(id, roll);
    },
    debug: debug,
  });
  const connectionsManager = usePeerConnection({
    onHostDataReceive(newScene) {
      sceneManager.actions.setScene(newScene);
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
    <PlayPage
      sceneManager={sceneManager}
      connectionsManager={connectionsManager}
      isLoading={hostManager.state.loading || connectionsManager.state.loading}
      idFromParams={idFromParams}
      shareLink={shareLink}
      userId={userId}
      error={hostManager.state.error}
    ></PlayPage>
  );
};

PlayRoute.displayName = "PlayRoute";
