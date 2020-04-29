import { Box, Button, Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router";
import appIcon from "../../../images/app-icon.png";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";

export const HomeRoute: React.FC<{}> = (props) => {
  const history = useHistory();

  return (
    <Page>
      <PageMeta
        title="Fate RPG Companion"
        description="Fari is the best Fate RPG companion application. Play scenes in real-time with your friends, roll fudge dice and let your imagination do the rest."
      ></PageMeta>
      <Box>
        <Container maxWidth="md">
          <Box pb="2rem" textAlign="center">
            <img width="150px" src={appIcon} />
          </Box>
          <Box pb="2rem" textAlign="center">
            <Typography variant="h4">Welcome to Fari</Typography>
          </Box>
          <Box pb="4rem" textAlign="center">
            <Typography variant="subtitle1">
              Fari is the best Fate RPG companion application. Play scenes in
              real-time with your friends, roll fudge dice and let your
              imagination do the rest.
            </Typography>
          </Box>
        </Container>
        <Container maxWidth="lg">
          <Grid container justify="center" spacing={6}>
            <Grid item xs={12} md={4}>
              <Box height="100%" display="flex" flexDirection="column">
                <Typography variant="h5" align="center" color="primary">
                  Play Fate Online
                </Typography>
                <br />
                <Typography variant="body1" align="center">
                  Use our <b>Online Game Manager</b> to create an interactive
                  play session. Send a link to your friends, play your scenes
                  and roll dice on the same user interface in real time.
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
                    Start Online Game (Beta)
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box height="100%" display="flex" flexDirection="column">
                <Typography variant="h5" align="center" color="primary">
                  Play Fate Offline
                </Typography>
                <br />
                <Typography variant="body1" align="center">
                  Rally up with your friends on Discord or else, share your
                  screen and start a game with our <b>Game Manager</b>. Manage
                  your scene, aspects, and more in a custom tailored user
                  interface made to play Fate Core, Fate Accelerated or Fate
                  Condensed.
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
                    Start Offline Game
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
