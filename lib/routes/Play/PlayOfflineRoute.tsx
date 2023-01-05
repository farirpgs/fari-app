import React, { useContext, useEffect } from "react";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { useScene } from "../../hooks/useScene/useScene";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { useChat } from "./components/Chat/useChat";
import { Session } from "./components/Session/Session";
import {
  useSession,
  useSessionCharacterSheets,
} from "./components/Session/useSession";

export const PlayOfflineRoute: React.FC<{}> = () => {
  const settingsManager = useContext(SettingsContext);
  const charactersManager = useContext(CharactersContext);

  const sceneManager = useScene();
  const sessionManager = useSession({
    userId: settingsManager.state.userId,
  });
  const chatManager = useChat();
  const sessionCharactersManager = useSessionCharacterSheets({
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
        userId={settingsManager.state.userId}
        sessionManager={sessionManager}
        sessionCharactersManager={sessionCharactersManager}
        sceneManager={sceneManager}
        chatManager={chatManager}
      />
    </>
  );
};

PlayOfflineRoute.displayName = "PlayOfflineRoute";
export default PlayOfflineRoute;
