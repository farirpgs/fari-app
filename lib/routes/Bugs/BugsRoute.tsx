import BugReportIcon from "@mui/icons-material/BugReport";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { Heading } from "../../components/Heading/Heading";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useCanny } from "../../hooks/useCanny/useCanny";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export function BugsRoute() {
  const { t } = useTranslate();
  const theme = useTheme();
  const canny = useCanny({
    boardToken: "0e1da373-6ec5-a2b8-ca4f-893c4d415990",
    basePath: "/bugs",
  });

  const pageTitle = canny.postTitle
    ? `${canny.postTitle} | ${t("bugs-route.meta.title")}`
    : t("bugs-route.meta.title");

  return (
    <Page>
      <PageMeta
        title={pageTitle}
        description={t("bugs-route.meta.description")}
      />
      <Heading
        icon={BugReportIcon}
        title={t("bugs-route.meta.title")}
        subtitle={t("bugs-route.meta.description")}
      />
      <Container maxWidth="lg">
        <Box bgcolor="#fff" px="2rem" py="2rem" boxShadow={theme.shadows[1]}>
          <div data-canny />
        </Box>
      </Container>
    </Page>
  );
}

export default BugsRoute;
