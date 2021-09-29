import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { SceneMode, Session } from "../../components/Scene/Scene";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { ScenesContext } from "../../contexts/SceneContext/ScenesContext";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { useScene } from "../../hooks/useScene/useScene";
import { useSession } from "../../hooks/useScene/useSession";

export const SceneRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const settingsManager = useContext(SettingsContext);
  const charactersManager = useContext(CharactersContext);
  const scenesManager = useContext(ScenesContext);
  const sceneManager = useScene();
  const sceneName = sceneManager.state.scene?.name ?? "";
  const sessionManager = useSession({
    userId: settingsManager.state.userId,
    charactersManager: charactersManager,
  });
  const pageTitle = previewContentEditable({ value: sceneName });
  const history = useHistory();
  const logger = useLogger();
  const myBinderManager = useContext(MyBinderContext);

  useEffect(() => {
    logger.track("view_scene");
  }, []);

  useEffect(() => {
    const sceneToLoad = scenesManager.state.scenes.find(
      (s) => s.id === props.match.params.id
    );

    if (sceneToLoad) {
      sceneManager.actions.loadScene(sceneToLoad);
    } else {
      history.replace("/");
      myBinderManager.actions.open({ folder: "scenes" });
    }
  }, [props.match.params.id, scenesManager.state.scenes]);

  return (
    <>
      <PageMeta title={pageTitle} />
      <Session
        mode={SceneMode.Manage}
        sessionManager={sessionManager}
        sceneManager={sceneManager}
      />
    </>
  );
};

SceneRoute.displayName = "SceneRoute";
export default SceneRoute;
