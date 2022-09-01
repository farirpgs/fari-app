import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { useEvent } from "../../../../hooks/useEvent/useEvent";
import { IMessage, MessageType, useChat } from "./useChat";

export function Chat(props: {
  chatManager: ReturnType<typeof useChat>;
  userId: string;
  onMessageSubmit: (message: IMessage) => void;
}) {
  const { chatManager } = props;
  const theme = useTheme();

  const handleOnMessage = useEvent((messageString) => {
    // TODO: parse other types of messages
    props.onMessageSubmit({
      type: MessageType.Text,
      value: messageString,
      fromUserId: props.userId,
    });
  });

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: "1 0 auto",
        }}
      />
      <Box
        sx={{
          padding: ".5rem 1rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {chatManager.state.chat.messages.map((message, i) => {
          const isMe = message.fromUserId === props.userId;
          return (
            <>
              <Box
                sx={{
                  background: isMe
                    ? theme.palette.primary.main
                    : theme.palette.action.hover,
                  color: isMe ? theme.palette.primary.contrastText : "inherit",
                  marginBottom: ".5rem",
                  padding: ".5rem",
                  borderRadius: "1rem",
                  maxWidth: "50%",
                  // minWidth: "4rem",
                  alignSelf: isMe ? "flex-end" : "flex-start",
                }}
              >
                {message.value}
              </Box>
            </>
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
        props.onMessageStringSubmit(value);
        setValue("");
      }}
    >
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <IconButton type="submit">
              <SendIcon />
            </IconButton>
          ),
        }}
        placeholder="Message"
        fullWidth
        variant="standard"
      />
    </form>
  );
}
