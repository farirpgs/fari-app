import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { Heading } from "../../components/Heading/Heading";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useCanny } from "../../hooks/useCanny/useCanny";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export function FeatureRequestsRoute() {
  const { t } = useTranslate();
  const theme = useTheme();
  const canny = useCanny({
    boardToken: "7af01bfe-e4a0-f03f-7eae-48a7edc219da",
    basePath: "/feature-requests",
  });

  const pageTitle = canny.postTitle
    ? `${canny.postTitle} | ${t("feature-requests-route.meta.title")}`
    : t("feature-requests-route.meta.title");

  return (
    <Page>
      <PageMeta
        title={pageTitle}
        description={t("feature-requests-route.meta.description")}
      />
      <Heading
        icon={QuestionAnswerIcon}
        title={t("feature-requests-route.meta.title")}
        subtitle={t("feature-requests-route.meta.description")}
      />
      <Container maxWidth="lg">
        <Box bgcolor="#fff" px="2rem" py="2rem" boxShadow={theme.shadows[1]}>
          <div data-canny />
        </Box>
      </Container>
    </Page>
  );
}

export default FeatureRequestsRoute;
