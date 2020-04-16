import { Box, Button, Container, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router";
import appIcon from "../../../images/app-icon.png";
import { Page } from "../../components/Page/Page";

export const Home: React.FC<{}> = (props) => {
  const history = useHistory();

  return (
    <Page>
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
