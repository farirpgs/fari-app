import { fade } from "@material-ui/core/styles/colorManipulator";
import useTheme from "@material-ui/core/styles/useTheme";
import { useMemo } from "react";

const whiteVariants = ["#fff", "#ffffff", "#FFF", "#FFFFFF", "white"];

export function useTextColors(backgroundColor: string) {
  const theme = useTheme();
  const textColors = useMemo(() => {
    const color = theme.palette.getContrastText(backgroundColor);
    const isWhite = whiteVariants.some(
      (whiteVariant) => whiteVariant === color
    );

    if (isWhite) {
      return {
        primary: color,
        secondary: fade(color, 0.74),
        disabled: fade(color, 0.38),
      };
    }
    return {
      primary: fade(color, 0.87),
      secondary: fade(color, 0.6),
      disabled: fade(color, 0.38),
    };
  }, [theme, backgroundColor]);

  return textColors;
}
