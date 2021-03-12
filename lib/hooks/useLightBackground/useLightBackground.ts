import { darken } from "@material-ui/core/styles/colorManipulator";
import useTheme from "@material-ui/core/styles/useTheme";

export function useLightBackground() {
  const theme = useTheme();
  // const lightBackground =
  //   theme.palette.type === "light"
  //     ? lighten(theme.palette.primary.light, 0.85)
  //     : darken(theme.palette.primary.light, 0.75);
  const lightBackground =
    theme.palette.type === "light"
      ? "#eff2f9"
      : darken(theme.palette.primary.light, 0.75);

  return lightBackground;
}
