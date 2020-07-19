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
  List,
  ListItem,
  ListItemText,
  Paper,
  Snackbar,
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
import GestureIcon from "@material-ui/icons/Gesture";
import LoupeIcon from "@material-ui/icons/Loupe";
import NoteIcon from "@material-ui/icons/Note";
import NoteOutlinedIcon from "@material-ui/icons/NoteOutlined";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ReplayIcon from "@material-ui/icons/Replay";
import SaveIcon from "@material-ui/icons/Save";
import SortIcon from "@material-ui/icons/Sort";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import UndoIcon from "@material-ui/icons/Undo";
import { Alert } from "@material-ui/lab";
import { css, cx } from "emotion";
import React, { useEffect, useRef, useState } from "react";
import { Prompt } from "react-router";
import { useCharacters } from "../../contexts/CharactersContext";
import { ScenesManagerMode, useScenes } from "../../contexts/ScenesContext";
import { arraySort } from "../../domains/array/arraySort";
import { Dice } from "../../domains/dice/Dice";
import { Font } from "../../domains/font/Font";
import { useButtonTheme } from "../../hooks/useButtonTheme/useButtonTheme";
import { usePeerConnections } from "../../hooks/usePeerJS/usePeerConnections";
import { AspectType } from "../../hooks/useScene/AspectType";
import { useScene } from "../../hooks/useScene/useScene";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { IPeerActions } from "../../routes/Play/types/IPeerActions";
import { ContentEditable } from "../ContentEditable/ContentEditable";
import { DrawArea, IDrawAreaHandles } from "../DrawArea/DrawArea";
import { IndexCard } from "../IndexCard/IndexCard";
import { IndexCardColorTypes } from "../IndexCard/IndexCardColor";
import { MagicGridContainer } from "../MagicGridContainer/MagicGridContainer";
import { Page } from "../Page/Page";
import { PlayerRow } from "./components/PlayerRow/PlayerRow";

export enum SceneMode {
  PlayOnline,
  PlayOffline,
  Manage,
}

type IProps =
  | {
      mode: SceneMode.Manage;
      sceneManager: ReturnType<typeof useScene>;
      scenesManager: ReturnType<typeof useScenes>;
      charactersManager: ReturnType<typeof useCharacters>;
      connectionsManager?: undefined;
      idFromParams?: undefined;
      isLoading?: undefined;
      error?: undefined;
    }
  | {
      mode: SceneMode.PlayOnline;
      sceneManager: ReturnType<typeof useScene>;
      scenesManager: ReturnType<typeof useScenes>;
      charactersManager: ReturnType<typeof useCharacters>;
      connectionsManager: ReturnType<typeof usePeerConnections>;
      userId: string;
      isLoading: boolean;
      error: any;
      shareLink: string;
      idFromParams?: string;
    }
  | {
      mode: SceneMode.PlayOffline;
      sceneManager: ReturnType<typeof useScene>;
      scenesManager: ReturnType<typeof useScenes>;
      charactersManager: ReturnType<typeof useCharacters>;
      connectionsManager?: undefined;
      idFromParams?: undefined;
      isLoading?: undefined;
      error?: undefined;
    };

