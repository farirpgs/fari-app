import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  Grid,
  Hidden,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import { css, cx } from "emotion";
import React, { useEffect, useRef, useState } from "react";
import { Prompt } from "react-router";
import { ContentEditable } from "../../components/ContentEditable/ContentEditable";
import { IndexCard } from "../../components/IndexCard/IndexCard";
import { IndexCardColor } from "../../components/IndexCard/IndexCardColor";
import { MagicGridContainer } from "../../components/MagicGridContainer/MagicGridContainer";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Dice } from "../../domains/dice/Dice";
import { Font } from "../../domains/font/Font";
import { useButtonTheme } from "../../hooks/useButtonTheme/useButtonTheme";
import { usePeerConnections } from "../../hooks/usePeerJS/usePeerConnection";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { JoinAGame } from "./components/JoinAGame";
import { PlayerRow } from "./components/PlayerRow";
import { defaultSceneName, useScene } from "./useScene/useScene";

type IOnlineProps = {
  isLoading?: boolean;
  error?: any;
  shareLink?: string;
  connectionsManager?: ReturnType<typeof usePeerConnections>;
};

type IProps = IOnlineProps & {
  userId: string;
  idFromParams: string;
  sceneManager: ReturnType<typeof useScene>;
};

export const PlayPage: React.FC<IProps> = (props) => {
  const { sceneManager, connectionsManager } = props;
  const theme = useTheme();
  const errorTheme = useButtonTheme(theme.palette.error.main);
  const textColors = useTextColors(theme.palette.primary.main);
  const shareLinkInputRef = useRef<HTMLInputElement>();
  const [shareLinkToolTip, setShareLinkToolTip] = useState({ open: false });
  const [offlineCharacterDialogOpen, setOfflineCharacterDialogOpen] = useState(
    false
  );
  const [offlineCharacterName, setOfflineCharacterName] = useState("");
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

  const isGM = !props.idFromParams;
  const isOffline = !props.shareLink;
  const everyone = [
    sceneManager.state.scene.gm,
    ...sceneManager.state.scene.players,
  ];
  const sceneName = sceneManager.state.scene.name;
  const pageTitle = getPageTitle(sceneName);
  const shouldRenderPlayerJoinGameScreen =
    !isGM && !connectionsManager.state.isConnectedToHost;

  return (
    <Page gameId={props.idFromParams}>
      <Prompt
        when={isGM || isOffline}
        message="Are you sure you want to leave and reset your scene ?"
      />
      <PageMeta title={pageTitle}></PageMeta>
      {props.error ? renderPageError() : renderPage()}
    </Page>
  );

  function renderPage() {
    if (props.isLoading) {
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
    if (shouldRenderPlayerJoinGameScreen) {
      return (
        <JoinAGame
          connecting={connectionsManager.state.connectingToHost}
          error={connectionsManager.state.connectingToHostError}
          onSubmit={(playerName) => {
            connectionsManager.actions.connect(
              props.idFromParams,
              props.userId,
              {
                playerName: playerName,
              }
            );
          }}
        ></JoinAGame>
      );
    }
    return (
      <Fade in>
        <Box>
          {renderHeader()}
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              {renderSidePanel()}
            </Grid>
            <Grid item xs={12} md={8}>
              {renderMainContent()}
            </Grid>
          </Grid>
          {renderOfflineAddPlayerDialog()}
        </Box>
      </Fade>
    );
  }

  function renderOfflineAddPlayerDialog() {
    return (
      <Dialog
        fullWidth
        maxWidth="xs"
        open={offlineCharacterDialogOpen}
        onClose={() => {
          setOfflineCharacterDialogOpen(false);
          setOfflineCharacterName("");
        }}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            sceneManager.actions.addOfflinePlayer(offlineCharacterName);
            setOfflineCharacterDialogOpen(false);
            setOfflineCharacterName("");
          }}
        >
          <DialogTitle id="form-dialog-title">Add Character</DialogTitle>
          <DialogContent>
            <InputLabel shrink>Character Name:</InputLabel>
            <TextField
              autoFocus
              value={offlineCharacterName}
              onChange={(event) => {
                setOfflineCharacterName(event.target.value);
              }}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOfflineCharacterDialogOpen(false);
                setOfflineCharacterName("");
              }}
              color="default"
            >
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add Character
            </Button>
          </DialogActions>
        </form>
      </Dialog>
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
                      highlight={props.userId === player.id}
                      player={player}
                      offline={isOffline}
                      onPlayerRemove={() => {
                        sceneManager.actions.removeOfflinePlayer(player.id);
                      }}
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
    const tableCellStyle = css({ padding: ".375rem 1rem .375rem 1rem" });
    const firstTableCellStyle = css({ width: "50%" });

    return (
      <TableRow>
        <TableCell
          className={cx(tableCellStyle, firstTableCellStyle)}
          align="left"
        >
          <Typography variant="overline" noWrap>
            Name
          </Typography>
        </TableCell>
        <TableCell className={tableCellStyle} align="center">
          <Tooltip title="Initiative Tracker">
            <Typography variant="overline" noWrap>
              Init
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell className={tableCellStyle} align="center">
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
    const gutterPx = 16;
    return (
      <Box pb="2rem">
        <MagicGridContainer items={aspectIds.length} gutterPx={gutterPx}>
          {aspectIds.map((aspectId) => {
            return (
              <Box
                key={aspectId}
                className={css({ width: `calc(33% - ${gutterPx * 2}px)` })}
              >
                <IndexCard
                  key={aspectId}
                  className="grid-item"
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
              </Box>
            );
          })}
        </MagicGridContainer>
        {shouldRenderEmptyAspectView && (
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
        )}
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
                </Button>
              </Grid>
              {isOffline && (
                <Grid item>
                  <Button
                    onClick={() => {
                      setOfflineCharacterDialogOpen(true);
                    }}
                    variant="outlined"
                    color="secondary"
                  >
                    Add Character
                  </Button>
                </Grid>
              )}
              {props.shareLink && (
                <Grid item>
                  <input
                    ref={shareLinkInputRef}
                    type="text"
                    value={props.shareLink}
                    readOnly
                    hidden
                  />
                  <Tooltip
                    open={shareLinkToolTip.open}
                    title="Copied!"
                    placement="top"
                  >
                    <Button
                      onClick={() => {
                        shareLinkInputRef.current.select();
                        document.execCommand("copy");
                        navigator.clipboard.writeText(props.shareLink);
                        setShareLinkToolTip({ open: true });
                      }}
                    >
                      Copy Game Link
                    </Button>
                  </Tooltip>
                </Grid>
              )}
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
            Try refreshing the page to see if that fixes the issue or start an
            offline game instead.
          </Typography>
        </Box>
      </Box>
    );
  }
};

PlayPage.displayName = "PlayPage";

function getPageTitle(sceneName: string) {
  return sceneName === defaultSceneName
    ? ""
    : removeHTMLTags(removeNBSP(sceneName));
}

function removeNBSP(value: string) {
  return value.replace(/&nbsp;/g, "");
}

function removeHTMLTags(value: string) {
  return value.replace(/<\/?[^>]+(>|$)/g, "");
}
