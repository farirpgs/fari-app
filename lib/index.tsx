import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { ThemeProvider } from "@material-ui/styles";
import "flexboxgrid";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, withRouter } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop";
import { usePWA } from "./hooks/usePWA";
import "./index.css";
import { AppBottomNavigation } from "./root/AppBottomNavigation";
import { AppRouter } from "./root/AppRouter";
import { AppTheme } from "./theme";

export let routerHistory = {} as any;

export const History = withRouter(props => {
  const {
    history,
    children,
    location: { pathname }
  } = props;
  // tslint:disable-next-line: react-hooks-nesting
  useEffect(() => {
    routerHistory = history;
  }, [pathname]);

  return null;
});

function App() {
  const pwa = usePWA();

  return (
    <ThemeProvider theme={AppTheme}>
      <BrowserRouter>
        <ScrollToTop />
        <CssBaseline />
        <History />
        <AppBar position="static">
          <Toolbar
            style={{
              margin: "0 auto",
              maxWidth: "1200px",
              width: "100%",
              padding: "1rem",
              justifyContent: "space-between"
            }}
          >
            <Typography variant="h6">Fari</Typography>
            {pwa.shouldSuggestInstallation && (
              <Button color="inherit" onClick={pwa.prompt} variant="outlined">
                <CloudDownloadIcon style={{ marginRight: "1rem" }} />
                Install
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flex: "1 0 auto",
            width: "100%",
            marginBottom: "10rem"
          }}
        >
          <div
            style={{
              width: "100%"
            }}
          >
            <AppRouter />
            <AppBottomNavigation />
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
