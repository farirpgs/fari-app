import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import React, { useEffect } from "react";
import { Heading } from "../../components/Heading/Heading";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

const BoardToken = "7af01bfe-e4a0-f03f-7eae-48a7edc219da";

export function FeatureRequestsRoute() {
  const { t } = useTranslate();

  useEffect(() => {
    (window as any).Canny("render", {
      boardToken: BoardToken,
      basePath: "/feature-requests",
      ssoToken: null,
    });
  }, []);

  return (
    <Page>
      <PageMeta
        title={t("feature-requests-route.meta.title")}
        description={t("feature-requests-route.meta.description")}
      />
      <Heading
        icon={QuestionAnswerIcon}
        title={t("feature-requests-route.meta.title")}
        subtitle={t("feature-requests-route.meta.description")}
      />
      <Container disableGutters>
        <Box bgcolor="#fff" px="1rem" mx="-1rem">
          <div data-canny />
        </Box>
      </Container>
    </Page>
  );
}

export default FeatureRequestsRoute;
