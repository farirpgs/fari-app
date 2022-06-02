import { LiveObject } from "@liveblocks/client";
import {
  useBroadcastEvent,
  useEventListener,
  useObject,
  useRoom,
  useStorage,
} from "@liveblocks/react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Session } from "../../components/Scene/Scene";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { useScene } from "../../hooks/useScene/useScene";
import {
  useSession,
  useSessionCharacterSheets,
} from "../../hooks/useScene/useSession";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import {
  IPlayersPresenceRef,
  PlayersPresence,
} from "./components/PlayersPresence/PlayersPresence";
import {
  SessionPresenceUpdaterContext,
  useSessionPresenceUpdater,
} from "./contexts/SessionPresenceContext";
import {
  IPlayerInteraction,
  PlayerInteractionFactory,
} from "./types/IPlayerInteraction";

type ConnectionState =
  | "closed"
  | "authenticating"
  | "unavailable"
  | "failed"
  | "open"
  | "connecting";

export function useLiveObject<T>(props: {
  key: string;
  value: T;
  isOwner: boolean;
  canBeEmpty?: boolean;
  onChange(newValue: T): void;
}) {
  const liveObject = useObject<T>(props.key);
  const [root] = useStorage();

  const room = useRoom();

  useEffect(() => {
    if (props.isOwner) {
      root?.set(props.key, new LiveObject({}));
    }
  }, [root]);

  useEffect(() => {
    if (props.isOwner) {
      liveObject?.update(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    function onLiveObjectChange() {
      const isSubscriber = !props.isOwner;
      const object = liveObject?.toObject();
      const objectKeys = Object.keys(object ?? {});
      if (isSubscriber && object) {
        if (props.canBeEmpty || objectKeys.length > 0) {
          props.onChange(object as T);
        }
      }
    }

    onLiveObjectChange();

    if (liveObject == null) {
      return;
    }

    return room.subscribe(liveObject, onLiveObjectChange);
  }, [liveObject]);

  return liveObject;
}

export const PlayRoute: React.FC<{
  match: {
    params: { id?: string };
  };
}> = (props) => {
  const logger = useLogger();
  const { t } = useTranslate();
  const room = useRoom();
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
  const [connectionState, setConnectionState] = useState<ConnectionState>();
  const [connectionStateSnackBarOpen, setConnectionStateSnackBarOpen] =
    useState(false);

  const sceneManager = useScene();
  const sessionManager = useSession({
    userId: userId,
  });
  const sessionCharactersManager = useSessionCharacterSheets({
    userId: userId,
    charactersManager: charactersManager,
  });

  const sceneName = sceneManager.state.scene?.name ?? "";
  const pageTitle = useMemo(() => {
    return previewContentEditable({ value: sceneName });
  }, [sceneName]);
  const me = sessionManager.computed.me;
  const myCharacter =
    sessionCharactersManager.state.characterSheets[me?.id ?? ""];
  const myCharacterName = myCharacter?.name ?? "";

  const sessionPresenceUpdater = useSessionPresenceUpdater({
    characterName: myCharacterName,
    playerName: me?.playerName,
    color: me?.color,
  });

  useLiveObject({
    key: "session",
    isOwner: isGM,
    value: sessionManager.state.session,
    onChange: (newValue) => {
      sessionManager.actions.overrideSession(newValue);
    },
  });

  useLiveObject({
    key: "scene",
    isOwner: isGM,
    value: sceneManager.state.scene,
    onChange: (newValue) => {
      sceneManager.actions.overrideScene(newValue);
    },
  });

  useLiveObject({
    key: "characters",
    isOwner: isGM,
    canBeEmpty: true,
    value: sessionCharactersManager.state.characterSheets,
    onChange: (newValue) => {
      sessionCharactersManager.actions.overrideCharacterSheets(newValue);
    },
  });

  const broadcast = useBroadcastEvent();

  useEventListener<IPlayerInteraction>(({ event }) => {
    console.log(`Received player interaction: ${event.type}`, event);
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
      sessionManager.actions.updatePlayerPoints(
        event.payload.id,
        event.payload.points
      );
      sessionCharactersManager.actions.updatePlayerCharacterMainPointCounter(
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
      sessionCharactersManager.actions.updatePlayerCharacter(
        event.payload.id,
        event.payload.character
      );
    }
    if (event.type === "update-index-card") {
      sceneManager.actions.updateIndexCard(
        event.payload.indexCard,
        event.payload.indexCardType
      );
    }
    if (event.type === "ping") {
      broadcast(PlayerInteractionFactory.pong(), {
        shouldQueueEventIfNotReady: true,
      });
    }
  });

  function handlePlayerInteraction(interaction: IPlayerInteraction) {
    console.log(`Sending player interaction: ${interaction.type}`, interaction);
    broadcast(
      {
        type: interaction.type,
        payload: interaction.payload,
      },
      {
        shouldQueueEventIfNotReady: true,
      }
    );
  }

  useEffect(() => {
    if (playerName) {
      handlePlayerInteraction(
        PlayerInteractionFactory.addPlayer(userId, playerName)
      );
    }
  }, [playerName]);

  useEffect(() => {
    const unsubscribe = room.subscribe("connection", (status) => {
      setConnectionState(status);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setConnectionStateSnackBarOpen(true);
    const timeout = setTimeout(() => {
      setConnectionStateSnackBarOpen(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [connectionState]);

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

  function getAlertSevirityColor(connectionState: ConnectionState | undefined) {
    if (connectionState === "closed") {
      return "error";
    }
    if (connectionState === "failed") {
      return "error";
    }
    if (connectionState === "unavailable") {
      return "error";
    }
    if (connectionState === "authenticating") {
      return "info";
    }
    if (connectionState === "connecting") {
      return "info";
    }
    if (connectionState === "open") {
      return "success";
    }
    return "info";
  }

  const playersPresenceRef = useRef<IPlayersPresenceRef>(null);
  return (
    <>
      <PageMeta
        title={pageTitle || t("home-route.play-online.title")}
        description={t("home-route.play-online.description")}
      />
      <>
        <Snackbar
          open={connectionStateSnackBarOpen && !!connectionState}
          autoHideDuration={5000}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Alert severity={getAlertSevirityColor(connectionState)}>
            Connection: {connectionState}
          </Alert>
        </Snackbar>
        <SessionPresenceUpdaterContext.Provider value={sessionPresenceUpdater}>
          <PlayersPresence ref={playersPresenceRef} />
        </SessionPresenceUpdaterContext.Provider>
        <Session
          sessionManager={sessionManager}
          sessionCharactersManager={sessionCharactersManager}
          sceneManager={sceneManager}
          isLoading={false}
          idFromParams={idFromParams}
          shareLink={shareLink}
          userId={settingsManager.state.userId}
          error={undefined}
          onPlayerInteraction={handlePlayerInteraction}
          onOpenChat={playersPresenceRef.current?.openChat}
        />
      </>
    </>
  );
};

PlayRoute.displayName = "PlayRoute";
export default PlayRoute;
