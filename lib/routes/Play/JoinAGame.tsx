import {
  Box,
  Button,
  CircularProgress,
  Container,
  InputLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import appIcon from "../../../images/app-icon.png";

let playerNameSingleton = "";
export const JoinAGame: React.FC<{
  onSubmit(playerName: string): void;
  connecting: boolean;
  error: any;
}> = (props) => {
  const [playerName, setPlayerName] = useState(playerNameSingleton);

  useEffect(() => {
    playerNameSingleton = playerName;
  }, [playerName]);

  return (
    <Box>
      <Container maxWidth="xs">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            props.onSubmit(playerName);
          }}
        >
          <Box pb="2rem" textAlign="center">
            <img width="150px" src={appIcon} />
          </Box>
          <Box pb="2rem" textAlign="center">
            <Typography variant="h4">Connect to a Game</Typography>
          </Box>
          <Box pb="2rem">
            <InputLabel shrink>Character Name:</InputLabel>
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
            ></TextField>
          </Box>
          <Box pb="2rem">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Play!
            </Button>
          </Box>
          {props.connecting && (
            <Box pb="1rem">
              <Box pb="3rem" display="flex" justifyContent="center">
                <Typography>{"That's an awesome name by the way!"}</Typography>
              </Box>
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            </Box>
          )}
          {props.error && (
            <Box pb="1rem" textAlign="center">
              <Typography color="error">
                The game you are trying to join does not exist
              </Typography>
            </Box>
          )}
        </form>
      </Container>
    </Box>
  );
};

JoinAGame.displayName = "JoinAGame";
