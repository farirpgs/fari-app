import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import "flexboxgrid";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AppBottomNavigation } from "./components/AppBottomNavigation/AppBottomNavigation";
import { AppRouter } from "./components/AppRouter/AppRouter";
import { History } from "./components/History/History";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop";
import "./index.css";
import { AppTheme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={AppTheme}>
      <BrowserRouter>
        <ScrollToTop />
        <CssBaseline />
        <History />
        <AppRouter />
        <AppBottomNavigation />
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
