import { css, cx } from "@emotion/css";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useContext } from "react";
import { CharacterSheetThemeContext } from "../CharacterSheetThemeContext";

export function ThemedLabel(props: {
  className?: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const characterSheetTheme = useContext(CharacterSheetThemeContext);

  return (
    <Typography
      display="inline"
      fontSize={"1.2rem"}
      className={cx(
        props.className,
        css({
          fontFamily: characterSheetTheme.labelFontFamily,
          fontSize: `${characterSheetTheme.labelFontSize}rem`,
          fontWeight: characterSheetTheme.labelFontWeight,
        })
      )}
    >
      {props.children}
    </Typography>
  );
}
