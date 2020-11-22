import { createMuiTheme, ThemeOptions } from "@material-ui/core/styles";

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
      contained: {
        fontWeight: 700,
      },
      outlined: {
        fontWeight: 700,
      },
    },
    MuiButtonGroup: {
      root: {
        borderRadius: "20px",
      },
    },
  },
};

export const AppLightTheme = createMuiTheme({
  ...defaultThemeConfiguration,
  palette: {
    primary: { main: "#415f9c" },
    secondary: { main: "#415f9c" },
  },
});

export const AppDarkTheme = createMuiTheme({
  ...defaultThemeConfiguration,
  palette: {
    type: "dark",
    primary: {
      main: "#a5c1ff",
    },
    secondary: {
      main: "#a5c1ff",
    },
  },
});
