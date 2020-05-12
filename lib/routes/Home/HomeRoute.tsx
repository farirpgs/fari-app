import { Box, Button, Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import appIcon from "../../../images/app-icon.png";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";

export const HomeRoute: React.FC<{}> = (props) => {
  const history = useHistory();
  const { t } = useTranslation();
  return (
    <Page>
      <PageMeta
        title={t("home.meta.title")}
        description={t("home.meta.description")}
      ></PageMeta>
      <Box>
        <Container maxWidth="xs">
          <Box pb="2rem" textAlign="center">
            <img width="150px" src={appIcon} />
          </Box>
          <Box pb="2rem" textAlign="center">
            <Typography variant="h4">{t("home.welcome")}</Typography>
          </Box>
          <Box pb="4rem" textAlign="center">
            <Typography variant="subtitle1">{t("home.subtitle1")}</Typography>
            <Typography variant="subtitle1">{t("home.subtitle2")}</Typography>
          </Box>
        </Container>
        <Container maxWidth="lg">
          <Grid container justify="center" spacing={6}>
            <Grid item xs={12} md={4}>
              <Box height="100%" display="flex" flexDirection="column">
                <Typography variant="h5" align="center" color="primary">
                  <b>{t("home.play-online.title")}</b>
                </Typography>
                <br />
                <Typography variant="body1" align="center">
                  {t("home.play-online.description")}
                </Typography>

                <Box pt="2rem" textAlign="center" marginTop="auto">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => {
                      history.push("/play");
                    }}
                  >
                    {t("home.play-online.button")}
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box height="100%" display="flex" flexDirection="column">
                <Typography variant="h5" align="center" color="primary">
                  <b>{t("home.play-offline.title")}</b>
                </Typography>
                <br />
                <Typography variant="body1" align="center">
                  {t("home.play-offline.description")}
                </Typography>
                <Box pt="2rem" textAlign="center" marginTop="auto">
                  <Button
                    type="submit"
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => {
                      history.push("/play-offline");
                    }}
                  >
                    {t("home.play-offline.button")}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Page>
  );
};

HomeRoute.displayName = "HomeRoute";
