import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Container,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import appIcon from "../../../images/app-icon.png";
import { Page } from "../../components/Page/Page";
import {
  CharactersContext,
  CharactersManagerMode,
  ICharacter,
} from "../../contexts/CharactersContext/CharactersContext";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

let playerNameSingleton = "";

export const JoinAGame: React.FC<{
  onSubmitPlayerName(playerName: string): void;
  onSubmitCharacter(character: ICharacter): void;
  connecting: boolean;
  error: any;
}> = (props) => {
  const { t } = useTranslate();
  const [playerName, setPlayerName] = useState(playerNameSingleton);
  const charactersManager = useContext(CharactersContext);

  useEffect(() => {
    if (charactersManager.state.selectedCharacter) {
      props.onSubmitCharacter(charactersManager.state.selectedCharacter);
    }
  }, [charactersManager.state.selectedCharacter]);

  useEffect(() => {
    playerNameSingleton = playerName;
  }, [playerName]);

  return (
    <Page>
      <Box>
        <Box pb="1rem">
          <Container maxWidth="xs">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                props.onSubmitPlayerName(playerName);
              }}
            >
              <Box pb="2rem" textAlign="center">
                <img width="150px" src={appIcon} />
              </Box>
              <Box pb="2rem" textAlign="center">
                <Typography variant="h4">
                  {t("play-route.connect-to-game")}
                </Typography>
              </Box>
              <Box pb="1rem">
                <InputLabel shrink>{t("play-route.character-name")}</InputLabel>
                <TextField
                  placeholder="Magnus Burnsides"
                  value={playerName}
                  onChange={(event) => {
                    setPlayerName(event.target.value);
                  }}
                  inputProps={{
                    maxLength: "50",
                  }}
                  fullWidth
                  autoFocus
                  required
                />
              </Box>
              <Box pb="2rem">
                <Grid container justify="center">
                  <Grid item>
                    <Button
                      type="submit"
                      variant={playerName ? "contained" : "outlined"}
                      color="primary"
                    >
                      {playerName
                        ? t("play-route.join-as", { playerName: playerName })
                        : t("play-route.join")}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              <Collapse in={props.connecting}>
                <Box pb="1rem">
                  <Box pb="3rem" display="flex" justifyContent="center">
                    <Typography>{t("play-route.awesome-name")}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="center">
                    <CircularProgress />
                  </Box>
                </Box>
              </Collapse>

              <Collapse in={props.error}>
                <Box pb="1rem" textAlign="center">
                  <Typography color="error">
                    {t("play-route.join-error")}
                  </Typography>
                </Box>
              </Collapse>
            </form>
          </Container>
        </Box>
        <Box>
          <Grid container justify="center">
            <Grid item>
              <Button
                color="primary"
                onClick={() => {
                  charactersManager.actions.openManager(
                    CharactersManagerMode.Use
                  );
                }}
              >
                {t("play-route.or-pick-existing")}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Page>
  );
};

JoinAGame.displayName = "JoinAGame";
