import { css } from "@emotion/css";
import { useBroadcastEvent, useEventListener } from "@liveblocks/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  default as React,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHistory } from "react-router";
import { AppLink } from "../../components/AppLink/AppLink";
import { Page } from "../../components/Page/Page";
import { Images } from "../../constants/Images";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { Icons } from "../../domains/Icons/Icons";
import { isWebRTCSupported } from "../../hooks/usePeerJS/isWebRTCSupported";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import {
  IPlayerInteraction,
  PlayerInteractionFactory,
} from "./types/IPlayerInteraction";

export const JoinAGameRoute: React.FC<{
  match: {
    params: { id?: string };
  };
}> = (props) => {
  const { t } = useTranslate();
  const settingsManager = useContext(SettingsContext);
  const [playerName, setPlayerName] = useState(settingsManager.state.userName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const isGameLinkValid = useRef(false);
  const history = useHistory();

  const broadcast = useBroadcastEvent();

  useEventListener<IPlayerInteraction>(({ event }) => {
    if (event.type === "pong") {
      isGameLinkValid.current = true;
      history.push(`/play/${props.match.params.id}?name=${playerName}`);
    }
  });

  async function onJoin() {
    broadcast(PlayerInteractionFactory.ping());
    setLoading(true);
    setTimeout(() => {
      if (!isGameLinkValid) {
        setLoading(false);
        setError(true);
      }
    }, 3000);
  }

  useEffect(() => {
    settingsManager.actions.setUserName(playerName);
  }, [playerName]);

  return (
    <Page>
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
          onJoin();
        }}
      >
        <Box pb="2rem" textAlign="center">
          <img alt="Fari" width="150px" src={Images.app} />
        </Box>
        <Box pb="2rem" textAlign="center">
          <Typography variant="h4">
            {t("play-route.connect-to-game")}
          </Typography>
        </Box>
        <Box pb="1rem">
          {loading ? (
            <Fade in key="loading">
              <Box display="flex" justifyContent="center">
                <Icons.TwoPeopleMeetingTalkingIcon
                  className={css({ fontSize: "5rem" })}
                  color="primary"
                />
              </Box>
            </Fade>
          ) : (
            <Fade in key="waiting">
              <Box display="flex" justifyContent="center">
                <Icons.TwoPeopleMeetingIcon
                  className={css({ fontSize: "5rem" })}
                  color="primary"
                />
              </Box>
            </Fade>
          )}
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
                    variant="standard"
                  />
                </Box>
                <Box>
                  <Grid container justifyContent="flex-end">
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

          <Collapse in={loading}>
            <Box pb="2rem">
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            </Box>
          </Collapse>
          <Collapse in={error}>
            <Box pb="2rem" textAlign="center">
              <Typography color="error">
                {t("play-route.join-error")}
              </Typography>
              <Typography color="error">
                <AppLink to="/fari-wiki/connection-issues">
                  {t("play-route.join-error.connection-issues")}
                </AppLink>
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </form>
    );
  }
};

export default JoinAGameRoute;
