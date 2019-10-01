import React from "react";
import { Page } from "../../components/Page/Page";

export const Home = props => {
  return (
    <Page h1={"Fari "}>
      <div className="markdown-body">
        Welcome and thanks for using Fari! Fari is a web application that helps
        you create and manage everything related to FATE Core and FATE
        Accelerated. Create and update characters, add scenes for you scenarios
        and roll some dice.
      </div>
    </Page>
  );
};
