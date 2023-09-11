"use client";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

import { Box, Container, useTheme } from "@mui/material";
import { Heading } from "../../components/Heading/Heading";
import { Page } from "../../components/Page/Page";
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
    <Page sx={{ paddingTop: "2rem" }}>
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
