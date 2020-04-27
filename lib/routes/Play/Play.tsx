import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Fade,
  Grid,
  Hidden,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import { css, cx } from "emotion";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { ContentEditable } from "../../components/ContentEditable/ContentEditable";
import { DevTool } from "../../components/DevTool/DevTool";
import { IndexCard } from "../../components/IndexCard/IndexCard";
import { IndexCardColor } from "../../components/IndexCard/IndexCardColor";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Dice } from "../../domains/dice/Dice";
import { Font } from "../../domains/font/Font";
import { useButtonTheme } from "../../hooks/useButtonTheme/useButtonTheme";
import { usePeerConnections as usePeerConnection } from "../../hooks/usePeerJS/usePeerConnection";
import { usePeerHost } from "../../hooks/usePeerJS/usePeerHost";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { JoinAGame } from "./JoinAGame";
import { PlayerRow } from "./PlayerRow";
import { defaultSceneName, useScene } from "./useScene/useScene";

const debug = false;
export const Play: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const idFromProps = props.match.params.id;
  const [userId] = useState(() => {
    return uuidV4();
  });
  const shareLinkInputRef = useRef<HTMLInputElement>();
  const [shareLinkToolTip, setShareLinkToolTip] = useState({ open: false });
  const theme = useTheme();
  const errorTheme = useButtonTheme(theme.palette.error.main);
  const textColors = useTextColors(theme.palette.primary.main);
  const sceneManager = useScene(userId, idFromProps);

  const hostManager = usePeerHost({
    onConnectionDataReceive(id: string, roll: number) {
      sceneManager.actions.updatePlayerRoll(id, roll);
    },
    debug: debug,
  });
  const connectionsManager = usePeerConnection({
    onHostDataReceive(newScene) {
      sceneManager.actions.setScene(newScene);
    },
    debug: debug,
  });

  useEffect(() => {
    hostManager.actions.sendToConnections(sceneManager.state.scene);
  }, [sceneManager.state.scene]);

  useEffect(() => {
    if (isGM) {
      sceneManager.actions.updatePlayers(hostManager.state.connections);
    }
  }, [hostManager.state.connections]);

  useEffect(() => {
    if (shareLinkToolTip.open) {
      const id = setTimeout(() => {
        setShareLinkToolTip({ open: false });
      }, 1000);
      return () => {
        clearTimeout(id);
      };
    }
  }, [shareLinkToolTip]);

  const isGM = !idFromProps;
  const shareLink = `${location.origin}/play/${hostManager.state.hostId}`;
  const everyone = [
    sceneManager.state.scene.gm,
    ...sceneManager.state.scene.players,
  ];
  const sceneName = sceneManager.state.scene.name;
  const pageTitle = sceneName === defaultSceneName ? "" : sceneName;
  return (
    <Page gameId={idFromProps}>
      <PageMeta title={pageTitle}></PageMeta>
      {hostManager.state.error ? renderPageError() : renderPage()}
      <DevTool
        data={{
          hostId: hostManager.state.hostId,
          href: shareLink,
          numberOfConnections: hostManager.state.numberOfConnections,
          isConnectedToHost: connectionsManager.state.isConnectedToHost,
          error: hostManager.state.error,
          scene: sceneManager.state.scene,
        }}
      ></DevTool>
    </Page>
  );

  function renderPage() {
    if (hostManager.state.loading || connectionsManager.state.loading) {
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

  function renderPageContent() {
    if (!isGM && !connectionsManager.state.isConnectedToHost) {
      return (
        <JoinAGame
          connecting={connectionsManager.state.connectingToHost}
          error={connectionsManager.state.connectingToHostError}
          onSubmit={(playerName) => {
            connectionsManager.actions.connect(idFromProps, userId, {
              playerName: playerName,
            });
          }}
        ></JoinAGame>
      );
    }
    return (
      <Fade in>
        <Box>
          {renderHeader()}
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              {renderSidePanel()}
            </Grid>
            <Grid item xs={12} md={9}>
              {renderMainContent()}
            </Grid>
          </Grid>
        </Box>
      </Fade>
    );
  }

  function renderSidePanel() {
    return (
      <Box display="flex" flexDirection="column" height="100%" pb="1rem">
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
          <Grid
            container
            spacing={2}
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
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
                  {sceneManager.state.scene.players.length + 1}
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
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  if (isGM) {
                    sceneManager.actions.updateGMRoll();
                  } else {
                    connectionsManager.actions.sendToHost(Dice.rollFudgeDice());
                  }
                }}
              >
                Roll 4DF
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Paper>
          <TableContainer component={Paper}>
            <Table
              size="small"
              className={css({
                tableLayout: "fixed",
              })}
            >
              <TableHead>{renderPlayerRowHeader()}</TableHead>
              <TableBody>
                {everyone.map((player) => {
                  return (
                    <PlayerRow
                      key={player.id}
                      isGM={isGM}
                      highlight={userId === player.id}
                      player={player}
                      onPlayedInTurnOrderChange={(playedInTurnOrder) => {
                        if (isGM) {
                          sceneManager.actions.updatePlayerPlayedStatus(
                            player.id,
                            playedInTurnOrder
                          );
                        }
                      }}
                      onPlayerFatePointsChange={(playedInTurnOrder) => {
                        if (isGM) {
                          sceneManager.actions.updatePlayerFatePoints(
                            player.id,
                            playedInTurnOrder
                          );
                        }
                      }}
                    ></PlayerRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    );
  }

  function renderPlayerRowHeader() {
    const tableCellStyle = css({ padding: ".375rem 1.5rem .375rem 1rem" });
    const firstTableCellStyle = css({ width: "50%" });

    return (
      <TableRow>
        <TableCell className={cx(tableCellStyle, firstTableCellStyle)}>
          <Typography variant="overline" noWrap>
            Name
          </Typography>
        </TableCell>
        <TableCell className={tableCellStyle}>
          <Tooltip title="Initiative Tracker">
            <Typography variant="overline" noWrap>
              Init
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell className={tableCellStyle}>
          <Tooltip title="Fate Points">
            <Typography variant="overline" noWrap>
              F.P.
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell className={tableCellStyle} align="right">
          <Typography variant="overline" noWrap>
            Dice
          </Typography>
        </TableCell>
      </TableRow>
    );
  }

  function renderMainContent() {
    const aspectIds = Object.keys(sceneManager.state.scene.aspects);
    const shouldRenderEmptyAspectView = aspectIds.length === 0;
    return (
      <Box pb="2rem">
        <Grid container spacing={2}>
          {shouldRenderEmptyAspectView && (
            <Grid item xs={12}>
              <Box pt="6rem" textAlign="center">
                {isGM ? (
                  <Typography variant="h6">
                    Click on the
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={css({
                        margin: "0 .5rem",
                      })}
                      onClick={() => {
                        sceneManager.actions.addAspect();
                      }}
                    >
                      Add Aspect
                    </Button>
                    button to add a new Aspect to the Scene
                  </Typography>
                ) : (
                  <Typography variant="h6">
                    There is not aspects on the scene yet
                  </Typography>
                )}
              </Box>
            </Grid>
          )}
          {aspectIds.map((aspectId) => {
            return (
              <Grid item xs={12} sm={12} md={4} key={aspectId}>
                <IndexCard
                  title={sceneManager.state.scene.aspects[aspectId].title}
                  readonly={!isGM}
                  content={sceneManager.state.scene.aspects[aspectId].content}
                  color={sceneManager.state.scene.aspects[aspectId].color}
                  isBoost={sceneManager.state.scene.aspects[aspectId].isBoost}
                  freeInvokes={
                    sceneManager.state.scene.aspects[aspectId].freeInvokes
                  }
                  physicalStress={
                    sceneManager.state.scene.aspects[aspectId].physicalStress
                  }
                  mentalStress={
                    sceneManager.state.scene.aspects[aspectId].mentalStress
                  }
                  consequences={
                    sceneManager.state.scene.aspects[aspectId].consequences
                  }
                  onRemove={() => {
                    sceneManager.actions.removeAspect(aspectId);
                  }}
                  onReset={() => {
                    sceneManager.actions.resetAspect(aspectId);
                  }}
                  onTitleChange={(value) => {
                    sceneManager.actions.updateAspectTitle(aspectId, value);
                  }}
                  onContentChange={(value) => {
                    sceneManager.actions.updateAspectContent(aspectId, value);
                  }}
                  onFreeInvokeChange={(index, value) => {
                    sceneManager.actions.updateAspectFreeInvoke(
                      aspectId,
                      index,
                      value
                    );
                  }}
                  onPhysicalStressChange={(index, value) => {
                    sceneManager.actions.updateAspectPhysicalStress(
                      aspectId,
                      index,
                      value
                    );
                  }}
                  onMentalStressChange={(index, value) => {
                    sceneManager.actions.updateAspectMentalStress(
                      aspectId,
                      index,
                      value
                    );
                  }}
                  onConsequenceChange={(index, value) => {
                    sceneManager.actions.updateAspectConsequence(
                      aspectId,
                      index,
                      value
                    );
                  }}
                  onAddAspectFreeInvoke={() => {
                    sceneManager.actions.addAspectFreeInvoke(aspectId);
                  }}
                  onAddAspectPhysicalStress={() => {
                    sceneManager.actions.addAspectPhysicalStress(aspectId);
                  }}
                  onAddAspectMentalStress={() => {
                    sceneManager.actions.addAspectMentalStress(aspectId);
                  }}
                  onAddConsequence={() => {
                    sceneManager.actions.addAspectConsequence(aspectId);
                  }}
                  onUpdateAspectColor={(color: IndexCardColor) => {
                    sceneManager.actions.updateAspectColor(aspectId, color);
                  }}
                ></IndexCard>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  }

  function renderHeader() {
    return (
      <Box pb="2rem">
        <Box pb="2rem">
          <Container maxWidth="sm">
            <Typography
              variant="h4"
              className={css({
                borderBottom: "1px solid #ddd",
                textAlign: "center",
              })}
            >
              <ContentEditable
                value={sceneManager.state.scene.name}
                readonly={!isGM}
                onChange={(value) => {
                  sceneManager.actions.setName(value);
                }}
              ></ContentEditable>
            </Typography>
          </Container>
        </Box>

        <Box>
          {isGM && (
            <Grid container spacing={1} justify="center">
              <Grid item>
                <Button
                  onClick={() => {
                    sceneManager.actions.addAspect();
                  }}
                  variant="outlined"
                  color="secondary"
                >
                  Add Aspect
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => {
                    sceneManager.actions.addBoost();
                  }}
                  variant="outlined"
                  color="secondary"
                >
                  Add Boost
                  <input
                    ref={shareLinkInputRef}
                    type="text"
                    value={shareLink}
                    readOnly
                    hidden
                  />
                </Button>
              </Grid>
              <Grid item>
                <Tooltip
                  open={shareLinkToolTip.open}
                  title="Copied!"
                  placement="top"
                >
                  <Button
                    onClick={() => {
                      shareLinkInputRef.current.select();
                      document.execCommand("copy");
                      navigator.clipboard.writeText(shareLink);
                      setShareLinkToolTip({ open: true });
                    }}
                  >
                    Copy Game Link
                  </Button>
                </Tooltip>
              </Grid>
              <Hidden smDown>
                <Grid item className={css({ display: "flex" })}>
                  <Divider orientation="vertical" flexItem />
                </Grid>
              </Hidden>
              <Grid item>
                <Button
                  onClick={() => {
                    sceneManager.actions.resetPlayerPlayedStatus();
                  }}
                >
                  Reset Turn Order
                </Button>
              </Grid>
              <Grid item>
                <ThemeProvider theme={errorTheme}>
                  <Button
                    onClick={() => {
                      sceneManager.actions.reset();
                    }}
                    className={css({ borderRadius: "20px" })}
                    variant="text"
                    color="primary"
                  >
                    Reset Scene
                  </Button>
                </ThemeProvider>
              </Grid>
            </Grid>
            // <Box
            //   display="flex"
            //   justifyContent="center"
            //   flexWrap="wrap"
            //   className={css({
            //     "& *": {
            //       margin: ".5rem",
            //       flex: "0 1 auto",
            //     },
            //   })}
            // >

            // </Box>
          )}
        </Box>
      </Box>
    );
  }

  function renderPageError() {
    return (
      <Box>
        <Box display="flex" justifyContent="center" pb="2rem">
          <Typography variant="h4">Something wrong hapenned.</Typography>
        </Box>
        <Box display="flex" justifyContent="center">
          <Typography variant="h6">
            We could not connect to the server to initialize the game
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center">
          <Typography variant="h6">
            Try refreshing the page to see if that fixes the issue.
          </Typography>
        </Box>
      </Box>
    );
  }
};

Play.displayName = "Play";
