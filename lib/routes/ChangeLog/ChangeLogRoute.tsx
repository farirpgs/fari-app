import { Container } from "@material-ui/core";
import React from "react";
import showdown from "showdown";
import content from "../../../CHANGELOG.md";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

const changelogHTML = new showdown.Converter().makeHtml(content);
const latestVersionText = getLatestVersionInfo(changelogHTML);

export const ChangelogRoute: React.FC<{}> = (props) => {
  const { t } = useTranslate();
  return (
    <Page>
      <PageMeta
        title={`${t("changelog-route.meta.title")} v${latestVersionText}`}
        description={t("changelog-route.meta.description")}
      />
      <Container maxWidth="md">
        <div
          dangerouslySetInnerHTML={{
            __html: changelogHTML,
          }}
        ></div>
      </Container>
    </Page>
  );
};
ChangelogRoute.displayName = "ChangelogRoute";

function getLatestVersionInfo(changelogHTML: string) {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(changelogHTML, "text/html");
  const latestVersion = htmlDoc.querySelector("h2");
  const latestVersionText = latestVersion.textContent;
  return latestVersionText;
}
