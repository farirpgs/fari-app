import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { ThemeProvider } from "@material-ui/styles";
import "flexboxgrid";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import "./index.css";
import { AppBottomNavigation } from "./root/AppBottomNavigation";
import { AppRouter } from "./root/AppRouter";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ScrollToTop />
        <AppBar position="static">
          <Toolbar
            style={{
              margin: "0 auto",
              maxWidth: "1200px",
              width: "100%",
              padding: "1rem"
            }}
          >
            <Typography variant="h6">Characters</Typography>
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
