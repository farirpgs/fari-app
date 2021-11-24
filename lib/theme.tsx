import {
  createTheme,
  responsiveFontSizes,
  ThemeOptions,
} from "@mui/material/styles";
import { FontFamily } from "./constants/FontFamily";

export const defaultThemeConfiguration: ThemeOptions = {
  typography: {
    // default 300
    fontWeightLight: 400,
    // default 400
    fontWeightRegular: 400,
    // default 500
    fontWeightMedium: 600,
    // default 700
    fontWeightBold: 700,
    fontFamily: FontFamily.Default,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@global": {},
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          whiteSpace: "pre-wrap",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
        },
        contained: {
          fontWeight: 700,
        },
        outlined: {
          "fontWeight": 700,
          "&:hover": {
            // theme.shadows[1],
            boxShadow:
              "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
          },
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
        },
      },
    },
  },
};
// https://mycolor.space/?hex=%23415F9B&sub=1
export const AppLightTheme = responsiveFontSizes(
  createTheme({
    ...defaultThemeConfiguration,
    palette: {
      primary: { main: "#415f9c" },
      secondary: { main: "#7891D2" },
    },
  })
);

export const AppDarkTheme = responsiveFontSizes(
  createTheme({
    ...defaultThemeConfiguration,
    palette: {
      mode: "dark",
      background: {
        default: "#212121",
        // paper: "#424242",
        paper: "#333333",
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
