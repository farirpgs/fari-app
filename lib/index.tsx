import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import "flexboxgrid";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AppBottomNavigation } from "./components/AppBottomNavigation/AppBottomNavigation";
import { AppRouter } from "./components/AppRouter/AppRouter";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { History } from "./components/History/History";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop";
import { StoreContext, _useStore } from "./context/store";
import "./index.css";
import { AppTheme } from "./theme";

/* <Helmet
  htmlAttributes={{
    "client-build-number": env.buildNumber,
    "client-hash": env.hash,
    "client-context": env.context
  }}
></Helmet> */

function App() {
  const store = _useStore();
  return (
    <ErrorBoundary>
      <ThemeProvider theme={AppTheme}>
        <StoreContext.Provider value={store}>
          <BrowserRouter>
            <ScrollToTop />

            <CssBaseline />
            <History />
            <AppRouter />
            <AppBottomNavigation />
          </BrowserRouter>
        </StoreContext.Provider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
