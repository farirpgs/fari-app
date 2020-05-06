import React from "react";
import showdown from "showdown";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import aboutMD from "./About.md";

const html = new showdown.Converter().makeHtml(aboutMD);

export const AboutRoute: React.FC<{}> = (props) => {
  return (
    <Page>
      <PageMeta
        title="About"
        description="Fari is a Fate RPG Companion Application created by René-Pier Deshaies-Gélinas"
      />
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      ></div>
    </Page>
  );
};
AboutRoute.displayName = "AboutRoute";
