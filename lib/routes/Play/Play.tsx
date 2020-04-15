import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  InputLabel,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { css } from "emotion";
import produce from "immer";
import Peer from "peerjs";
import React, { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import logo from "../../../images/app-icon.png";
import { Page } from "../../components/Page/Page";
import { Dice } from "../../domains/dice/Dice";
import { Font } from "../../domains/font/Font";
import { useTextColors } from "../../hooks/useTextColors";
import { ContentEditable } from "./ContentEditable";
import { DevTool } from "./DevTool";
import { IndexCard } from "./IndexCard";
import { usePeerConnections } from "./usePeerConnections";
import { usePeerHost } from "./usePeerHost";
import { usePeerJS } from "./usePeerJS";

const debug = false;
const defaultSceneName = "Name of your scene...";
const defaultSceneAspect = {
  title: "",
  content: "<br/>",
  checkboxes: [],
  consequences: [],
};
const defaultAscpects = { [uuidV4()]: defaultSceneAspect };
interface IScene {
  name: string;
  aspects: Record<
    string,
    {
      title: string;
      content: string;
      checkboxes: Array<boolean>;
      consequences: Array<string>;
    }
  >;
  gm: {
    roll?: number;
  };
  players: Array<{ id: string; playerName: string; roll?: number }>;
}

export const Play: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  // PEER
  const idFromProps = props.match.params.id;
  const theme = useTheme();
  const textColors = useTextColors(theme.palette.primary.main);

  const peerManager = usePeerJS({
    debug: debug,
  });
  const hostManager = usePeerHost({
    peer: peerManager.state.peer,
    onConnectionDataReceive(id: string, roll: number) {
      updatePlayerRoll(id, roll);
    },
    debug: debug,
  });
  const connectionsManager = usePeerConnections({
    peer: peerManager.state.peer,
    onHostDataReceive(newScene) {
      setScene(newScene);
    },
    debug: debug,
  });

  // ROUTE
  const [scene, setScene] = useState<IScene>({
    name: defaultSceneName,
    aspects: defaultAscpects,
    gm: {},
    players: [],
  });
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    hostManager.actions.sendToConnections(scene);
  }, [scene]);

  useEffect(() => {
    if (isGM) {
      updateScenePlayers(hostManager.state.connections);
    }
  }, [hostManager.state.connections]);

  function resetScene() {
    setScene(
      produce((draft) => {
        draft.name = defaultSceneName;
        draft.aspects = defaultAscpects;
      })
    );
  }
  function setSceneName(name: string) {
    setScene(
      produce((draft) => {
        draft.name = name;
      })
    );
  }

  function addSceneAspect() {
    setScene(
      produce((draft) => {
        const id = uuidV4();
        draft.aspects[id] = defaultSceneAspect;
      })
    );
  }

  function removeSceneAspect(id: string) {
    setScene(
      produce((draft) => {
        delete draft.aspects[id];
      })
    );
  }

  function resetSceneAspect(id: string) {
    setScene(
      produce((draft) => {
        draft.aspects[id] = defaultSceneAspect;
      })
    );
  }

  function updateSceneAspectTitle(id: string, title: string) {
    setScene(
      produce((draft) => {
        draft.aspects[id].title = title;
      })
    );
  }

  function updateSceneAspectContent(id: string, content: string) {
    setScene(
      produce((draft) => {
        draft.aspects[id].content = content;
      })
    );
  }

  function addSceneAspectCheckboxes(id: string, amount: number) {
    setScene(
      produce((draft) => {
        for (let i = 0; i < amount; i++) {
          draft.aspects[id].checkboxes.push(false);
        }
      })
    );
  }

  function updateSceneAspectCheckbox(
    id: string,
    index: number,
    value: boolean
  ) {
    setScene(
      produce((draft) => {
        draft.aspects[id].checkboxes[index] = value;
      })
    );
  }

  function addSceneAspectConsequence(id: string, amount: number) {
    setScene(
      produce((draft) => {
        for (let i = 0; i < amount; i++) {
          draft.aspects[id].consequences.push("");
        }
      })
    );
  }

  function updateSceneAspectConsequence(
    id: string,
    index: number,
    value: string
  ) {
    setScene(
      produce((draft) => {
        draft.aspects[id].consequences[index] = value;
      })
    );
  }

  function updateScenePlayers(connections: Array<Peer.DataConnection>) {
    setScene(
      produce((draft) => {
        draft.players = connections.map((c) => {
          return { id: c.label, playerName: c.metadata.playerName };
        });
      })
    );
  }

  function updateGMRoll() {
    setScene(
      produce((draft) => {
        draft.gm.roll = Dice.runFudgeDice();
      })
    );
  }

  function updatePlayerRoll(id: string, roll: number) {
    setScene(
      produce((draft) => {
        draft.players.forEach((player) => {
          if (player.id === id) {
            player.roll = roll;
          }
        });
      })
    );
  }

  const isGM = !idFromProps;
  const shareLink = `${location.origin}/play/${peerManager.state.hostId}`;

  return (
    <Page h1="" appBarActions={<Box></Box>}>
      {peerManager.state.error ? renderError() : renderPage()}
      <DevTool
        data={{
          hostId: peerManager.state.hostId,
          href: shareLink,
          numberOfConnections: hostManager.state.numberOfConnections,
          isConnectedToHost: connectionsManager.state.isConnectedToHost,
          error: peerManager.state.error,
          scene: scene,
        }}
      ></DevTool>
    </Page>
  );

  function renderPage() {
    if (!peerManager.state.hostId) {
      return renderIsLoading();
    }
    return renderPageContent();
  }

  function renderIsLoading() {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress></CircularProgress>
      </Box>
    );
  }

  function renderError() {
    return (
      <Box>
        <Box display="flex" justifyContent="center">
          <Typography variant="h4">Something wrong hapenned.</Typography>
        </Box>
        <Box display="flex" justifyContent="center">
          <Typography variant="h6">
            We could not connect to the server to initialize the play session.
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center">
          <Typography variant="h6">
            Try to refresh the page to see if that fixes the issue.
          </Typography>
        </Box>
      </Box>
    );
  }

  function renderPlayerPreScreen() {
    return (
      <Box>
        <Container maxWidth="xs">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              connectionsManager.actions.connect(idFromProps, {
                playerName: playerName,
              });
            }}
          >
            <Box pb="2rem" textAlign="center">
              <img width="150px" src={logo} />
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
            {connectionsManager.state.connectingToHost && (
              <Box pb="1rem">
                <Box pb="3rem" display="flex" justifyContent="center">
                  <Typography>
                    {"That's an awesome name by the way!"}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              </Box>
            )}
            {connectionsManager.state.connectingToHostError && (
              <Box pb="1rem" textAlign="center">
                <Typography color="error">
                  It seems the game you are trying to join does not exists
                </Typography>
              </Box>
            )}
          </form>
        </Container>
      </Box>
    );
  }

  function renderPageContent() {
    if (!isGM && !connectionsManager.state.isConnectedToHost) {
      return renderPlayerPreScreen();
    }
    return (
      <Box>
        {renderHeader()}
        <Grid container>
          <Grid item xs={3}>
            {renderSidePanel()}
          </Grid>
          <Grid item xs={9}>
            {renderMainContent()}
          </Grid>
        </Grid>
      </Box>
    );
  }

  function renderSidePanel() {
    return (
      <Box display="flex" flexDirection="column" height="100%">
        <Box
          className={css({
            backgroundColor: theme.palette.primary.main,
            color: textColors.primary,
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
            minHeight: "4rem",
            padding: ".5rem",
          })}
        >
          <Typography
            variant="overline"
            className={css({
              fontSize: ".8rem",
              lineHeight: Font.lineHeight(0.8),
              fontWeight: "bold",
            })}
          >
            Players:
          </Typography>
          <Box>
            <Typography
              variant="overline"
              className={css({
                fontSize: "1.2rem",
                lineHeight: Font.lineHeight(1.2),
              })}
            >
              {scene.players.length + 1}
            </Typography>
            <Typography
              variant="caption"
              className={css({
                fontSize: ".8rem",
                lineHeight: Font.lineHeight(0.8),
              })}
            >
              {" "}
              connected
            </Typography>
          </Box>
        </Box>

        <Paper>
          <Box bgcolor="#fff" minHeight="10rem" flex="1 0 auto">
            <Box pt=".5rem" px=".5rem">
              <Typography
                variant="overline"
                color="primary"
                className={css({
                  fontSize: "1.2rem",
                  lineHeight: Font.lineHeight(1.2),
                })}
              >
                GM{scene.gm.roll !== undefined && `: rolled a ${scene.gm.roll}`}
              </Typography>
            </Box>
            {scene.players.map((p) => {
              return (
                <Box key={p.id} px=".5rem">
                  <Typography
                    variant="overline"
                    className={css({
                      fontSize: "1.2rem",
                      lineHeight: Font.lineHeight(1.2),
                    })}
                  >
                    {p.playerName}
                    {p.roll !== undefined && `: rolled a ${p.roll}`}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Box>
    );
  }

  function renderHeader() {
    return (
      <Box pb="2rem">
        <Grid
          container
          spacing={2}
          justify="space-between"
          alignItems="baseline"
        >
          <Grid item xs={6}>
            <Box>
              <Typography
                variant="h4"
                className={css({
                  borderBottom: "1px solid #ddd",
                })}
              >
                <ContentEditable
                  value={scene.name}
                  disabled={!isGM}
                  onChange={(value) => {
                    setSceneName(value);
                  }}
                ></ContentEditable>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            {isGM ? (
              <Box display="flex" justifyContent="flex-end">
                <Button
                  onClick={() => {
                    addSceneAspect();
                  }}
                >
                  Add Aspect
                </Button>
                <Button
                  onClick={() => {
                    updateGMRoll();
                  }}
                >
                  Roll 4df
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                  }}
                >
                  Copy Share Link
                </Button>
                <Button
                  onClick={() => {
                    resetScene();
                  }}
                >
                  Reset
                </Button>
              </Box>
            ) : (
              <Box display="flex">
                <Button
                  onClick={() => {
                    connectionsManager.actions.sendToHost(Dice.runFudgeDice());
                  }}
                >
                  Roll 4df
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    );
  }

  function renderMainContent() {
    return (
      <Box pl="1rem">
        <Box display="flex" justifyContent="flex-end"></Box>

        <Box pb="2rem">
          <Grid container spacing={2}>
            {Object.keys(scene.aspects).map((aspectId) => {
              return (
                <Grid item xs={4} key={aspectId}>
                  <IndexCard
                    title={scene.aspects[aspectId].title}
                    content={scene.aspects[aspectId].content}
                    checkboxes={scene.aspects[aspectId].checkboxes}
                    consequences={scene.aspects[aspectId].consequences}
                    disabled={!isGM}
                    onRemove={() => {
                      removeSceneAspect(aspectId);
                    }}
                    onReset={() => {
                      resetSceneAspect(aspectId);
                    }}
                    onTitleChange={(value) => {
                      updateSceneAspectTitle(aspectId, value);
                    }}
                    onContentChange={(value) => {
                      updateSceneAspectContent(aspectId, value);
                    }}
                    onCheckboxChange={(index, value) => {
                      updateSceneAspectCheckbox(aspectId, index, value);
                    }}
                    onConsequenceChange={(index, value) => {
                      updateSceneAspectConsequence(aspectId, index, value);
                    }}
                    onAddCheckbox={(amount) => {
                      addSceneAspectCheckboxes(aspectId, amount);
                    }}
                    onAddConsequence={(amount) => {
                      addSceneAspectConsequence(aspectId, amount);
                    }}
                  ></IndexCard>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    );
  }
};

Play.displayName = "Play";
