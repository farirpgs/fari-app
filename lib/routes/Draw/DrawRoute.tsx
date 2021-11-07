import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Icons } from "../../domains/Icons/Icons";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { TLDrawWriter } from "./TLDraw";

export const DrawRoute: React.FC = () => {
  const { t } = useTranslate();
  const theme = useTheme();

  return (
    <Page>
      <PageMeta
        title={t("draw-route.meta.title")}
        description={t("draw-route.meta.description")}
      />
      <Container maxWidth="lg">
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
          // maxWidth="600px"
          position="relative"
          height="600px"
          margin="0 auto"
        >
          <TLDrawWriter />
        </Box>
      </Container>
    </Page>
  );
};

DrawRoute.displayName = "DrawRoute";
export default DrawRoute;
