import { createContext, useEffect } from "react";
import { useUpdateMyPresence } from "../../../services/liveblocks/liveblocks.config";
import { IPlayerCursorRollOutput } from "../types/IPlayerCursorState";

export type ISessionPresenceUpdater = ReturnType<
  typeof useSessionPresenceUpdater
>;

export const SessionPresenceUpdaterContext =
  createContext<ISessionPresenceUpdater>(undefined as any);

export function useSessionPresenceUpdater(props: {
  color: string | null | undefined;
  playerName: string | null | undefined;
  characterName: string | null | undefined;
}) {
  const updateMyPresence = useUpdateMyPresence();

  useEffect(() => {
    updateMyPresence({
      color: props.color || null,
      playerName: props.playerName || null,
      characterName: props.characterName || null,
    });
  }, [props.color, props.playerName, props.characterName]);

  function updateMessage(message: string) {
    updateMyPresence({
      message: message,
    });
  }

  function updateRollOutput(rollOutput: IPlayerCursorRollOutput | null) {
    updateMyPresence({
      message: "",
      rollOutput: rollOutput,
    });
  }

  return {
    actions: {
      updateMessage: updateMessage,
      updateRollOutput: updateRollOutput,
      updateMyPresence: updateMyPresence,
    },
  };
}
