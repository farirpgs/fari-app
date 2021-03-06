import { css, cx } from "@emotion/css";
import Box, { BoxProps } from "@material-ui/core/Box";
import useTheme from "@material-ui/core/styles/useTheme";
import React from "react";

export const CharacterCircleBox: React.FC<
  BoxProps & { clickable?: boolean }
> = (props) => {
  const { className, clickable, ...rest } = props;
  const theme = useTheme();
  const hoverBackground =
    theme.palette.type === "light" ? "#e4e4e4" : "#6b6b6b";
  const hoverColor = theme.palette.getContrastText(hoverBackground);
  return (
    <Box
      {...rest}
      className={cx(
        css({
          "background": theme.palette.background.paper,
          "color": theme.palette.getContrastText(
            theme.palette.background.paper
          ),
          "border": "2px solid #bdbdbd",
          "borderRadius": "24px",
          "display": "flex",
          "alignItems": "center",
          "justifyContent": "center",
          "cursor": !clickable ? "inherit" : "pointer",
          "&:hover": {
            transition: theme.transitions.create(["color", "background"]),
            color: !clickable ? "inherit" : hoverColor,
            background: !clickable ? "inherit" : hoverBackground,
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
