import React, { useContext } from "react";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Scene, SceneMode } from "../../components/Scene/Scene";
import { CharactersContext } from "../../contexts/CharactersContext";
import { ScenesContext } from "../../contexts/ScenesContext";
import { sanitizeSceneName, useScene } from "../../hooks/useScene/useScene";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { useUserId } from "../../hooks/useUserId/useUserId";

const debug = false;

export const PlayOfflineRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const userId = useUserId();
  const charactersManager = useContext(CharactersContext);
  const scenesManager = useContext(ScenesContext);
  const sceneManager = useScene({
    userId: userId,
    charactersManager: charactersManager,
    sceneToLoad: scenesManager.state.selectedScene,
  });
  const sceneName = sceneManager.state.scene.name;
  const pageTitle = sanitizeSceneName(sceneName);

  const { t } = useTranslate();

  return (
    <>
      <PageMeta
        title={pageTitle || t("home-route.play-offline.title")}
        description={t("home-route.play-offline.description")}
      />
      <Scene
        mode={SceneMode.PlayOffline}
        sceneManager={sceneManager}
        scenesManager={scenesManager}
        charactersManager={charactersManager}
      />
    </>
  );
};

PlayOfflineRoute.displayName = "PlayOfflineRoute";
