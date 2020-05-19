import { Box, Button, Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router";
import appIcon from "../../../images/app-icon.png";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const HomeRoute: React.FC<{}> = (props) => {
  const history = useHistory();
  const { t } = useTranslate();

  return (
    <Page>
      <PageMeta
        title={t("home-route.meta.title")}
        description={t("home-route.meta.description")}
      ></PageMeta>
      <Box>
        <Container maxWidth="sm">
          <Box pb="2rem" textAlign="center">
            <img width="150px" src={appIcon} />
          </Box>
          <Box pb="2rem" textAlign="center">
            <Typography variant="h4">{t("home-route.welcome")}</Typography>
          </Box>
          <Box pb="1rem" textAlign="center">
            <Typography variant="subtitle1">
              {t("home-route.subtitle1")}
            </Typography>
          </Box>
          <Box pb="4rem" textAlign="center">
            <Typography variant="subtitle1">
              {t("home-route.subtitle2")}
            </Typography>
          </Box>
        </Container>
        <Container maxWidth="lg">
          <Grid container justify="center" spacing={6}>
            <Grid item xs={12} md={4}>
              <Box height="100%" display="flex" flexDirection="column">
                <Typography variant="h5" align="center" color="primary">
                  <b>{t("home-route.play-online.title")}</b>
                </Typography>
                <br />
                <Typography variant="body1" align="center">
                  {t("home-route.play-online.description")}
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
                    {t("home-route.play-online.button")}
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box height="100%" display="flex" flexDirection="column">
                <Typography variant="h5" align="center" color="primary">
                  <b>{t("home-route.play-offline.title")}</b>
                </Typography>
                <br />
                <Typography variant="body1" align="center">
                  {t("home-route.play-offline.description")}
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
                    {t("home-route.play-offline.button")}
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
