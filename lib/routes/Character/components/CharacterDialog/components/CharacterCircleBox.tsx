import { css, cx } from "@emotion/css";
import Box, { BoxProps } from "@material-ui/core/Box";
import useTheme from "@material-ui/core/styles/useTheme";
import React from "react";
import { useLightBackground } from "../../../../../hooks/useLightBackground/useLightBackground";

export const CharacterCircleBox: React.FC<
  BoxProps & {
    clickable?: boolean;
    selected?: boolean;
    borderRadius?: string;
    borderStyle?: string;
  }
> = (props) => {
  const {
    className,
    clickable,
    selected,
    borderRadius,
    borderStyle = "solid",
    ...rest
  } = props;
  const theme = useTheme();
  const hoverBackground =
    theme.palette.type === "light" ? "#e4e4e4" : "#6b6b6b";
  const hoverColor = theme.palette.getContrastText(hoverBackground);
  const lightBackground = useLightBackground();
  return (
    <Box
      {...rest}
      className={cx(
        css({
          "label": "character-circle-box",
          "background": !selected
            ? theme.palette.background.paper
            : lightBackground,
          "color": !selected
            ? theme.palette.getContrastText(theme.palette.background.paper)
            : theme.palette.getContrastText(lightBackground),
          "border": `2px ${borderStyle} ${
            selected ? theme.palette.primary.main : "#bdbdbd"
          }`,
          "boxShadow": selected ? theme.shadows[6] : undefined,
          "transition": theme.transitions.create([
            "color",
            "background",
            "border",
            "boxShadow",
          ]),
          "borderRadius": borderRadius ?? "24px",
          "display": "flex",
          "alignItems": "center",
          "justifyContent": "center",
          "cursor": !clickable ? "inherit" : "pointer",
          "&:hover": {
            color: !clickable || selected ? undefined : hoverColor,
            background: !clickable || selected ? undefined : hoverBackground,
          },
        }),
        className
      )}
    >
      <Box p=".5rem" minWidth="50%" textAlign="center">
        {props.children}
      </Box>
    </Box>
  );
};
CharacterCircleBox.displayName = "CharacterCircleBox";
