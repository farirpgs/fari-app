import { css } from "@emotion/css";
import { useMyPresence } from "@liveblocks/react";
import React, { useEffect, useState } from "react";
import { PlayCursorMode } from "../../consts/PlayCursorMode";
import {
  useMyWindowLiveCursor,
  useWindowLiveCursors,
} from "../../hooks/useWindowLiveCursors";
import { IPlayerCursorState } from "../../types/IPlayerCursorState";
import { IPlayerPresence } from "../../types/IPlayerPresence";
import CursorWithMessage from "../CursorWithMessage/CursorWithMessage";

export function PlayersPresence(props: { children: React.ReactNode }) {
  const [cursorState, setCursorState] = useState<IPlayerCursorState>({
    mode: PlayCursorMode.Hidden,
  });
  const [presence, updateMyPresence] = useMyPresence<IPlayerPresence>();
  const myWindowCursor = useMyWindowLiveCursor();
  const windowCursors = useWindowLiveCursors();

  useEffect(() => {
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "/") {
        setCursorState((prev) => ({
          ...prev,
          mode: PlayCursorMode.Chat,
          message: "",
          rollOutput: null,
        }));
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "", rollOutput: null });
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
  }, [updateMyPresence]);

  return (
    <div
      className={css({
        label: "PlayersPresence",
        position: "relative",
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

      {props.children}
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
            color={presence?.color}
            x={myWindowCursor.x}
            y={myWindowCursor.y}
            label={presence?.characterName || presence.playerName}
            message={cursorState.message}
            rollOutput={cursorState.rollOutput}
            onMessageChange={(message) => {
              updateMyPresence({ message: message });
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
              const message = "";
              updateMyPresence({ message: message, rollOutput: rollOutput });
              setCursorState((prev) => ({
                ...prev,
                mode: PlayCursorMode.Chat,
                message: message,
                rollOutput: rollOutput,
              }));
            }}
          />
        )}
      </>
    );
  }
}
