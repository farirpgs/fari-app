import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import produce from "immer";
import { useMemo } from "react";
import { defaultThemeConfiguration } from "../../theme";

export function useThemeFromColor(color: string) {
  const buttonTheme = useMemo(() => {
    const options = produce(defaultThemeConfiguration, (draft) => {
      draft.palette = { primary: { main: color } };
    });
    return createMuiTheme(options);
  }, [color]);

  return buttonTheme;
}
