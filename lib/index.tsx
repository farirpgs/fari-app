import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { ThemeProvider } from "@material-ui/styles";
import "flexboxgrid";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, withRouter } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop";
import "./index.css";
import { AppBottomNavigation } from "./root/AppBottomNavigation";
import { AppRouter } from "./root/AppRouter";
import { theme } from "./theme";

let deferredPrompt: any;

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  console.log("beforeinstallprompt Event fired");

  deferredPrompt = e;

  return false;
});

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
  const [isInstalled, setIsInstalled] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ScrollToTop />
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
            <Typography variant="h6">
              Fari - Roll Playing Game Companion
            </Typography>
            {!!deferredPrompt && (
              <Button
                color="inherit"
                onClick={async () => {
                  deferredPrompt.prompt();
                  // Wait for the user to respond to the prompt
                  const choiceResult = await deferredPrompt.userChoice;
                  if (choiceResult.outcome === "accepted") {
                    console.log("User accepted home screen installation");
                  } else {
                    console.log("User dismissed home screen installation");
                  }
                  deferredPrompt = null;
                }}
              >
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
