import { LiveObject } from "@liveblocks/client";
import {
  useBroadcastEvent,
  useEventListener,
  useMutation,
  useRoom,
  useStatus,
  useStorage,
} from "@liveblocks/react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { useScene } from "../../hooks/useScene/useScene";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { IMessage, useChat } from "./components/Chat/useChat";
import {
  IPlayersPresenceRef,
  PlayersPresence,
} from "./components/PlayersPresence/PlayersPresence";
import { Session } from "./components/Session/Session";
import {
  useSession,
  useSessionCharacterSheets,
} from "./components/Session/useSession";
import {
  SessionPresenceUpdaterContext,
  useSessionPresenceUpdater,
} from "./contexts/SessionPresenceContext";
import {
  IPlayerInteraction,
  PlayerInteractionFactory,
} from "./types/IPlayerInteraction";

type ConnectionState =
  | "initial"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

export function useLiveObject<T>(props: {
  key: string;
  value: T;
  isOwner: boolean;
  canBeEmpty?: boolean;
  onChange(newValue: T): void;
}) {
  const isStorageLoaded = useStorage(() => true) ?? false;

  const liveData = useStorage((root) => root[props.key]);

  const initObject = useMutation(
    ({ storage }) => {
      if (!storage.get(props.key)) {
        storage.set(props.key, new LiveObject({}));
      }
    },
    [props.key]
  );

  const updateObject = useMutation(
    ({ storage }, newValue) => {
      storage.set(props.key, newValue as any);
    },
    [props.key]
  );

  useEffect(() => {
    if (props.isOwner && isStorageLoaded) {
      initObject();
    }
  }, [props.isOwner, initObject, isStorageLoaded]);

  useEffect(() => {
    if (props.isOwner && isStorageLoaded) {
      updateObject(props.value);
    }
  }, [props.isOwner, props.value, updateObject, isStorageLoaded]);

  useEffect(() => {
    const isSubscriber = !props.isOwner;
    const object = liveData;
    const objectKeys = Object.keys(object ?? {});

    if (isSubscriber && object) {
      if (props.canBeEmpty || objectKeys.length > 0) {
        props.onChange(object as unknown as T);
      }
    }
  }, [liveData, props.isOwner, props.canBeEmpty, props.onChange]);

  return liveData;
}

function PlayRoute() {
  const params = useParams<{ id: string }>();
  const logger = useLogger();
  const { t } = useTranslate();
  const room = useRoom();
  const settingsManager = useContext(SettingsContext);
  const charactersManager = useContext(CharactersContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const idFromParams = params.id;
  const playerName = query.get("name");
  const isGM = !idFromParams;
  const isPlayer = !isGM;
  const userId = settingsManager.state.userId;
  const sessionId = isPlayer ? idFromParams : userId;
  const shareLink = `${window.location.origin}/play/join/${sessionId}`;
  const connectionState = useStatus();
  const [connectionStateSnackBarOpen, setConnectionStateSnackBarOpen] =
    useState(false);

  const sceneManager = useScene();
  const chatManager = useChat();
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
    key: "chat",
    isOwner: isGM,
    value: chatManager.state.chat,
    onChange: (newValue) => {
      chatManager.actions.overrideChat(newValue);
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

  useEventListener((props) => {
    const event = props.event as IPlayerInteraction;
    console.log(`Received player interaction: ${event.type}`, event);

    if (event.type === "pause") {
      sessionManager.actions.pause();
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
    if (event.type === "update-player-status") {
      sessionManager.actions.updatePlayerStatus(
        event.payload.id,
        event.payload.status
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
    if (event.type === "send-message") {
      chatManager.actions.sendMessage(event.payload.message);
    }
    if (event.type === "ping") {
      broadcast(PlayerInteractionFactory.pong() as any, {
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
      } as any,
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

  function getAlertSevirityColor(connectionState: ConnectionState) {
    switch (connectionState) {
      case "disconnected":
        return "error";
      case "reconnecting":
        return "info";
      case "connecting":
      case "initial":
        return "info";
      case "connected":
        return "success";
      default:
        return "info";
    }
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
          <PlayersPresence
            ref={playersPresenceRef}
            onMessageSubmit={(messageToSend) => {
              if (messageToSend) {
                const message = {
                  type: messageToSend.type,
                  fromUserId: userId,
                  value: messageToSend.value,
                } as IMessage;

                if (isGM) {
                  chatManager.actions.sendMessage(message);
                } else {
                  handlePlayerInteraction(
                    PlayerInteractionFactory.sendMessage(message)
                  );
                }
              }
            }}
          />
        </SessionPresenceUpdaterContext.Provider>
        <Session
          chatManager={chatManager}
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
}

PlayRoute.displayName = "PlayRoute";
export default PlayRoute;
