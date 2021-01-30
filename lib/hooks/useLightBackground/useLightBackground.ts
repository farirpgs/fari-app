import { darken, lighten, useTheme } from "@material-ui/core/styles";

export function useLightBackground() {
  const theme = useTheme();
  const lightBackground =
    theme.palette.type === "light"
      ? lighten(theme.palette.secondary.light, 0.85)
      : darken(theme.palette.secondary.light, 0.75);

  return lightBackground;
}
