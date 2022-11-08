import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { ChatMessageParser } from "../../../../domains/chat/ChatMessageParser";
import { useEvent } from "../../../../hooks/useEvent/useEvent";
import { IMessageToSend, MessageType, useChat } from "./useChat";

export function Chat(props: {
  chatManager: ReturnType<typeof useChat>;
  userId: string;
  playersNameMapping: Record<string, string | undefined>;
  onMessageSubmit: (message: IMessageToSend) => void;
}) {
  const { chatManager } = props;
  const theme = useTheme();
  const $chatScrollBoxRef = React.useRef<HTMLDivElement>(null);

  const handleOnMessage = useEvent((messageString) => {
    const message = ChatMessageParser.parse({
      message: messageString,
    });
    if (message) {
      props.onMessageSubmit(message);
    }
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
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box />
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
          const playerName = props.playersNameMapping[message.fromUserId];

          return (
            <React.Fragment key={i}>
              <Box
                sx={{
                  alignSelf: isMe ? "flex-end" : "flex-start",

                  maxWidth: "70%",
                }}
              >
                <Box
                  sx={{
                    background: isMe
                      ? theme.palette.primary.main
                      : theme.palette.action.hover,
                    color: isMe
                      ? theme.palette.primary.contrastText
                      : "inherit",
                    padding: ".5rem .75rem",
                    display: "block",
                    borderRadius: "1rem",
                  }}
                >
                  {message.type === MessageType.Text && message.value}
                  {message.type === MessageType.Roll && (
                    <Box sx={{}}>
                      {message.value.label && (
                        <Box>
                          <Typography
                            component={"div"}
                            variant="caption"
                            fontWeight="bold"
                            textAlign={"center"}
                          >
                            {message.value.label}
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "2rem",
                          }}
                          variant="caption"
                        >
                          {message.value.total}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="caption">
                          {message.value.text}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  marginBottom: ".75rem",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    textAlign: isMe ? "right" : "left",
                  }}
                >
                  {playerName ?? "--"}
                </Typography>
              </Box>
            </React.Fragment>
          );
        })}
      </Box>
      <Box
        sx={{
          padding: ".5rem 1rem",
          background: "#efefef",
        }}
      >
        <ChatMessageInput onMessageStringSubmit={handleOnMessage} />
      </Box>
    </Box>
  );
}

function ChatMessageInput(props: {
  onMessageStringSubmit: (messageString: string) => void;
}) {
  const [value, setValue] = useState("");

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
        onKeyDown={(e) => {
          e.stopPropagation();
          // e.preventDefault();
        }}
        placeholder="Message"
        fullWidth
        variant="standard"
      />
    </form>
  );
}
