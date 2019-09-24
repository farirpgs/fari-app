import React from "react";
import { Page } from "../../components/Page/Page";
import PageContent from "./homeContent.mdx";

export const Home = props => {
  return (
    <Page h1={"Fari "}>
      <div className="markdown-body">
        <PageContent></PageContent>
      </div>
    </Page>
  );
};
