import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React from "react";
import { ContentEditable } from "../../../../components/ContentEditable/ContentEditable";
import { useZIndex } from "../../../../constants/zIndex";
import { ThemedLabel } from "../../../Character/components/CharacterDialog/components/ThemedLabel";
import {
  MiniThemeContext,
  useMiniTheme,
} from "../../../Character/components/CharacterDialog/MiniThemeContext";
import { DefaultPlayerColor } from "../../consts/PlayerColors";

export default function CursorWithMessage(props: {
  color: string | undefined;
  x: number;
  y: number;
  message?: string;
  previousMessage?: string | null;
  readonly?: boolean;
  label: string | undefined;
  onMessageChange?(message: string): void;
  onClose?(): void;
}) {
  const zIndex = useZIndex();
  const theme = useTheme();
  const color = props.color || DefaultPlayerColor;
  const miniTheme = useMiniTheme({
    enforceBackground: color,
  });
  const textColor = theme.palette.getContrastText(color);

  const shouldRenderMessage = props.message || !props.readonly;
  return (
    <MiniThemeContext.Provider value={miniTheme}>
      <div
        className={css({
          label: "CursorWithMessage",
          position: "absolute",
          pointerEvents: "none",
          top: "-10px",
          left: "-10px",
          zIndex: zIndex.cursor,
        })}
        style={{
          transition: "transform 0.5s cubic-bezier(.17,.93,.38,1)",
          transform: `translateX(${props.x}px) translateY(${props.y}px)`,
        }}
      >
        {props.readonly && (
          <svg
            className={css({
              position: "relative",
              width: "4rem",
              height: "4rem",
            })}
            width="24"
            height="36"
            viewBox="0 0 24 36"
            fill="none"
            stroke="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
              fill={props.color}
            />
          </svg>
        )}

        <Grow in={!!shouldRenderMessage}>
          <div
            className={css({
              position: "absolute",
              top: "2rem",
              left: "1.5rem",
              padding: "1rem",
            })}
            style={{ backgroundColor: props.color, borderRadius: 4 }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: "flex",
                  color: textColor,
                }}
              >
                {props.label}
              </Typography>
            </Box>
            <ThemedLabel
              className={css({
                fontSize: "1.5rem",
              })}
            >
              <ContentEditable
                autoFocus
                className={css({
                  color: textColor,
                  background: "transparent",
                  outline: "none",
                  minWidth: "12rem",
                })}
                noDelay
                value={props.message || ""}
                onChange={(message) => {
                  props.onMessageChange?.(message);
                }}
                border
                borderColor={textColor}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // setCursorState({
                    //   mode: CursorMode.Chat,
                    //   previousMessage: cursorState.message,
                    //   message: "",
                    // });
                  } else if (e.key === "Escape") {
                    props.onClose?.();
                  }
                }}
                readonly={props.readonly}
                placeholder={props.previousMessage ? "" : "Say something…"}
                // maxLength={50}
              />
            </ThemedLabel>
            {!props.readonly && (
              <Typography
                sx={{
                  color: textColor,
                }}
                variant="caption"
              >
                {"ESC to cancel."}
              </Typography>
            )}
          </div>
        </Grow>
      </div>
    </MiniThemeContext.Provider>
  );
}
