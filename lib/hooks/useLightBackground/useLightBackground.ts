import { useTheme } from "@mui/material/styles";

export function useLightBackground() {
  const theme = useTheme();
  // const lightBackground =
  //   theme.palette.mode === "light"
  //     ? lighten(theme.palette.primary.light, 0.85)
  //     : darken(theme.palette.primary.light, 0.75);
  const lightBackground =
    theme.palette.mode === "light" ? "#eff2f9" : "#272c34";

  return lightBackground;
}
