import { Container } from "@material-ui/core";
import React from "react";
import showdown from "showdown";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import content from "./About.md";

const aboutHTML = new showdown.Converter().makeHtml(content);

export const AboutRoute: React.FC<{}> = (props) => {
  const { t } = useTranslate();
  return (
    <Page>
      <PageMeta
        title={t("about-route.meta.title")}
        description={t("about-route.meta.description")}
      />
      <Container maxWidth="md">
        <div
          dangerouslySetInnerHTML={{
            __html: aboutHTML,
          }}
        ></div>
      </Container>
    </Page>
  );
};
AboutRoute.displayName = "AboutRoute";
