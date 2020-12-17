import { AppProps } from "next/app";
import React from "react";
import { App } from "../lib/App";

const NextJSApp: React.FC<AppProps> = (props) => {
  const { Component, pageProps } = props;
  return (
    <App>
      <Component {...pageProps} />
    </App>
  );
};

export default NextJSApp;
