import { Container } from "@material-ui/core";
import React, { useEffect } from "react";
import showdown from "showdown";
import MarkdownElement from "../../components/MarkdownElement/MarkdownElement";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { IPossibleLanguages } from "../../services/internationalization/InternationalizationService";
import AboutEnMarkdown from "./page/About.en.md";
import AboutEsMarkdown from "./page/About.es.md";
import AboutFrMarkdown from "./page/About.fr.md";

const converter = new showdown.Converter();

const html: Record<IPossibleLanguages, string> = {
  "en": converter.makeHtml(AboutEnMarkdown),
  "pt-BR": converter.makeHtml(AboutEnMarkdown),
  "es": converter.makeHtml(AboutEsMarkdown),
  "fr": converter.makeHtml(AboutFrMarkdown),
  "dev": converter.makeHtml(AboutEnMarkdown),
};

export const AboutRoute: React.FC<{}> = (props) => {
  const { t, currentLanguage } = useTranslate();
  const logger = useLogger();
  const aboutPage = html[currentLanguage];

  useEffect(() => {
    logger.info("Route:About");
  }, []);

  return (
    <Page>
      <PageMeta
        title={t("about-route.meta.title")}
        description={t("about-route.meta.description")}
      />
      <Container maxWidth="md">
        <MarkdownElement renderedMarkdown={aboutPage} />
      </Container>
    </Page>
  );
};
AboutRoute.displayName = "AboutRoute";
