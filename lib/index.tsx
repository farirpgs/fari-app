import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import "flexboxgrid";
import "github-markdown-css/github-markdown.css";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, withRouter } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop";
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
