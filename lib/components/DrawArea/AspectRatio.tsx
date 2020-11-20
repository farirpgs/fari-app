import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import React from "react";

export const AspectRatio: React.FC<{ widthPercent: number; ratio: number }> = (
  props
) => {
  // https://ratiobuddy.com/
  return (
    <Box
      className={css({
        "position": "relative",
        "width": `${props.widthPercent}%`,
        "margin": "0 auto",
        "maxWidth": "80vh",
        "&:before": {
          display: "block",
          content: '""',
          width: `${props.widthPercent}%`,
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
