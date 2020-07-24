import { Container } from "@material-ui/core";
import React from "react";
import showdown from "showdown";
import MarkdownElement from "../../components/MarkdownElement/MarkdownElement";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { IPossibleLanguages } from "../../services/internationalization/InternationalizationService";
import AboutEnMarkdown from "./page/About.en.md";
import AboutEsMarkdown from "./page/About.es.md";

const converter = new showdown.Converter();

const html: Record<IPossibleLanguages, string> = {
  en: converter.makeHtml(AboutEnMarkdown),
  es: converter.makeHtml(AboutEsMarkdown),
  dev: converter.makeHtml(AboutEnMarkdown),
};

export const AboutRoute: React.FC<{}> = (props) => {
  const { t, i18n } = useTranslate();
  const currentLanguage = i18n.language as IPossibleLanguages;

  const aboutPage = html[currentLanguage];
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
