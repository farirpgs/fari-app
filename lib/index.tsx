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
import { _useStore, StoreContext } from "./context/store";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import Helmet from "react-helmet";
import { env } from "./services/injections";

function App() {
  const store = _useStore();
  return (
    <ErrorBoundary>
      <ThemeProvider theme={AppTheme}>
        <StoreContext.Provider value={store}>
          <BrowserRouter>
            <ScrollToTop />
            <Helmet
              htmlAttributes={{
                "client-build-number": env.buildNumber,
                "client-hash": env.hash,
                "client-context": env.context
              }}
            ></Helmet>
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
