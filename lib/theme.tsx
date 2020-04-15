import { createMuiTheme } from "@material-ui/core";
import { blue, indigo } from "@material-ui/core/colors";

export const AppTheme = createMuiTheme({
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
});
