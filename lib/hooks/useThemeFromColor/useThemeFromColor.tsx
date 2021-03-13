import { responsiveFontSizes } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import produce from "immer";
import { useMemo } from "react";
import { defaultThemeConfiguration } from "../../theme";

export function useThemeFromColor(color: string) {
  const buttonTheme = useMemo(() => {
    const options = produce(defaultThemeConfiguration, (draft) => {
      draft.palette = { primary: { main: color } };
    });
    return responsiveFontSizes(createMuiTheme(options));
  }, [color]);

  return buttonTheme;
}
