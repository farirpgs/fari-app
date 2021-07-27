import { responsiveFontSizes, adaptV4Theme, createTheme } from "@material-ui/core/styles";
import produce from "immer";
import { useMemo } from "react";
import { defaultThemeConfiguration } from "../../theme";
import { whiteVariants } from "../useTextColors/useTextColors";

export type PaletteType = "light" | "dark";

export function useThemeFromColor(color: string, type?: PaletteType) {
  const buttonTheme = useMemo(() => {
    const options = produce(defaultThemeConfiguration, (draft) => {
      draft.palette = { primary: { main: color } };
      const defaultType = whiteVariants.includes(color) ? "dark" : "light";
      const typeToUse = type ?? defaultType;
      draft.palette.mode = typeToUse;
    });
    return responsiveFontSizes(createTheme(adaptV4Theme(options)));
  }, [color]);

  return buttonTheme;
}
