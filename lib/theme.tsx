import { createMuiTheme, ThemeOptions } from "@material-ui/core";
import { blue, indigo } from "@material-ui/core/colors";

export const defaultThemeConfiguration: ThemeOptions = {
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

export const AppLightTheme = createMuiTheme({
  ...defaultThemeConfiguration,
  palette: {
    primary: indigo,
    secondary: blue,
  },
});

export const AppDarkTheme = createMuiTheme({
  ...defaultThemeConfiguration,
  palette: {
    type: "dark",
    primary: {
      main: indigo[200],
    },
    secondary: {
      main: blue[200],
    },
  },
});
