import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ChatMessageParser } from "../../../../domains/chat/ChatMessageParser";
import { useEvent } from "../../../../hooks/useEvent/useEvent";
import { DiceRollerMessage } from "../DiceRollMessage/DiceRollMessage";
import { IMessageToSend, IRollMessage, MessageType, useChat } from "./useChat";

export function Chat(props: {
  chatManager: ReturnType<typeof useChat>;
  userId: string;
  playersNameMapping: Record<string, string | undefined>;
  onMessageSubmit(message: IMessageToSend): void;
  onReadAllMessages(): void;
}) {
  const { chatManager } = props;
  const theme = useTheme();
  const $chatScrollBoxRef = React.useRef<HTMLDivElement>(null);

  const [chatValueForced, setChatValueForced] = useState("");
  const [commandToPopIndex, setCommandtoPopIndex] = React.useState(-1);
  const commandHistory = props.chatManager.state.chat.messages
    .filter((e) => {
      const isRollCommand = e.type === MessageType.Roll && !!e.value.command;
      const isFromMe = e.fromUserId === props.userId;
      return isRollCommand && isFromMe;
    })
    .reverse() as Array<IRollMessage>;
  const uniqueCommandHistory = commandHistory.filter(
    (current, index, self) =>
      self.findIndex((t) => t.value.command === current.value.command) ===
      index,
  );

  const handleOnMessage = useEvent((messageString) => {
    const message = ChatMessageParser.parse({
      message: messageString,
    });
    setCommandtoPopIndex(-1);
    setChatValueForced("");
    if (message) {
      props.onMessageSubmit(message);
    }
  });

  const handleRollHistoryPrevious = useEvent(() => {
    const newIndex = Math.min(
      commandToPopIndex + 1,
      uniqueCommandHistory.length - 1,
    );
    const poppedCommand = uniqueCommandHistory[newIndex] as IRollMessage;

    if (poppedCommand) {
      const commandText = poppedCommand.value.command;
      if (commandText) {
        setChatValueForced?.(`/roll ${commandText}`);
      } else {
        setChatValueForced?.("");
      }
    } else {
      setChatValueForced?.("");
    }
    setCommandtoPopIndex(newIndex);
  });

  const handleRollHistoryNext = useEvent(() => {
    const newIndex = Math.max(commandToPopIndex - 1, -1);
    const poppedCommand = uniqueCommandHistory[newIndex] as IRollMessage;
    if (poppedCommand) {
      const commandText = poppedCommand.value.command;
      if (commandText) {
        setChatValueForced?.(`/roll ${commandText}`);
      } else {
        setChatValueForced?.("");
      }
    } else {
      setChatValueForced?.("");
    }
    setCommandtoPopIndex(newIndex);
  });

  useEffect(() => {
    props.onReadAllMessages();
  });

  useEffect(() => {
    if ($chatScrollBoxRef.current) {
      $chatScrollBoxRef.current.scrollTop =
        $chatScrollBoxRef.current.scrollHeight;
    }
  }, [props.chatManager.state.chat.messages.length]);

  return (
    <Box
      sx={{
        height: "100%",
        maxHeight: {
          xs: "65vh",
          sm: "65vh",
          md: "inherit",
        },
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box
        ref={$chatScrollBoxRef}
        sx={{
          padding: ".5rem 1rem",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "auto",
        }}
      >
        {chatManager.state.chat.messages.map((message, i) => {
          const isMe = message.fromUserId === props.userId;
          const nextMessage = chatManager.state.chat.messages[i + 1];
          const nextMessageUserId = nextMessage?.fromUserId;
          const nextMessagePlayerName =
            props.playersNameMapping[nextMessageUserId];
          const playerName = props.playersNameMapping[message.fromUserId];
          const shouldDisplayPlayerName = nextMessagePlayerName !== playerName;

          return (
            <Box
              key={i}
              sx={{
                marginLeft: isMe ? "auto" : undefined,
                marginRight: !isMe ? "auto" : undefined,
                maxWidth: "70%",
                marginBottom: ".25rem",
              }}
            >
              <Box
                sx={{
                  background: isMe
                    ? theme.palette.primary.main
                    : theme.palette.action.hover,
                  color: isMe
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                  padding: ".5rem .75rem",
                  display: "block",
                  borderRadius: "1rem",
                }}
              >
                {message.type === MessageType.Text && (
                  <Typography
                    sx={{
                      overflowWrap: "break-word",
                    }}
                  >
                    {message.value}
                  </Typography>
                )}
                {message.type === MessageType.Roll && (
                  <Box>
                    <DiceRollerMessage dark={isMe} message={message.value} />
                  </Box>
                )}
              </Box>
              {shouldDisplayPlayerName && (
                <Box sx={{}}>
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      textAlign: isMe ? "right" : "left",
                    }}
                  >
                    {playerName ?? "--"}
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          padding: ".5rem 1rem",
          borderTop: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.paper,
        }}
      >
        <ChatMessageInput
          value={chatValueForced}
          onMessageStringSubmit={handleOnMessage}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              e.stopPropagation();
              handleRollHistoryPrevious();
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              e.stopPropagation();
              handleRollHistoryNext();
            }
          }}
        />
      </Box>
    </Box>
  );
}

function ChatMessageInput(props: {
  value: string;
  onMessageStringSubmit(messageString: string): void;
  onKeyDown?(event: React.KeyboardEvent<HTMLDivElement>): void;
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value) {
          props.onMessageStringSubmit(value);
          setValue("");
        }
      }}
    >
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        InputProps={{
          disableUnderline: true,
          autoFocus: true,
          autoComplete: "off",
          endAdornment: (
            <IconButton type="submit">
              <SendIcon />
            </IconButton>
          ),
        }}
        onKeyDown={props.onKeyDown}
        placeholder="Message"
        fullWidth
        variant="standard"
      />
    </form>
  );
}
