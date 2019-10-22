import React from "react";
import { Page } from "../../components/Page/Page";
import AboutContent from "./About.mdx";

export const About: React.FC<{}> = props => {
  return (
    <Page h1="About">
      <AboutContent></AboutContent>
    </Page>
  );
};
