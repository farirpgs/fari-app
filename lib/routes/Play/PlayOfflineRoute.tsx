import React from "react";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { useCharacters } from "../Characters/hooks/useCharacters";
import { PlayPage } from "./PlayPage";
import { sanitizeSceneName, useScene } from "./useScene/useScene";
import { useUserId } from "./useUserId/useUserId";

const debug = false;

export const PlayOfflineRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const idFromParams = props.match.params.id;
  const userId = useUserId();
  const characterManager = useCharacters();
  const sceneManager = useScene(userId, idFromParams, characterManager);
  const sceneName = sceneManager.state.scene.name;
  const pageTitle = sanitizeSceneName(sceneName);

  const { t } = useTranslate();

  return (
    <>
      <PageMeta
        title={pageTitle || t("home-route.play-offline.title")}
        description={t("home-route.play-offline.description")}
      ></PageMeta>
      <PlayPage
        sceneManager={sceneManager}
        characterManager={characterManager}
        isLoading={false}
        idFromParams={idFromParams}
        shareLink={undefined}
        userId={userId}
        error={undefined}
      ></PlayPage>
    </>
  );
};

PlayOfflineRoute.displayName = "PlayOfflineRoute";
