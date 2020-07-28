import { throttle } from "lodash";
import React, { useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Scene, SceneMode } from "../../components/Scene/Scene";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import {
  ScenesContext,
  ScenesManagerMode,
} from "../../contexts/SceneContext/ScenesContext";
import { IScene } from "../../hooks/useScene/IScene";
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
  const sceneManager = useScene({
    userId: userId,
    charactersManager: charactersManager,
    sceneToLoad: scenesManager.state.selectedScene,
  });
  const sceneName = sceneManager.state.scene.name;
  const pageTitle = sanitizeSceneName(sceneName);
  const history = useHistory();
  const { t } = useTranslate();

  useEffect(() => {
    const sceneToLoad = scenesManager.state.scenes.find(
      (s) => s.id === props.match.params.id
    );

    if (sceneToLoad) {
      scenesManager.actions.select(sceneToLoad);
    } else {
      history.replace("/");
      scenesManager.actions.openManager(ScenesManagerMode.Redirect);
    }
  }, [props.match.params.id, scenesManager.state.scenes]);

  const updateScene = useRef(
    throttle((scene: IScene) => {
      scenesManager.actions.upsert(scene);
    }, 3000)
  );

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
