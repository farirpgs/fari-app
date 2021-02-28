import { createMuiTheme, ThemeOptions } from "@material-ui/core/styles";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";

const systemFonts = [
  "-apple-system",
  "system-ui",
  "BlinkMacSystemFont",
  "'Segoe UI'",
  "Roboto",
  "'Helvetica Neue'",
  "Ubuntu",
  "Arial",
  "sans-serif",
];

export const defaultThemeConfiguration: ThemeOptions = {
  typography: {
    // default 300
    fontWeightLight: 400,
    // default 400
    fontWeightRegular: 400,
    // default 500
    fontWeightMedium: 400,
    // default 700
    fontWeightBold: 700,
    fontFamily: [
      "Inter",
      "HelveticaNeue",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "@media print": {
          "@page": {
            size: "A2",
          },
          "body": {
            minWidth: "1200px",
          },
        },
      },
    },
    MuiButton: {
      root: {
        borderRadius: "7px",
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

export const AppLightTheme = responsiveFontSizes(
  createMuiTheme({
    ...defaultThemeConfiguration,
    palette: {
      primary: { main: "#415f9c" },
      secondary: { main: "#7a8cb4" },
    },
  })
);

export const AppDarkTheme = responsiveFontSizes(
  createMuiTheme({
    ...defaultThemeConfiguration,
    palette: {
      type: "dark",
      background: {
        default: "#222222",
        paper: "#303030",
      },
      primary: {
        main: lighten(AppLightTheme.palette.primary.main, 0.5),
      },
      secondary: {
        main: lighten(AppLightTheme.palette.secondary.main, 0.2),
      },
    },
  })
);
