import CssBaseline from "@material-ui/core/CssBaseline";
import { StylesProvider, ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { AppLightTheme } from "../lib/theme";

/**
 * The Fate Font is served using the `-s` option on the package.json
 * Also see .storybook/preview-head.html
 */
export function StoryProvider(props: { children: JSX.Element }) {
  return (
    <ThemeProvider theme={AppLightTheme}>
      <StylesProvider injectFirst>
        <CssBaseline />
        <HelmetProvider>{props.children}</HelmetProvider>
      </StylesProvider>
    </ThemeProvider>
  );
}
