import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Scene, SceneMode } from "../../components/Scene/Scene";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { ScenesContext } from "../../contexts/SceneContext/ScenesContext";
import { useScene } from "../../hooks/useScene/useScene";
import { useSession } from "../../hooks/useScene/useSession";
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
  });
  const sceneName = sceneManager.state.scene?.name ?? "";
  const sessionManager = useSession({
    userId: userId,
    charactersManager: charactersManager,
  });
  const pageTitle = previewContentEditable({ value: sceneName });
  const history = useHistory();
  const logger = useLogger();
  const myBinderManager = useContext(MyBinderContext);

  useEffect(() => {
    logger.info("Route:Scene");
  }, []);

  useEffect(() => {
    const sceneToLoad = scenesManager.state.scenes.find(
      (s) => s.id === props.match.params.id
    );

    if (sceneToLoad) {
      sceneManager.actions.loadScene(sceneToLoad, false);
    } else {
      history.replace("/");
      myBinderManager.actions.open({ folder: "scenes" });
    }
  }, [props.match.params.id, scenesManager.state.scenes]);

  return (
    <>
      <PageMeta title={pageTitle} />
      <Scene
        mode={SceneMode.Manage}
        sessionManager={sessionManager}
        sceneManager={sceneManager}
        scenesManager={scenesManager}
        charactersManager={charactersManager}
        myBinderManager={myBinderManager}
      />
    </>
  );
};

SceneRoute.displayName = "SceneRoute";
export default SceneRoute;
