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
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import BugReportIcon from "@material-ui/icons/BugReport";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import ErrorIcon from "@material-ui/icons/Error";
import FaceIcon from "@material-ui/icons/Face";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import LoupeIcon from "@material-ui/icons/Loupe";
import NoteIcon from "@material-ui/icons/Note";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import SortIcon from "@material-ui/icons/Sort";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { css, cx } from "emotion";
import React, { useEffect, useRef, useState } from "react";
import { Prompt } from "react-router";
import { ContentEditable } from "../../components/ContentEditable/ContentEditable";
import { IndexCard } from "../../components/IndexCard/IndexCard";
import { IndexCardColor } from "../../components/IndexCard/IndexCardColor";
import { MagicGridContainer } from "../../components/MagicGridContainer/MagicGridContainer";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { arraySort } from "../../domains/array/arraySort";
import { Dice } from "../../domains/dice/Dice";
import { Font } from "../../domains/font/Font";
import { useButtonTheme } from "../../hooks/useButtonTheme/useButtonTheme";
import { usePeerConnections } from "../../hooks/usePeerJS/usePeerConnection";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { JoinAGame } from "./components/JoinAGame";
import { PlayerRow } from "./components/PlayerRow";
import { IPeerActions } from "./IPeerActions";
import { AspectType } from "./useScene/AspectType";
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
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const errorTheme = useButtonTheme(theme.palette.error.main);
  const textColors = useTextColors(theme.palette.primary.main);
  const { t } = useTranslate();
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
      <Prompt when={isGM || isOffline} message={t("play-route.leave-prompt")} />
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
          <DialogTitle id="form-dialog-title">
            {t("play-route.add-character")}
          </DialogTitle>
          <DialogContent>
            <InputLabel shrink>{t("play-route.character-name")}</InputLabel>
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
              {t("play-route.cancel")}
            </Button>
            <Button type="submit" color="primary">
              {t("play-route.add-character")}
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
          <Grid container spacing={2} alignItems="center">
            <Grid
              item
              className={css({
                flex: "1 0 auto",
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
                {t("play-route.players")}
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
                  {t("play-route.connected")}
                </Typography>
              </Box>
            </Grid>
            {isGM && (
              <Grid item>
                <Button
                  onClick={() => {
                    sceneManager.actions.resetInitiative();
                  }}
                  variant="contained"
                  color="secondary"
                  endIcon={<EmojiPeopleIcon></EmojiPeopleIcon>}
                >
                  {t("play-route.reset-initiative")}
                </Button>
              </Grid>
            )}
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  if (isGM) {
                    sceneManager.actions.updatePlayerRoll(
                      sceneManager.state.scene.gm.id,
                      Dice.roll4DF()
                    );
                  } else {
                    connectionsManager.actions.sendToHost<IPeerActions>({
                      action: "roll",
                      payload: Dice.roll4DF(),
                    });
                  }
                }}
              >
                {t("play-route.roll")}
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
                      isMe={props.userId === player.id}
                      player={player}
                      offline={isOffline}
                      onPlayerRemove={() => {
                        sceneManager.actions.removeOfflinePlayer(player.id);
                      }}
                      onDiceRoll={() => {
                        if (isGM) {
                          sceneManager.actions.updatePlayerRoll(
                            player.id,
                            Dice.roll4DF()
                          );
                        } else {
                          connectionsManager.actions.sendToHost<IPeerActions>({
                            action: "roll",
                            payload: Dice.roll4DF(),
                          });
                        }
                      }}
                      onPlayedInTurnOrderChange={(playedInTurnOrder) => {
                        if (isGM) {
                          sceneManager.actions.updatePlayerPlayedDuringTurn(
                            player.id,
                            playedInTurnOrder
                          );
                        } else {
                          connectionsManager.actions.sendToHost<IPeerActions>({
                            action: "played-in-turn-order",
                            payload: playedInTurnOrder,
                          });
                        }
                      }}
                      onFatePointsChange={(fatePoints) => {
                        if (isGM) {
                          sceneManager.actions.updatePlayerFatePoints(
                            player.id,
                            fatePoints
                          );
                        } else {
                          connectionsManager.actions.sendToHost<IPeerActions>({
                            action: "update-fate-point",
                            payload: fatePoints,
                          });
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
            {t("play-route.name")}
          </Typography>
        </TableCell>
        <TableCell className={tableCellStyle} align="center">
          <Tooltip title={t("play-route.initiative-tracker")}>
            <Typography variant="overline" noWrap>
              {t("play-route.init")}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell className={tableCellStyle} align="center">
          <Tooltip title={t("play-route.fate-points")}>
            <Typography variant="overline" noWrap>
              {t("play-route.fp")}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell className={tableCellStyle} align="right">
          <Typography variant="overline" noWrap>
            {t("play-route.dice")}
          </Typography>
        </TableCell>
      </TableRow>
    );
  }

  function renderMainContent() {
    const aspectIds = Object.keys(sceneManager.state.scene.aspects);
    const hasAspects = aspectIds.length > 0;
    const sortedAspectIds = arraySort(aspectIds, [
      (id) => {
        const aspect = sceneManager.state.scene.aspects[id];
        return { value: aspect.type, direction: "asc" };
      },
    ]);
    const aspects = sceneManager.state.scene.sort ? sortedAspectIds : aspectIds;
    return (
      <Box pb="2rem">
        {hasAspects && (
          <MagicGridContainer items={aspectIds.length}>
            {aspects.map((aspectId) => {
              return (
                <Box
                  key={aspectId}
                  className={cx(
                    css({
                      width: isSmall ? "100%" : "33%",
                      padding: "0 .5rem 1.5rem .5rem",
                    })
                  )}
                >
                  <IndexCard
                    key={aspectId}
                    aspect={sceneManager.state.scene.aspects[aspectId]}
                    readonly={!isGM}
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
                    onPlayedInTurnOrderChange={(playedDuringTurn) => {
                      sceneManager.actions.updateAspectPlayerDuringTurn(
                        aspectId,
                        playedDuringTurn
                      );
                    }}
                  ></IndexCard>
                </Box>
              );
            })}
          </MagicGridContainer>
        )}
        {!hasAspects && (
          <Box pt="6rem" textAlign="center">
            {isGM ? (
              <Typography variant="h6">
                {t("play-route.click-on-the-")}
                <Button
                  variant="contained"
                  color="secondary"
                  className={css({
                    margin: "0 .5rem",
                  })}
                  onClick={() => {
                    sceneManager.actions.addAspect(AspectType.Aspect);
                  }}
                  endIcon={<NoteIcon></NoteIcon>}
                >
                  {t("play-route.click-on-the-add-aspect-")}
                </Button>
                {t("play-route.click-on-the-add-aspect-button")}
              </Typography>
            ) : (
              <Typography variant="h6">{t("play-route.no-aspects")}</Typography>
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
            <>
              <Box pb="1rem">
                <Grid container spacing={1} justify="center">
                  <Grid item>
                    <Button
                      onClick={() => {
                        sceneManager.actions.addAspect(AspectType.Aspect);
                      }}
                      variant="contained"
                      color="secondary"
                      endIcon={<NoteIcon></NoteIcon>}
                    >
                      {t("play-route.add-aspect")}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => {
                        sceneManager.actions.addAspect(AspectType.Boost);
                      }}
                      variant="contained"
                      color="secondary"
                      endIcon={<LoupeIcon></LoupeIcon>}
                    >
                      {t("play-route.add-boost")}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => {
                        sceneManager.actions.addAspect(AspectType.NPC);
                      }}
                      variant="contained"
                      color="secondary"
                      endIcon={<FaceIcon></FaceIcon>}
                    >
                      {t("play-route.add-npc")}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => {
                        sceneManager.actions.addAspect(AspectType.BadGuy);
                      }}
                      variant="contained"
                      color="secondary"
                      endIcon={<BugReportIcon></BugReportIcon>}
                    >
                      {t("play-route.add-bad-guy")}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              <Grid container spacing={1} justify="center">
                <Grid item>
                  <Button
                    onClick={() => {
                      sceneManager.actions.fireGoodConfetti();
                    }}
                    variant="text"
                    color="primary"
                  >
                    <ThumbUpIcon></ThumbUpIcon>
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => {
                      sceneManager.actions.fireBadConfetti();
                    }}
                    variant="text"
                    color="primary"
                  >
                    <ThumbDownIcon></ThumbDownIcon>
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => {
                      props.sceneManager.actions.toggleSort();
                    }}
                    variant="outlined"
                    color={
                      props.sceneManager.state.scene.sort
                        ? "secondary"
                        : "default"
                    }
                    endIcon={<SortIcon></SortIcon>}
                  >
                    {t("play-route.sort")}
                  </Button>
                </Grid>
                {isOffline && (
                  <Grid item>
                    <Button
                      onClick={() => {
                        setOfflineCharacterDialogOpen(true);
                      }}
                      variant="outlined"
                      color="default"
                      endIcon={<PersonAddIcon></PersonAddIcon>}
                    >
                      {t("play-route.add-character")}
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
                        variant="outlined"
                        color="default"
                        endIcon={<FileCopyIcon></FileCopyIcon>}
                      >
                        {t("play-route.copy-game-link")}
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
                  <ThemeProvider theme={errorTheme}>
                    <Button
                      onClick={() => {
                        const confirmed = confirm(
                          t("play-route.reset-scene-confirmation")
                        );
                        if (confirmed) {
                          sceneManager.actions.reset();
                        }
                      }}
                      className={css({ borderRadius: "20px" })}
                      variant="text"
                      color="primary"
                      endIcon={<ErrorIcon></ErrorIcon>}
                    >
                      {t("play-route.reset-scene")}
                    </Button>
                  </ThemeProvider>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Box>
    );
  }

  function renderPageError() {
    return (
      <Box>
        <Box display="flex" justifyContent="center" pb="2rem">
          <Typography variant="h4">{t("play-route.error.title")}</Typography>
        </Box>
        <Box display="flex" justifyContent="center">
          <Typography variant="h6">
            {t("play-route.error.description1")}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center">
          <Typography variant="h6">
            {t("play-route.error.description2")}
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
    : removeHTMLTags(removeNBSP(sceneName)).trim();
}

function removeNBSP(value: string) {
  return value.replace(/&nbsp;/g, " ");
}

function removeHTMLTags(value: string) {
  return value.replace(/<\/?[^>]+(>|$)/g, " ");
}
