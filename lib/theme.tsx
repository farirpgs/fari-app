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
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Noto Sans",
      "Ubuntu",
      "Droid Sans",
      "Helvetica Neue",
      "sans-serif",
    ].join(","),
  },
});
