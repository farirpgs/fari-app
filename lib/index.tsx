import { StylesProvider } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import "flexboxgrid";
import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./components/AppRouter/AppRouter";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { History } from "./components/History/History";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop";
import { StoreContext, useStoreInternal } from "./contexts/StoreContext";
import "./index.css";
import { env } from "./services/injections";
import { AppDarkTheme, AppLightTheme } from "./theme";

const App: React.FC<{}> = () => {
  const store = useStoreInternal();
  return (
    <StoreContext.Provider value={store}>
      <AppProvider></AppProvider>
    </StoreContext.Provider>
  );
};
App.displayName = "App";

export const AppProvider: React.FC<{}> = (props) => {
  const store = useContext(StoreContext);

  return (
    <ThemeProvider theme={store.state.darkMode ? AppDarkTheme : AppLightTheme}>
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
};

AppProvider.displayName = "AppProvider";

ReactDOM.render(<App />, document.getElementById("root"));
