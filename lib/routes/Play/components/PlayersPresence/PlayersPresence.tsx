import { css } from "@emotion/css";
import { useMyPresence } from "@liveblocks/react";
import React, { useContext, useEffect, useState } from "react";
import { useZIndex } from "../../../../constants/zIndex";
import { PlayCursorMode } from "../../consts/PlayCursorMode";
import { SessionPresenceUpdaterContext } from "../../contexts/SessionPresenceContext";
import {
  useMyWindowLiveCursor,
  useWindowLiveCursors,
} from "../../hooks/useWindowLiveCursors";
import { IPlayerCursorState } from "../../types/IPlayerCursorState";
import { IPlayerPresence } from "../../types/IPlayerPresence";
import CursorWithMessage from "../CursorWithMessage/CursorWithMessage";

export function PlayersPresence() {
  const [cursorState, setCursorState] = useState<IPlayerCursorState>({
    mode: PlayCursorMode.Hidden,
  });
  const sessionPresenceUpdater = useContext(SessionPresenceUpdaterContext);

  const [presence] = useMyPresence<IPlayerPresence>();
  const myWindowCursor = useMyWindowLiveCursor();
  const windowCursors = useWindowLiveCursors();
  const zIndex = useZIndex();

  useEffect(() => {
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "/") {
        setCursorState((prev) => {
          if (prev.mode === PlayCursorMode.Hidden) {
            return {
              ...prev,
              mode: PlayCursorMode.Chat,
              message: "",
              rollOutput: null,
            };
          } else {
            sessionPresenceUpdater.actions.updateMyPresence({
              message: "",
              rollOutput: null,
            });
            return { mode: PlayCursorMode.Hidden };
          }
        });
      } else if (e.key === "Escape") {
        sessionPresenceUpdater.actions.updateMyPresence({
          message: "",
          rollOutput: null,
        });
        setCursorState({ mode: PlayCursorMode.Hidden });
      }
    }

    window.addEventListener("keyup", onKeyUp);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "/") {
        e.preventDefault();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div
      className={css({
        label: "PlayersPresence",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: zIndex.cursor,
      })}
    >
      {windowCursors.map((cursor) => {
        return (
          <CursorWithMessage
            key={cursor.connectionId}
            label={
              cursor.presence?.characterName || cursor.presence?.playerName
            }
            color={cursor.presence?.color}
            message={cursor.presence?.message}
            rollOutput={cursor.presence?.rollOutput}
            x={cursor.x}
            y={cursor.y}
            readonly
          />
        );
      })}
      {renderMyMessage()}
    </div>
  );

  function renderMyMessage() {
    if (cursorState.mode !== PlayCursorMode.Chat) {
      return null;
    }

    return (
      <>
        {myWindowCursor && (
          <CursorWithMessage
            color={presence.color}
            x={myWindowCursor.x}
            y={myWindowCursor.y}
            label={presence.characterName || presence.playerName}
            message={cursorState.message}
            rollOutput={cursorState.rollOutput}
            onMessageChange={(message) => {
              sessionPresenceUpdater.actions.updateMessage(message);

              setCursorState((prev) => {
                const rollOutput =
                  prev.mode === PlayCursorMode.Chat ? prev.rollOutput : null;
                return {
                  ...prev,
                  mode: PlayCursorMode.Chat,
                  message: message,
                  rollOutput: rollOutput,
                };
              });
            }}
            onRollOutputChange={(rollOutput) => {
              sessionPresenceUpdater.actions.updateRollOutput(rollOutput);

              setCursorState((prev) => ({
                ...prev,
                mode: PlayCursorMode.Chat,
                message: "",
                rollOutput: rollOutput,
              }));
            }}
          />
        )}
      </>
    );
  }
}