export const Scene: React.FC<IProps> = (props) => {
  const {
    sceneManager,
    connectionsManager,
    scenesManager,
    charactersManager: charactersManager,
  } = props;

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const errorTheme = useButtonTheme(theme.palette.error.main);
  const textColors = useTextColors(theme.palette.primary.main);
  const { t } = useTranslate();
  const $shareLinkInputRef = useRef<HTMLInputElement | null>(null);
  const [shareLinkToolTip, setShareLinkToolTip] = useState({ open: false });
  const [offlineCharacterDialogOpen, setOfflineCharacterDialogOpen] = useState(
    false
  );
  const $drawArea = useRef<IDrawAreaHandles | null>(null);

  const [savedSnack, setSavedSnack] = useState(false);
  const [offlineCharacterName, setOfflineCharacterName] = useState("");

  useEffect(() => {
    if (scenesManager.state.selectedScene) {
      sceneManager.actions.loadScene(scenesManager.state.selectedScene);
    }
  }, [scenesManager.state.selectedScene]);

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
  const isOffline = props.mode === SceneMode.PlayOffline;
  const everyone = [
    sceneManager.state.scene.gm,
    ...sceneManager.state.scene.players,
  ];

  const paperStyle = css({ borderRadius: "0px" });

  return (
    <Page gameId={props.idFromParams}>
      <Prompt
        when={props.mode !== SceneMode.Manage}
        message={t("play-route.leave-prompt")}
      />
      <Snackbar
        open={savedSnack}
        autoHideDuration={6000}
        onClose={() => {
          setSavedSnack(false);
        }}
      >
        <Alert
          severity="success"
          onClose={() => {
            setSavedSnack(false);
          }}
        >
          {t("play-route.scene-saved")}
        </Alert>
      </Snackbar>
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
        <CircularProgress />
      </Box>
    );
  }

  function renderPageContent() {
    return (
      <Fade in>
        <Box>
          {renderHeader()}
          {props.mode === SceneMode.Manage ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {renderAspects()}
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                {renderSidePanel()}
              </Grid>
              <Grid item xs={12} md={8}>
                {renderAspects()}
              </Grid>
            </Grid>
          )}

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
            {charactersManager.state.characters.length !== 0 && (
              <>
                <Box py="1rem">
                  <Typography variant="h6" align="center">
                    {t("play-route.or-pick-existing")}
                  </Typography>
                </Box>
                <List>
                  {charactersManager.state.characters.map(
                    (character, index) => {
                      const [firstAspect] = character.aspects;

                      return (
                        <ListItem
                          button
                          key={index}
                          onClick={() => {
                            sceneManager.actions.addOfflineCharacter(character);
                            setOfflineCharacterDialogOpen(false);
                          }}
                        >
                          <ListItemText
                            primary={
                              <ContentEditable
                                readonly
                                value={character.name}
                              />
                            }
                            secondary={
                              <ContentEditable
                                readonly
                                value={firstAspect?.value || "..."}
                              />
                            }
                          />
                        </ListItem>
                      );
                    }
                  )}
                </List>
              </>
            )}
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
                  endIcon={<EmojiPeopleIcon />}
                >
                  {t("play-route.reset-initiative")}
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>

        <Paper className={paperStyle}>
          <TableContainer>
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
                      isMe={
                        props.mode === SceneMode.PlayOnline &&
                        props.userId === player.id
                      }
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
                          connectionsManager?.actions.sendToHost<IPeerActions>({
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
                          connectionsManager?.actions.sendToHost<IPeerActions>({
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
                          connectionsManager?.actions.sendToHost<IPeerActions>({
                            action: "update-fate-point",
                            payload: fatePoints,
                          });
                        }
                      }}
                      onCharacterUpdate={(character) => {
                        if (isGM) {
                          sceneManager.actions.updatePlayerCharacter(
                            player.id,
                            character
                          );
                        } else {
                          connectionsManager?.actions.sendToHost<IPeerActions>({
                            action: "update-character",
                            payload: character,
                          });
                        }
                      }}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Paper className={paperStyle}>
          <Divider light />
          <Box width="100%" height="400px">
            <DrawArea
              ref={$drawArea}
              lines={sceneManager.state.scene.drawAreaLines}
              readonly={!isGM}
              onChange={(lines) => {
                sceneManager.actions.setDrawAreaLines(lines);
              }}
            />
          </Box>
          <Divider />
          {isGM && (
            <Box p="1rem">
              <Grid container justify="space-between">
                <Grid item>
                  <Button
                    onClick={() => {
                      if ($drawArea.current) {
                        $drawArea.current.clear();
                      }
                    }}
                    endIcon={<GestureIcon />}
                  >
                    {t("play-route.clear-drawing")}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => {
                      if ($drawArea.current) {
                        $drawArea.current.undo();
                      }
                    }}
                    endIcon={<UndoIcon />}
                  >
                    {t("play-route.undo-drawing")}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
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

  function renderAspects() {
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
                    onCountdownChange={(index, value) => {
                      sceneManager.actions.updateAspectCountdown(
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
                    onAddCountdown={() => {
                      sceneManager.actions.addAspectCountdown(aspectId);
                    }}
                    onAddConsequence={() => {
                      sceneManager.actions.addAspectConsequence(aspectId);
                    }}
                    onUpdateAspectColor={(color: IndexCardColorTypes) => {
                      sceneManager.actions.updateAspectColor(aspectId, color);
                    }}
                    onPlayedInTurnOrderChange={(playedDuringTurn) => {
                      sceneManager.actions.updateAspectPlayerDuringTurn(
                        aspectId,
                        playedDuringTurn
                      );
                    }}
                  />
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
                  endIcon={<NoteIcon />}
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
          <Box pb="1rem">{renderManagementActions()}</Box>
          <Container maxWidth="sm">
            <Typography
              variant="h4"
              className={css({
                borderBottom: `1px solid ${theme.palette.divider}`,
                textAlign: "center",
              })}
            >
              <ContentEditable
                autoFocus
                value={sceneManager.state.scene.name}
                readonly={!isGM}
                onChange={(value) => {
                  sceneManager.actions.setName(value);
                }}
              />
            </Typography>
          </Container>
        </Box>

        <Box>
          {renderGMAspectActions()}
          {renderGMSceneActions()}
        </Box>
      </Box>
    );
  }

  function renderGMAspectActions() {
    if (!isGM) {
      return null;
    }
    return (
      <Box pb="1rem">
        <Grid container spacing={1} justify="center">
          <Grid item>
            <Button
              onClick={() => {
                sceneManager.actions.addAspect(AspectType.Aspect);
              }}
              variant="contained"
              color="secondary"
              endIcon={<NoteIcon />}
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
              endIcon={<LoupeIcon />}
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
              endIcon={<FaceIcon />}
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
              endIcon={<BugReportIcon />}
            >
              {t("play-route.add-bad-guy")}
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                sceneManager.actions.addAspect(AspectType.IndexCard);
              }}
              variant="contained"
              color="secondary"
              endIcon={<NoteOutlinedIcon />}
            >
              {t("play-route.add-index-card")}
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }
  function renderGMSceneActions() {
    if (!isGM) {
      return null;
    }
    return (
      <Box pb="1rem">
        <Grid container spacing={1} justify="center">
          {props.mode === SceneMode.PlayOnline && (
            <Grid item>
              <Button
                onClick={() => {
                  sceneManager.actions.fireGoodConfetti();
                }}
                variant="text"
                color="primary"
              >
                <ThumbUpIcon />
              </Button>
            </Grid>
          )}
          {props.mode === SceneMode.PlayOnline && (
            <Grid item>
              <Button
                onClick={() => {
                  sceneManager.actions.fireBadConfetti();
                }}
                variant="text"
                color="primary"
              >
                <ThumbDownIcon />
              </Button>
            </Grid>
          )}
          <Grid item>
            <Button
              onClick={() => {
                props.sceneManager.actions.toggleSort();
              }}
              variant="outlined"
              color={
                props.sceneManager.state.scene.sort ? "secondary" : "default"
              }
              endIcon={<SortIcon />}
            >
              {t("play-route.sort")}
            </Button>
          </Grid>
          {props.mode === SceneMode.PlayOffline && (
            <Grid item>
              <Button
                onClick={() => {
                  setOfflineCharacterDialogOpen(true);
                }}
                variant="outlined"
                color="default"
                endIcon={<PersonAddIcon />}
              >
                {t("play-route.add-character")}
              </Button>
            </Grid>
          )}
          {props.mode === SceneMode.PlayOnline && props.shareLink && (
            <Grid item>
              <input
                ref={$shareLinkInputRef}
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
                    if (props.shareLink && $shareLinkInputRef.current) {
                      $shareLinkInputRef.current.select();
                      document.execCommand("copy");
                      navigator.clipboard.writeText(props.shareLink);
                      setShareLinkToolTip({ open: true });
                    }
                  }}
                  variant="outlined"
                  color="default"
                  endIcon={<FileCopyIcon />}
                >
                  {t("play-route.copy-game-link")}
                </Button>
              </Tooltip>
            </Grid>
          )}
          {props.mode !== SceneMode.Manage && (
            <>
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
                        sceneManager.actions.resetScene();
                        if ($drawArea.current) {
                          $drawArea.current.clear();
                        }
                      }
                    }}
                    className={css({ borderRadius: "20px" })}
                    variant="text"
                    color="primary"
                    endIcon={<ErrorIcon />}
                  >
                    {t("play-route.reset-scene")}
                  </Button>
                </ThemeProvider>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    );
  }

  function renderManagementActions() {
    return (
      <Box>
        <Grid container spacing={1} justify="center">
          <Grid item>
            <Button
              onClick={() => {
                scenesManager.actions.upsert(sceneManager.state.scene);
                setSavedSnack(true);
              }}
              color="primary"
              variant="outlined"
              endIcon={<SaveIcon />}
            >
              {t("play-route.save-scene")}
            </Button>
          </Grid>
          {props.mode !== SceneMode.Manage && (
            <Grid item>
              <Button
                onClick={() => {
                  scenesManager.actions.openManager(ScenesManagerMode.Use);
                }}
                color="default"
                variant="outlined"
                endIcon={<ReplayIcon />}
              >
                {t("play-route.load-scene")}
              </Button>
            </Grid>
          )}
        </Grid>
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

Scene.displayName = "PlayPage";
