import { fade } from "@material-ui/core/styles/colorManipulator";
import useTheme from "@material-ui/core/styles/useTheme";
import { useMemo } from "react";

export const whiteVariants = ["#fff", "#ffffff", "#FFF", "#FFFFFF", "white"];

export function useTextColors(backgroundColor: string) {
  const theme = useTheme();

  const textColors = useMemo(() => {
    const color = theme.palette.getContrastText(backgroundColor);
    const isContrastWhite = whiteVariants.some(
      (whiteVariant) => whiteVariant === color
    );

    if (isContrastWhite) {
      return {
        bgColor: backgroundColor,
        primary: color,
        secondary: fade(color, 0.74),
        disabled: fade(color, 0.38),
        type: "dark" as const,
      };
    }
    return {
      bgColor: backgroundColor,
      primary: fade(color, 0.87),
      secondary: fade(color, 0.6),
      disabled: fade(color, 0.38),
      type: "light" as const,
    };
  }, [theme, backgroundColor]);

  return textColors;
}
