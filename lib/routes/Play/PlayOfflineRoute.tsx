import React from "react";
import { PlayPage } from "./PlayPage";
import { useScene } from "./useScene/useScene";
import { useUserId } from "./useUserId/useUserId";

const debug = false;

export const PlayOfflineRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const idFromParams = props.match.params.id;
  const userId = useUserId();
  const sceneManager = useScene(userId, idFromParams);

  return (
    <PlayPage
      sceneManager={sceneManager}
      isLoading={false}
      idFromParams={idFromParams}
      shareLink={undefined}
      userId={userId}
      error={undefined}
    ></PlayPage>
  );
};

PlayOfflineRoute.displayName = "PlayOfflineRoute";
