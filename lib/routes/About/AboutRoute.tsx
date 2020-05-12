import React from "react";
import showdown from "showdown";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import aboutMD from "./About.md";

const html = new showdown.Converter().makeHtml(aboutMD);

export const AboutRoute: React.FC<{}> = (props) => {
  const { t } = useTranslate();
  return (
    <Page>
      <PageMeta
        title={t("about-route.meta.title")}
        description={t("about-route.meta.description")}
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
