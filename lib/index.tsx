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
import { SentryService } from "./services/sentry/SentryService";
import { ExampleBoundary } from "./components/ErrorBoundary/ErrorBoundary";

function App() {
  const store = _useStore();
  return (
    <ExampleBoundary>
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
    </ExampleBoundary>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
