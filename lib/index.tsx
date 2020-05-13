import { StylesProvider } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import "flexboxgrid";
import React from "react";
import ReactDOM from "react-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./components/AppRouter/AppRouter";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { History } from "./components/History/History";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop";
import "./index.css";
import { env } from "./services/injections";
import { AppTheme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={AppTheme}>
      <StylesProvider injectFirst>
        <CssBaseline />

        <ErrorBoundary>
          <HelmetProvider>
            <BrowserRouter>
              <Helmet
                htmlAttributes={{
                  "client-build-number": env.buildNumber,
                  "client-hash": env.hash,
                  "client-context": env.context,
                }}
              ></Helmet>
              <ScrollToTop />
              <History />
              <AppRouter />
            </BrowserRouter>
          </HelmetProvider>
        </ErrorBoundary>
      </StylesProvider>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
