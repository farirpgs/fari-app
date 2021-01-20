import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { default as React, useEffect, useState } from "react";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import MarkdownElement from "../../components/MarkdownElement/MarkdownElement";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { IPossibleLanguages } from "../../services/internationalization/InternationalizationService";

const Pages: Record<IPossibleLanguages, Promise<{ page: string }>> = {
  "en": import("./page/About.en"),
  "pt-BR": import("./page/About.en"),
  "it": import("./page/About.en"),
  "gl": import("./page/About.en"),
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
        <Box
          py="1rem"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <FateLabel variant="h4" align="center" color="primary">
            {t("menu.about")}
          </FateLabel>
        </Box>

        <MarkdownElement renderedMarkdown={page} />
      </Container>
    </Page>
  );
};
AboutRoute.displayName = "AboutRoute";
export default AboutRoute;
