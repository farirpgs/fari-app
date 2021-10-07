import {
  useBroadcastEvent,
  useEventListener,
  useObject,
} from "@liveblocks/react";
import React, { useContext, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Session } from "../../components/Scene/Scene";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { useScene } from "../../hooks/useScene/useScene";
import { useSession } from "../../hooks/useScene/useSession";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import {
  IPlayerInteraction,
  PlayerInteractionFactory,
} from "./types/IPlayerInteraction";

export function useLiveBlockObject<T>(props: {
  key: string;
  value: T;
  isGM: boolean;
  onChange(newValue: T): void;
}) {
  const object = useObject<T>(props.key);

  useEffect(() => {
    if (props.isGM) {
      object?.update(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    syncSessionForPlayer();
    object?.subscribe(syncSessionForPlayer);
    return () => {
      object?.unsubscribe(syncSessionForPlayer);
    };

    function syncSessionForPlayer() {
      const isPlayer = !props.isGM;
      if (isPlayer && object) {
        props.onChange(object.toObject() as T);
      }
    }
  }, [object]);

  return object;
}

export const PlayRoute: React.FC<{
  match: {
    params: { id?: string };
  };
}> = (props) => {
  const logger = useLogger();
  const { t } = useTranslate();
  const settingsManager = useContext(SettingsContext);
  const charactersManager = useContext(CharactersContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const idFromParams = props.match.params.id;
  const playerName = query.get("name");
  const isGM = !idFromParams;
  const isPlayer = !isGM;
  const userId = settingsManager.state.userId;
  const sessionId = isPlayer ? idFromParams : userId;
  const shareLink = `${window.location.origin}/play/join/${sessionId}`;

  const sceneManager = useScene();
  const sessionManager = useSession({
    userId: userId,
    charactersManager: charactersManager,
  });

  useLiveBlockObject({
    key: "session",
    isGM: isGM,
    value: sessionManager.state.session,
    onChange: (newValue) => {
      sessionManager.actions.overrideSession(newValue);
    },
  });

  useLiveBlockObject({
    key: "scene",
    isGM: isGM,
    value: sceneManager.state.scene,
    onChange: (newValue) => {
      sceneManager.actions.overrideScene(newValue);
    },
  });

  const broadcast = useBroadcastEvent();

  useEventListener<IPlayerInteraction>(({ connectionId, event }) => {
    if (event.type === "pause") {
      sessionManager.actions.pause();
    }
    if (event.type === "update-player-roll") {
      sessionManager.actions.updatePlayerRoll(
        event.payload.id,
        event.payload.roll
      );
    }
    if (event.type === "add-player") {
      sessionManager.actions.addPlayer(event.payload.player);
    }
    if (event.type === "update-player-points") {
      sessionManager.actions.updatePlayerCharacterMainPointCounter(
        event.payload.id,
        event.payload.points,
        event.payload.maxPoints
      );
    }
    if (event.type === "update-player-played-during-turn") {
      sessionManager.actions.updatePlayerPlayedDuringTurn(
        event.payload.id,
        event.payload.playedDuringTurn
      );
    }
    if (event.type === "update-player-character") {
      sessionManager.actions.updatePlayerCharacter(
        event.payload.id,
        event.payload.character
      );
    }
  });

  function handlePlayerInteraction(interaction: IPlayerInteraction) {
    broadcast({
      type: interaction.type,
      payload: interaction.payload,
    });
  }

  useEffect(() => {
    if (playerName) {
      handlePlayerInteraction(
        PlayerInteractionFactory.addPlayer(userId, playerName)
      );
    }
  }, [playerName]);

  const sceneName = sceneManager.state.scene?.name ?? "";
  const pageTitle = useMemo(() => {
    return previewContentEditable({ value: sceneName });
  }, [sceneName]);

  useEffect(() => {
    if (isGM) {
      logger.track("play_online_game", {
        as: "gm",
      });
    } else {
      logger.track("play_online_game", {
        as: "player",
      });
    }
  }, []);

  return (
    <>
      <PageMeta
        title={pageTitle || t("home-route.play-online.title")}
        description={t("home-route.play-online.description")}
      />
      <>
        <Session
          sessionManager={sessionManager}
          sceneManager={sceneManager}
          isLoading={false}
          idFromParams={idFromParams}
          shareLink={shareLink}
          userId={settingsManager.state.userId}
          error={undefined}
          onPlayerInteraction={handlePlayerInteraction}
        />
      </>
    </>
  );
};

PlayRoute.displayName = "PlayRoute";
export default PlayRoute;
