import { Box, Button, Container, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router";
import appIcon from "../../../images/app-icon.png";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";

export const Home: React.FC<{}> = (props) => {
  const history = useHistory();

  return (
    <Page>
      <PageMeta
        title="Fate RPG Companion"
        description="Fari is the best Fate RPG companion application. Play scenes in real-time with your friends, roll fudge dice and let your imagination do the rest."
      ></PageMeta>
      <Box>
        <Container maxWidth="xs">
          <Box pb="2rem" textAlign="center">
            <img width="150px" src={appIcon} />
          </Box>
          <Box pb="4rem" textAlign="center">
            <Typography variant="h4">Welcome to Fari</Typography>
          </Box>
          <Box pb="2rem">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={() => {
                history.push("/play");
              }}
            >
              Start a new Game!
            </Button>
          </Box>
        </Container>
      </Box>
    </Page>
  );
};
