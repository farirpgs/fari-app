import { Box, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { RollMessageValue } from "../Chat/useChat";

export function DiceRollerMessage(props: {
  message: RollMessageValue | undefined;
  dark?: boolean;
}) {
  const theme = useTheme();
  if (!props.message) {
    return null;
  }
  const color = props.dark
    ? theme.palette.getContrastText(theme.palette.text.primary)
    : theme.palette.text.primary;
  return (
    <Stack spacing={1} alignItems="center" sx={{}}>
      {props.message.label && (
        <Typography
          component="div"
          sx={{
            color: color,
            fontSize: "1rem",
            fontWeight: theme.typography.fontWeightBold,
            display: "block",
            textAlign: "center",
            textTransform: "uppercase",
            width: "100%",
          }}
        >
          {props.message.label}
        </Typography>
      )}
      <Typography
        component="div"
        sx={{
          color: color,
          fontSize: "2rem",
          display: "block",
          textAlign: "center",
          width: "100%",
        }}
      >
        {props.message.total}
        <Box
          sx={{
            color: color,
            borderBottom: `1px solid ${color}`,
            width: "80%",
            margin: "0 auto",
          }}
        />
      </Typography>

      <Typography
        component="div"
        sx={{
          color: color,
          fontSize: ".875rem",
          display: "block",
          textAlign: "center",
        }}
      >
        {props.message.text}
      </Typography>
    </Stack>
  );
}
