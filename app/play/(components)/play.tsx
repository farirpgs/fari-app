"use client";
import { useParams } from "next/navigation";

import { useContext } from "react";
import { SettingsContext } from "../../../lib/contexts/SettingsContext/SettingsContext";
import { JoinAGameRoute } from "../../../lib/routes/Play/JoinAGameRoute";
import { PlayRoute } from "../../../lib/routes/Play/PlayRoute";
import { RoomProvider } from "../../../lib/services/liveblocks/liveblocks.config";

export function Play() {
  const params = useParams();

  const settingsManager = useContext(SettingsContext);
  const idFromParams = params.id as string;
  const userId = settingsManager.state.userId;

  return (
    <RoomProvider
      id={idFromParams || userId}
      initialPresence={{
        rollOutput: null,
        characterName: null,
        color: null,
        cursor: null,
        message: null,
        playerName: null,
      }}
    >
      <PlayRoute></PlayRoute>
    </RoomProvider>
  );
}

export function Join() {
  const params = useParams();

  const settingsManager = useContext(SettingsContext);
  const idFromParams = params.id as string;
  const userId = settingsManager.state.userId;

  return (
    <RoomProvider
      id={idFromParams || userId}
      initialPresence={{
        rollOutput: null,
        characterName: null,
        color: null,
        cursor: null,
        message: null,
        playerName: null,
      }}
    >
      <JoinAGameRoute></JoinAGameRoute>
    </RoomProvider>
  );
}
