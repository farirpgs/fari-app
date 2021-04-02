import { responsiveFontSizes } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import produce from "immer";
import { useMemo } from "react";
import { defaultThemeConfiguration } from "../../theme";

export type PaletteType = "light" | "dark";

export function useThemeFromColor(color: string, type: PaletteType = "light") {
  const buttonTheme = useMemo(() => {
    const options = produce(defaultThemeConfiguration, (draft) => {
      draft.palette = { primary: { main: color } };
      draft.palette.type = type;
    });
    return responsiveFontSizes(createMuiTheme(options));
  }, [color]);

  return buttonTheme;
}
