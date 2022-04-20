import { useTheme } from "@mui/material/styles";

export function useLightBackground() {
  const theme = useTheme();
  const lightBackground =
    theme.palette.mode === "light" ? "#eff2f9" : "#272c34";

  return lightBackground;
}
