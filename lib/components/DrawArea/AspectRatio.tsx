import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import React from "react";

export const AspectRatio: React.FC<{ width: number; ratio: number }> = (
  props
) => {
  // https://ratiobuddy.com/
  return (
    <Box
      className={css({
        "position": "relative",
        "&:before": {
          display: "block",
          content: '""',
          width: `${props.width}%`,
          paddingTop: `${props.ratio * 100}%`,
        },
      })}
    >
      <Box
        className={css({
          position: "absolute",
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
        })}
      >
        {props.children}
      </Box>
    </Box>
  );
};
AspectRatio.displayName = "AspectRatio";
