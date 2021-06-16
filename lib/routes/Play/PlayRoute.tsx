import {
  createClient,
  LiveblocksProvider,
  RoomProvider,
  useErrorListener,
  useMyPresence,
  useOthers,
} from "@liveblocks/react";
import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { SceneMode, Session } from "../../components/Scene/Scene";
import { env } from "../../constants/env";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { Id } from "../../domains/Id/Id";
import { IPlayer } from "../../hooks/useScene/IScene";
import { useScene } from "../../hooks/useScene/useScene";
import { useSession } from "../../hooks/useScene/useSession";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

const client = createClient({
  authEndpoint: async (room) => {
    const test = env.isDev ? "test=true" : "";
    const result = await axios.get(
      `/.netlify/functions/auth?room=${room}${test}`
    );
    return result.data.liveblocks.token;
  },
});

function PlayRouteProvider(props: { roomId?: string }) {
  const isGM = !props.roomId;
  const [roomId] = useState(() => {
    return props.roomId || Id.generate();
  });

  const defaultPresence: IPlayer = {
    id: Id.generate(),
    playerName: isGM ? "Game Master" : "Player",
    rolls: [],
    playedDuringTurn: false,
    points: "3",
    isGM: isGM,
    npcs: [],
  };

  return (
    <LiveblocksProvider client={client}>
      <RoomProvider
        id={roomId}
        defaultPresence={() => {
          return defaultPresence as any;
        }}
      >
        <PlayRoute roomId={roomId} />
      </RoomProvider>
    </LiveblocksProvider>
  );
}

export function PlayRoute(props: { roomId: string }) {
  const isGM = !!props.roomId;
  const shareLink = `${location.origin}/play/${props.roomId}`;

  const { t } = useTranslate();
  const logger = useLogger();

  const settingsManager = useContext(SettingsContext);
  const charactersManager = useContext(CharactersContext);

  const [myPresence, updateMyPresence] = useMyPresence();

  const others = useOthers();
  const othersPresence = others
    .map((o) => {
      if (!o.presence) {
        return null;
      }
      return o.presence;
    })
    .filter((presence) => !!presence);
  const everyone = [myPresence, ...othersPresence] as unknown as Array<IPlayer>;
  const count = everyone.length;
  const gm = everyone.find((presence) => {
    return presence.isGM;
  });

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     updateMyPresence({
  //       count: (myPresence?.count ?? 0) + 1,
  //     });
  //   }, 2000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [myPresence]);

  console.debug(
    JSON.stringify(
      {
        count: count,
        myPresence,
        others: others.toArray(),
        everyone,
      },
      null,
      2
    )
  );
  useErrorListener((err) => {
    console.error("LiveBlocks:Error", err);
  });

  const sceneManager = useScene();
  const sessionManager = useSession({
    userId: settingsManager.state.userId,
    charactersManager: charactersManager,
  });

  const sceneName = sceneManager.state.scene?.name ?? "";
  const pageTitle = useMemo(() => {
    return previewContentEditable({ value: sceneName });
  }, [sceneName]);

  // const shouldRenderPlayerJoinGameScreen =
  //   !isGM && !connectionsManager!.state.isConnectedToHost;

  // useEffect(() => {
  //   hostManager.actions.sendToConnections({
  //     scene: sceneManager.state.scene,
  //     session: sessionManager.state.session,
  //   });
  // }, [sceneManager.state.scene, sessionManager.state.session]);

  // useEffect(() => {
  //   if (isGM) {
  //     sessionManager.actions.updatePlayersWithConnections(
  //       hostManager.state.connections
  //     );
  //   }
  // }, [hostManager.state.connections]);

  useEffect(() => {
    if (isGM) {
      logger.info("Route:Play");
      logger.info("Route:Play:GM");
    } else {
      logger.info("Route:Play");
      logger.info("Route:Play:Player");
    }
  }, []);

  return (
    <>
      <PageMeta
        title={pageTitle || t("home-route.play-online.title")}
        description={t("home-route.play-online.description")}
      />
      <Session
        mode={SceneMode.PlayOnline}
        sessionManager={sessionManager}
        sceneManager={sceneManager}
        isGM={isGM}
        roomId={props.roomId}
        shareLink={shareLink}
        userId={settingsManager.state.userId}
      />
    </>
  );
}

PlayRoute.displayName = "PlayRoute";
export default PlayRouteProvider;
