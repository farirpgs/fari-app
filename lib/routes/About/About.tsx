import React from "react";
import showdown from "showdown";
import { Page } from "../../components/Page/Page";
import aboutMD from "./About.md";

const html = new showdown.Converter().makeHtml(aboutMD);

export const About: React.FC<{}> = (props) => {
  return (
    <Page>
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      ></div>
    </Page>
  );
};
