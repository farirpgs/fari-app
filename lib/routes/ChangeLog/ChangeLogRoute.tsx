import { Container } from "@material-ui/core";
import changeLogMarkdown from "bundle-text:../../../CHANGELOG.md";
import React, { useEffect, useState } from "react";
import showdown from "showdown";
import MarkdownElement from "../../components/MarkdownElement/MarkdownElement";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const ChangelogRoute: React.FC<{}> = (props) => {
  const { t } = useTranslate();
  const [latestVersion, setLatestVersion] = useState<string | null | undefined>(
    ""
  );
  const [content, setContent] = useState("");
  const logger = useLogger();

  useEffect(() => {
    logger.info("Route:ChangeLog");
  }, []);

  useEffect(() => {
    async function loadChangelog() {
      const changelog = getChangeLog(changeLogMarkdown);
      setContent(changelog.html);
      setLatestVersion(changelog.latestVersion);
    }
    loadChangelog();
  }, []);

  return (
    <Page>
      <PageMeta
        title={`${t("changelog-route.meta.title")} v${latestVersion}`}
        description={t("changelog-route.meta.description")}
      />
      <Container maxWidth="md">
        <MarkdownElement renderedMarkdown={content} />
      </Container>
    </Page>
  );
};
ChangelogRoute.displayName = "ChangelogRoute";

function getChangeLog(mardown: string) {
  try {
    const html = new showdown.Converter().makeHtml(mardown);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(html, "text/html");
    const latestVersionTag = htmlDoc.querySelector("h2");
    const latestVersion = latestVersionTag?.textContent;
    return { html: html, latestVersion: latestVersion };
  } catch (e) {
    return { html: "", latestVersion: "" };
  }
}
