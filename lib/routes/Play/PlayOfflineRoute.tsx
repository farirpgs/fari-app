import React, { useContext, useEffect } from "react";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Scene, SceneMode } from "../../components/Scene/Scene";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { ScenesContext } from "../../contexts/SceneContext/ScenesContext";
import { useScene } from "../../hooks/useScene/useScene";
import { useSession } from "../../hooks/useScene/useSession";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { useUserId } from "../../hooks/useUserId/useUserId";

export const PlayOfflineRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = () => {
  const userId = useUserId();
  const charactersManager = useContext(CharactersContext);
  const scenesManager = useContext(ScenesContext);

  const sceneManager = useScene({
    userId: userId,
    charactersManager: charactersManager,
  });
  const myBinderManager = useContext(MyBinderContext);
  const sessionManager = useSession({
    userId: userId,
    charactersManager: charactersManager,
  });
  const sceneName = sceneManager.state.scene?.name ?? "";
  const pageTitle = previewContentEditable({ value: sceneName });

  const logger = useLogger();

  useEffect(() => {
    logger.info("Route:PlayOffline");
  }, []);

  const { t } = useTranslate();

  return (
    <>
      <PageMeta
        title={pageTitle || t("home-route.play-offline.title")}
        description={t("home-route.play-offline.description")}
      />
      <Scene
        mode={SceneMode.PlayOffline}
        sessionManager={sessionManager}
        sceneManager={sceneManager}
        scenesManager={scenesManager}
        charactersManager={charactersManager}
        myBinderManager={myBinderManager}
      />
    </>
  );
};

PlayOfflineRoute.displayName = "PlayOfflineRoute";
export default PlayOfflineRoute;
