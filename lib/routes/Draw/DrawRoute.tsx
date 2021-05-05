import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { useTheme } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { DrawObjects } from "../../components/DrawArea/DrawObjects";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { Icons } from "../../domains/Icons/Icons";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const DrawRoute: React.FC = (props) => {
  const { t } = useTranslate();
  const logger = useLogger();
  const theme = useTheme();
  useEffect(() => {
    logger.info("Route:Draw");
  }, []);

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
          <DrawObjects controls="top" />
        </Box>
      </Container>
    </Page>
  );
};

DrawRoute.displayName = "DrawRoute";
export default DrawRoute;
