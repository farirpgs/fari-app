import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppTheme } from "../../theme";

import "flexboxgrid";
import "../../index.css";
export const BaseStory: React.FC<{}> = props => {
  return (
    <ThemeProvider theme={AppTheme}>
      <BrowserRouter>
        <CssBaseline />
        {props.children}
      </BrowserRouter>
    </ThemeProvider>
  );
};
