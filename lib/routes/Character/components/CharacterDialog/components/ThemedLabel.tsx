import { BoxProps, Typography } from "@mui/material";
import React, { useContext } from "react";
import { MiniThemeContext } from "../MiniThemeContext";

export function ThemedLabel(props: {
  sx?: BoxProps["sx"];
  children: React.ReactNode;
}) {
  const miniTheme = useContext(MiniThemeContext);

  return (
    <Typography
      display="inline"
      fontSize={"1.2rem"}
      sx={{
        fontFamily: miniTheme.labelFontFamily,
        fontSize: `${miniTheme.labelFontSize}rem`,
        fontWeight: miniTheme.labelFontWeight,
        ...props.sx,
      }}
    >
      {props.children}
    </Typography>
  );
}
