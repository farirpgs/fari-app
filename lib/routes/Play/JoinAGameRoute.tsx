import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import Alert from "@material-ui/lab/Alert";
import React, { useEffect, useState } from "react";
import appIcon from "../../../images/blue/app.png";
import { Page } from "../../components/Page/Page";
import {
  TwoPeopleMeetingIcon,
  TwoPeopleMeetingTalkingIcon,
} from "../../domains/Icons/Icons";
import { isWebRTCSupported } from "../../hooks/usePeerJS/usePeerJS";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

let playerNameSingleton = "";

export const JoinAGame: React.FC<{
  idFromParams: string;
  onSubmitPlayerName(playerName: string): void;
  connecting: boolean;
  error: any;
}> = (props) => {
  const { t } = useTranslate();
  const [playerName, setPlayerName] = useState(playerNameSingleton);

  function onSubmitPlayerName(playerName: string) {
    props.onSubmitPlayerName(playerName);
  }

  useEffect(() => {
    playerNameSingleton = playerName;
  }, [playerName]);

  return (
    <Page gameId={props.idFromParams}>
      <Box>
        <Box pb="1rem">
          <Container maxWidth="xs">
            {isWebRTCSupported() ? renderConnectionForm() : renderWebRTCError()}
          </Container>
        </Box>
      </Box>
    </Page>
  );

  function renderWebRTCError() {
    return (
      <Box>
        <Box pb="2rem" textAlign="center">
          <Typography variant="h4">{t("play-route.error.title")}</Typography>
        </Box>
        <Box pb="1rem" textAlign="center">
          <Typography variant="body1">
            {t("play-route.error.webRTC")}
          </Typography>
        </Box>
      </Box>
    );
  }

  function renderConnectionForm() {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onSubmitPlayerName(playerName);
        }}
      >
        <Box pb="2rem" textAlign="center">
          <img alt="Fari" width="150px" src={appIcon} />
        </Box>
        <Box pb="2rem" textAlign="center">
          <Typography variant="h4">
            {t("play-route.connect-to-game")}
          </Typography>
        </Box>
        <Box pb="1rem">
          {props.connecting ? (
            <Fade in key="lol">
              <Box display="flex" justifyContent="center">
                <TwoPeopleMeetingTalkingIcon
                  className={css({ fontSize: "5rem" })}
                  color="primary"
                />
              </Box>
            </Fade>
          ) : (
            <Fade in key="asd">
              <Box display="flex" justifyContent="center">
                <TwoPeopleMeetingIcon
                  className={css({ fontSize: "5rem" })}
                  color="primary"
                />
              </Box>
            </Fade>
          )}
        </Box>
        <Box pb="1rem">
          <Alert severity="info">
            <Box pb=".5rem" fontWeight="bold">
              <Typography variant="inherit">
                {"Oh, something is different?"}
              </Typography>
            </Box>
            <Box pb=".5rem">
              <Typography>
                {
                  "I made some changes to this page based on feedback I got from the community."
                }
              </Typography>
            </Box>
            <Box pb="1rem">
              <Typography>
                {
                  "Just enter your name name in the field below and you will be able to load your character sheet once you've joined the game."
                }
              </Typography>
            </Box>
            <Box pb=".5rem">
              <Typography>
                {"Once inside, simply click the"}
                <Box display="inline-block" px=".5rem">
                  <NoteAddIcon />
                </Box>
                {
                  "button besides your name on the left to load a character sheet."
                }
              </Typography>
            </Box>
          </Alert>
        </Box>
        <Box pb="1rem">
          <Box pb="1rem">
            <Paper>
              <Box p="1rem">
                <Box pb="1rem">
                  <InputLabel shrink>
                    {t("play-route.what-is-your-name")}
                    {":"}
                  </InputLabel>
                  <TextField
                    autoFocus
                    value={playerName}
                    onChange={(event) => {
                      setPlayerName(event.target.value);
                    }}
                    inputProps={{
                      maxLength: "50",
                    }}
                    fullWidth
                    required
                  />
                </Box>
                <Box>
                  <Grid container justify="flex-end">
                    <Grid item>
                      <Button
                        type="submit"
                        variant={playerName ? "contained" : "outlined"}
                        color="primary"
                      >
                        {t("play-route.join")}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Paper>
          </Box>

          <Collapse in={props.connecting}>
            <Box pb="2rem">
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            </Box>
          </Collapse>
          <Collapse in={props.error}>
            <Box pb="2rem" textAlign="center">
              <Typography color="error">
                {t("play-route.join-error")}
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </form>
    );
  }
};

JoinAGame.displayName = "JoinAGame";
