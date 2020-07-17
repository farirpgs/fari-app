import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Container,
  Fade,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import appIcon from "../../../../images/app-icon.png";
import { ICharacter } from "../../../contexts/CharactersContext";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { CharacterManager } from "../../Characters/CharacterManager";

let playerNameSingleton = "";

export const JoinAGame: React.FC<{
  onSubmitPlayerName(playerName: string): void;
  onSubmitCharacter(character: ICharacter): void;
  connecting: boolean;
  error: any;
}> = (props) => {
  const { t } = useTranslate();
  const [playerName, setPlayerName] = useState(playerNameSingleton);

  useEffect(() => {
    playerNameSingleton = playerName;
  }, [playerName]);

  return (
    <Fade in>
      <Box>
        <Box pb="3rem">
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
        <Box pb="5rem">
          <Typography variant="h6" align="center">
            {t("play-route.or-pick-existing")}
          </Typography>
        </Box>
        <Container>
          <CharacterManager
            onSelection={(c) => {
              props.onSubmitCharacter(c);
            }}
          />
        </Container>
      </Box>
    </Fade>
  );
};

JoinAGame.displayName = "JoinAGame";
