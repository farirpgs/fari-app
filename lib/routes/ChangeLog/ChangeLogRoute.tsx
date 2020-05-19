import { Container } from "@material-ui/core";
import React from "react";
import showdown from "showdown";
import content from "../../../CHANGELOG.md";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

const html = new showdown.Converter().makeHtml(content);

export const ChangelogRoute: React.FC<{}> = (props) => {
  const { t } = useTranslate();
  return (
    <Page>
      <PageMeta
        title={t("changelog-route.meta.title")}
        description={t("changelog-route.meta.description")}
      />
      <Container maxWidth="md">
        <div
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        ></div>
      </Container>
    </Page>
  );
};
ChangelogRoute.displayName = "ChangelogRoute";
