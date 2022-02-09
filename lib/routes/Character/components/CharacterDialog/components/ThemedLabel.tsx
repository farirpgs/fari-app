import { css, cx } from "@emotion/css";
import Typography from "@mui/material/Typography";
import React, { useContext } from "react";
import { MiniThemeContext } from "../MiniThemeContext";

export function ThemedLabel(props: {
  className?: string;
  children: React.ReactNode;
}) {
  const miniTheme = useContext(MiniThemeContext);

  return (
    <Typography
      display="inline"
      fontSize={"1.2rem"}
      className={cx(
        props.className,
        css({
          fontFamily: miniTheme.labelFontFamily,
          fontSize: `${miniTheme.labelFontSize}rem`,
          fontWeight: miniTheme.labelFontWeight,
        })
      )}
    >
      {props.children}
    </Typography>
  );
}
