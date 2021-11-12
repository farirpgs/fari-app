import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { DrawObjects } from "../../components/DrawArea/DrawObjects";
import { useDrawing } from "../../components/DrawArea/hooks/useDrawing";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Icons } from "../../domains/Icons/Icons";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const DrawRoute: React.FC = () => {
  const { t } = useTranslate();
  const drawingManager = useDrawing({});
  const theme = useTheme();

  return (
    <Page>
      <PageMeta
        title={t("draw-route.meta.title")}
        description={t("draw-route.meta.description")}
      />
      <Container maxWidth="md">
        <Box
          py="1rem"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Icons.IllustrationIcon
            className={css({ fontSize: "3rem" })}
            color="primary"
          />
          <FateLabel variant="h4" align="center" color="primary">
            {"Draw"}
          </FateLabel>
        </Box>

        <Box
          border={`1px solid ${theme.palette.divider}`}
          maxWidth="600px"
          margin="0 auto"
        >
          <DrawObjects drawingManager={drawingManager} controls="top" />
        </Box>
      </Container>
    </Page>
  );
};

DrawRoute.displayName = "DrawRoute";
export default DrawRoute;
