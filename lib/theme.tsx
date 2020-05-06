import { createMuiTheme, ThemeOptions } from "@material-ui/core";
import { blue, indigo } from "@material-ui/core/colors";

export const defaultThemeConfiguration: ThemeOptions = {
  palette: {
    primary: indigo,
    secondary: blue,
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "system-ui",
      "BlinkMacSystemFont",
      "'Segoe UI'",
      "Roboto",
      "'Helvetica Neue'",
      "Ubuntu",
      "Arial",
      "sans-serif",
    ].join(","),
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: "20px",
      },
    },
  },
};
export const AppTheme = createMuiTheme(defaultThemeConfiguration);
