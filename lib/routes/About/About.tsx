import React from "react";
import { Page } from "../../components/Page/Page";

export const About: React.FC<{}> = props => {
  return (
    <Page h1="About">
      <p>
        Fari is a role playing game companion application developed by René-Pier
        Deshaies-Gélinas
      </p>

      <p>Made with love from Québec, Canada</p>
    </Page>
  );
};
