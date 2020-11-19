import { Container } from "@material-ui/core";
import { default as React, useEffect, useState } from "react";
import MarkdownElement from "../../components/MarkdownElement/MarkdownElement";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { IPossibleLanguages } from "../../services/internationalization/InternationalizationService";

const Pages: Record<IPossibleLanguages, Promise<{ page: string }>> = {
  "en": import("./page/About.en"),
  "pt-BR": import("./page/About.en"),
  "es": import("./page/About.es"),
  "fr": import("./page/About.fr"),
  "ru": import("./page/About.ru"),
  "de": import("./page/About.de"),
  "dev": import("./page/About.en"),
};
export const AboutRoute: React.FC<{}> = (props) => {
  const { t, currentLanguage } = useTranslate();
  const logger = useLogger();
  const [page, setPage] = useState<string>("");

  useEffect(() => {
    async function load() {
      logger.info("Route:About");
      const htmlInPage = (await Pages[currentLanguage]).page;
      setPage(htmlInPage);
    }
    load();
  }, [currentLanguage]);

  return (
    <Page>
      <PageMeta
        title={t("about-route.meta.title")}
        description={t("about-route.meta.description")}
      />
      <Container maxWidth="md">
        <MarkdownElement renderedMarkdown={page} />
      </Container>
    </Page>
  );
};
AboutRoute.displayName = "AboutRoute";
export default AboutRoute;
