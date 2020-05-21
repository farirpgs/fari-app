import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import "flexboxgrid";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { StoreContext, useStoreInternal } from "../../contexts/StoreContext";
import "../../index.css";
import { AppLightTheme } from "../../theme";

export const BaseStory: React.FC<{}> = (props) => {
  const store = useStoreInternal();

  return (
    <StoreContext.Provider value={store}>
      <ThemeProvider theme={AppLightTheme}>
        <BrowserRouter>
          <CssBaseline />
          {props.children}
        </BrowserRouter>
      </ThemeProvider>
    </StoreContext.Provider>
  );
};
