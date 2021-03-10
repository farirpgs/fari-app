import { createMuiTheme, ThemeOptions } from "@material-ui/core/styles";
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
      "@global": {},
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
// https://mycolor.space/?hex=%23415F9B&sub=1
export const AppLightTheme = responsiveFontSizes(
  createMuiTheme({
    ...defaultThemeConfiguration,
    palette: {
      primary: { main: "#415f9c" },
      secondary: { main: "#7891D2" },
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
        main: "#b1cbff",
      },
      secondary: {
        main: "#7891D2",
      },
    },
  })
);
