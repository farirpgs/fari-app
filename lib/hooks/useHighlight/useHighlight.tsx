import { useTheme } from "@mui/material/styles";
import { useThemeFromColor } from "../useThemeFromColor/useThemeFromColor";

export function useHighlight() {
  const theme = useTheme();
  const firstColor =
    theme.palette.mode === "light" ? theme.palette.primary.main : "#123379";
  const secondColor =
    theme.palette.mode === "light" ? theme.palette.primary.dark : "#05235d";

  const linearBackground = `${firstColor} linear-gradient(90deg,${secondColor},${firstColor})`;
  const radialBackground = `${firstColor} radial-gradient(${firstColor},${secondColor})`;
  const highlightTheme = useThemeFromColor(
    theme.palette.getContrastText(firstColor),
    "dark"
  );
  const color = highlightTheme.palette.text.primary;
  const hover = "#b1cbff";
  return {
    highlightTheme: highlightTheme,
    linearBackground,
    radialBackground,
    color,
    hover,
  };
}
