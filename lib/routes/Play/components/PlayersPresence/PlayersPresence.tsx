import Box from "@mui/material/Box";
import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useZIndex } from "../../../../constants/zIndex";
import { useMyPresence } from "../../../../services/liveblocks/liveblocks.config";
import { PlayCursorMode } from "../../consts/PlayCursorMode";
import { SessionPresenceUpdaterContext } from "../../contexts/SessionPresenceContext";
import {
  useMyWindowLiveCursor,
  useWindowLiveCursors,
} from "../../hooks/useWindowLiveCursors";
import {
  IPlayerCursorRollOutput,
  IPlayerCursorState,
} from "../../types/IPlayerCursorState";
import { IMessageToSend, IRollMessage } from "../Chat/useChat";
import CursorWithMessage from "../CursorWithMessage/CursorWithMessage";

export type IPlayersPresenceRef = {
  openChat: () => void;
};

export const PlayersPresence = React.forwardRef(
  (
    props: {
      onMessageSubmit?(messageToSend: IMessageToSend): void;
    },
    ref,
  ) => {
    const [cursorState, setCursorState] = useState<IPlayerCursorState>({
      mode: PlayCursorMode.Hidden,
    });
    const sessionPresenceUpdater = useContext(SessionPresenceUpdaterContext);

    const [presence] = useMyPresence();
    const myWindowCursor = useMyWindowLiveCursor();
    const windowCursors = useWindowLiveCursors();
    const zIndex = useZIndex();

    useImperativeHandle(ref, () => {
      return { openChat: handleOpenChat };
    });

    useEffect(() => {
      function onKeyUp(e: KeyboardEvent) {
        const hasADialogOpened = !!document.querySelector(
          ".MuiDialog-container",
        );

        if (e.key === "Escape") {
          if (cursorState.mode === PlayCursorMode.Hidden && !hasADialogOpened) {
            handleOpenChat();
          } else {
            handleCloseChat();
          }
        }
      }

      window.addEventListener("keyup", onKeyUp);

      return () => {
        window.removeEventListener("keyup", onKeyUp);
      };
    }, []);

    function handleCloseChat() {
      sessionPresenceUpdater.actions.updateMyPresence({
        message: "",
        rollOutput: null,
      });
      setCursorState({ mode: PlayCursorMode.Hidden });
    }

    function handleOpenChat() {
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
    }

    return (
      <>
        <Box
          sx={{
            label: "PlayersPresence",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: zIndex.cursor,
          }}
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
        </Box>
      </>
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
              onMessageSubmit={(messageToSend) => {
                if (messageToSend.type === "roll") {
                  const rollMessage = messageToSend as IRollMessage;
                  const rollOutput: IPlayerCursorRollOutput = {
                    text: rollMessage.value.text,
                    total: rollMessage.value.total,
                  };
                  sessionPresenceUpdater.actions.updateRollOutput(rollOutput);
                  setCursorState((prev) => ({
                    ...prev,
                    mode: PlayCursorMode.Chat,
                    message: "",
                    rollOutput: rollOutput,
                  }));
                }

                props.onMessageSubmit?.(messageToSend);
              }}
            />
          )}
        </>
      );
    }
  },
);
