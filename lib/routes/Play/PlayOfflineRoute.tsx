import React, { useContext, useEffect } from "react";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { SceneMode, Session } from "../../components/Scene/Scene";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { useScene } from "../../hooks/useScene/useScene";
import { useSession } from "../../hooks/useScene/useSession";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const PlayOfflineRoute: React.FC<{
  match: {
    params: { id?: string };
  };
}> = () => {
  const settingsManager = useContext(SettingsContext);
  const charactersManager = useContext(CharactersContext);

  const sceneManager = useScene();
  const sessionManager = useSession({
    userId: settingsManager.state.userId,
    charactersManager: charactersManager,
  });
  const sceneName = sceneManager.state.scene?.name ?? "";
  const pageTitle = previewContentEditable({ value: sceneName });

  const logger = useLogger();

  useEffect(() => {
    logger.track("play_offline_game");
  }, []);

  const { t } = useTranslate();

  return (
    <>
      <PageMeta
        title={pageTitle || t("home-route.play-offline.title")}
        description={t("home-route.play-offline.description")}
      />
      <Session
        mode={SceneMode.PlayOffline}
        sessionManager={sessionManager}
        sceneManager={sceneManager}
      />
    </>
  );
};

PlayOfflineRoute.displayName = "PlayOfflineRoute";
export default PlayOfflineRoute;
