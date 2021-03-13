import { useTheme } from "@material-ui/core/styles";
import { useThemeFromColor } from "../useThemeFromColor/useThemeFromColor";

export function useHighlight() {
  const theme = useTheme();
  const firstColor =
    theme.palette.type === "light" ? theme.palette.primary.main : "#405582";
  const secondColor =
    theme.palette.type === "light" ? theme.palette.primary.dark : "#05235d";
  const background = `${firstColor} linear-gradient(45deg,${firstColor},${secondColor})`;
  const color = theme.palette.getContrastText(firstColor);
  const highlightTheme = useThemeFromColor(
    theme.palette.getContrastText(firstColor)
  );
  const hover = "#b1cbff";
  return { highlightTheme: highlightTheme, background, color, hover };
}
