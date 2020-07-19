import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Scene, SceneMode } from "../../components/Scene/Scene";
import { CharactersContext } from "../../contexts/CharactersContext";
import { ScenesContext, ScenesManagerMode } from "../../contexts/ScenesContext";
import { sanitizeSceneName, useScene } from "../../hooks/useScene/useScene";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { useUserId } from "../../hooks/useUserId/useUserId";

export const SceneRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const userId = useUserId();
  const charactersManager = useContext(CharactersContext);
  const scenesManager = useContext(ScenesContext);
  const sceneManager = useScene(userId, undefined, charactersManager);
  const sceneName = sceneManager.state.scene.name;
  const pageTitle = sanitizeSceneName(sceneName);
  const history = useHistory();
  const { t } = useTranslate();

  useEffect(() => {
    const sceneToLoad = scenesManager.state.scenes.find(
      (s) => s.id === props.match.params.id
    );

    if (sceneToLoad) {
      sceneManager.actions.loadScene(sceneToLoad);
    } else {
      history.replace("/");
      scenesManager.actions.openManager(ScenesManagerMode.Redirect);
    }
  }, [props.match.params.id]);

  return (
    <>
      <PageMeta
        title={pageTitle || t("scenes-route.meta.title")}
        description={t("scenes-route.meta.description")}
      />
      <Scene
        mode={SceneMode.Manage}
        sceneManager={sceneManager}
        scenesManager={scenesManager}
        charactersManager={charactersManager}
      />
    </>
  );
};

SceneRoute.displayName = "ScenesRoute";
