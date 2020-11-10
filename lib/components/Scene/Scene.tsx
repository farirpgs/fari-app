import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Collapse,
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
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import ErrorIcon from "@material-ui/icons/Error";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import SaveIcon from "@material-ui/icons/Save";
import SortIcon from "@material-ui/icons/Sort";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { Alert, Autocomplete } from "@material-ui/lab";
import { css, cx } from "emotion";
import React, { useEffect, useRef, useState } from "react";
import { Prompt } from "react-router";
import {
  ICharacter,
  useCharacters,
} from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import {
  ISavableScene,
  useScenes,
} from "../../contexts/SceneContext/ScenesContext";
import { arraySort } from "../../domains/array/arraySort";
import { Dice, IRollDiceOptions } from "../../domains/dice/Dice";
import { Font } from "../../domains/font/Font";
import { useButtonTheme } from "../../hooks/useButtonTheme/useButtonTheme";
import { usePeerConnections } from "../../hooks/usePeerJS/usePeerConnections";
import { AspectType } from "../../hooks/useScene/AspectType";
import { IPlayer } from "../../hooks/useScene/IScene";
import { useScene } from "../../hooks/useScene/useScene";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { CharacterDialog } from "../../routes/Character/components/CharacterDialog";
import { IPeerActions } from "../../routes/Play/types/IPeerActions";
import { ContentEditable } from "../ContentEditable/ContentEditable";
import { DrawArea } from "../DrawArea/DrawArea";
import { FateLabel } from "../FateLabel/FateLabel";
import { IndexCard } from "../IndexCard/IndexCard";
import { MagicGridContainer } from "../MagicGridContainer/MagicGridContainer";
import { ManagerMode } from "../Manager/Manager";
import { LiveMode, Page } from "../Page/Page";
import { SplitButton } from "../SplitButton/SplitButton";
import { CharacterCard } from "./components/PlayerRow/CharacterCard/CharacterCard";
import { PlayerRow } from "./components/PlayerRow/PlayerRow";

export enum SceneMode {
  PlayOnline,
  PlayOffline,
  Manage,
}

export const paperStyle = css({ borderRadius: "0px" });

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
  const logger = useLogger();
  const isLGAndUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isMD = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isSMAndDown = useMediaQuery(theme.breakpoints.down("sm"));
  const errorTheme = useButtonTheme(theme.palette.error.main);
  const textColors = useTextColors(theme.palette.primary.main);
  const { t } = useTranslate();
  const $shareLinkInputRef = useRef<HTMLInputElement | null>(null);
  const [shareLinkToolTip, setShareLinkToolTip] = useState({ open: false });
  const [offlineCharacterDialogOpen, setOfflineCharacterDialogOpen] = useState(
    false
  );
  const [characterDialogPlayerId, setCharacterDialogPlayerId] = useState<
    string | undefined
  >(undefined);
  const [showCharacterCards, setShowCharacterCards] = useState(true);

  const [savedSnack, setSavedSnack] = useState(false);
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
  const isOffline = props.mode === SceneMode.PlayOffline;
  const tokenTitles = sceneManager.state.scene.players.map(
    (p) => (p.character?.name ?? p.playerName) as string
  );

  const everyone = [
    sceneManager.state.scene.gm,
    ...sceneManager.state.scene.players,
  ];
  const playersWithCharacterSheets = sceneManager.state.scene.players.filter(
    (player) => !!player.character
  );

  function onLoadScene(newScene: ISavableScene) {
    sceneManager.actions.loadScene(newScene);
  }

  function onLoadTemplateScene(newScene: ISavableScene) {
    sceneManager.actions.cloneAndLoadScene(newScene);
  }

  function onAddOfflineCharacter(character: ICharacter) {
    sceneManager.actions.addOfflineCharacter(character);
  }

  function roll(player: IPlayer, options: IRollDiceOptions) {
    if (isGM) {
      sceneManager.actions.updatePlayerRoll(player.id, Dice.roll4DF(options));
    } else {
      connectionsManager?.actions.sendToHost<IPeerActions>({
        action: "roll",
        payload: Dice.roll4DF(options),
      });
    }
  }

  const liveMode = getLiveMode();

  return (
    <Page
      gameId={props.idFromParams}
      live={liveMode}
      liveLabel={sceneManager.state.scene.name}
    >
      <Prompt
        when={props.mode !== SceneMode.Manage}
        message={t("manager.leave-without-saving")}
      />
      <Prompt
        when={props.mode === SceneMode.Manage && sceneManager.state.dirty}
        message={t("manager.leave-without-saving")}
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
                {renderCharacterCards()}
                {renderAspects()}
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4} lg={3}>
                {renderSidePanel()}
              </Grid>
              <Grid item xs={12} md={8} lg={9}>
                {renderCharacterCards()}
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
            logger.info("Scene:OfflineCharacterDialog:onAdd");
          }}
        >
          <DialogTitle id="form-dialog-title">
            {t("play-route.add-character")}
          </DialogTitle>
          <DialogContent>
            <Box pb="1rem">
              <Grid container justify="center">
                <Grid item>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setOfflineCharacterDialogOpen(false);
                      charactersManager.actions.openManager(
                        ManagerMode.Use,
                        onAddOfflineCharacter
                      );
                      logger.info(
                        "Scene:OfflineCharacterDialog:onPickExisting"
                      );
                    }}
                  >
                    {t("play-route.or-pick-existing")}
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Box py="2rem">
              <Typography variant="h6" align="center">
                {t("play-route.or")}
              </Typography>
            </Box>
            <Box>
              <InputLabel shrink>{t("play-route.character-name")}</InputLabel>
              <TextField
                value={offlineCharacterName}
                onChange={(event) => {
                  setOfflineCharacterName(event.target.value);
                }}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOfflineCharacterDialogOpen(false);
                setOfflineCharacterName("");
                logger.info("Scene:OfflineCharacterDialog:onCancel");
              }}
              color="default"
            >
              {t("play-route.cancel")}
            </Button>
            <Button type="submit" color="secondary" variant="outlined">
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
              <>
                <Grid item>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Button
                        onClick={() => {
                          sceneManager.actions.resetInitiative();
                          logger.info("Scene:onResetInitiative");
                        }}
                        variant="contained"
                        color="secondary"
                        endIcon={<EmojiPeopleIcon />}
                      >
                        {t("play-route.reset-initiative")}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Tooltip title={t("play-route.add-character")}>
                        <Button
                          onClick={() => {
                            setOfflineCharacterDialogOpen(true);
                            logger.info("Scene:onAddOfflineCharacter");
                          }}
                          variant="contained"
                          color="secondary"
                        >
                          <PersonAddIcon />
                        </Button>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
              </>
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
                  const isMe =
                    props.mode === SceneMode.PlayOnline &&
                    props.userId === player.id;
                  const canControl = isGM || isMe;
                  return (
                    <React.Fragment key={player.id}>
                      <CharacterDialog
                        readonly={!canControl}
                        open={characterDialogPlayerId === player.id}
                        character={player.character}
                        dialog={true}
                        rolls={player.rolls}
                        onRoll={(options) => {
                          roll(player, options);
                        }}
                        onSave={(updatedCharacter) => {
                          if (isGM) {
                            sceneManager.actions.updatePlayerCharacter(
                              player.id,
                              updatedCharacter
                            );
                          } else {
                            connectionsManager?.actions.sendToHost<
                              IPeerActions
                            >({
                              action: "update-character",
                              payload: updatedCharacter,
                            });
                          }
                          setCharacterDialogPlayerId(undefined);
                        }}
                        onClose={() => {
                          setCharacterDialogPlayerId(undefined);
                        }}
                      />
                      <PlayerRow
                        key={player.id}
                        isGM={isGM}
                        isMe={isMe}
                        player={player}
                        offline={isOffline}
                        onPlayerRemove={() => {
                          sceneManager.actions.removeOfflinePlayer(player.id);
                        }}
                        onCharacterDialogOpen={() => {
                          setCharacterDialogPlayerId(player.id);
                        }}
                        onDiceRoll={(options: IRollDiceOptions) => {
                          roll(player, options);
                        }}
                        onPlayedInTurnOrderChange={(playedInTurnOrder) => {
                          if (isGM) {
                            sceneManager.actions.updatePlayerPlayedDuringTurn(
                              player.id,
                              playedInTurnOrder
                            );
                          } else {
                            connectionsManager?.actions.sendToHost<
                              IPeerActions
                            >({
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
                            connectionsManager?.actions.sendToHost<
                              IPeerActions
                            >({
                              action: "update-fate-point",
                              payload: fatePoints,
                            });
                          }
                        }}
                      />
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Paper className={paperStyle}>
          <Divider light />
          <Box>
            <DrawArea
              objects={sceneManager.state.scene.drawAreaObjects}
              readonly={!isGM}
              tokenTitles={tokenTitles}
              onChange={(lines) => {
                sceneManager.actions.updateDrawAreaObjects(lines);
              }}
            />
          </Box>
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

  function renderCharacterCards() {
    if (!showCharacterCards) {
      return null;
    }

    const hasPlayersWithCharacterSheets = !!playersWithCharacterSheets.length;

    return (
      hasPlayersWithCharacterSheets && (
        <>
          <Box>
            <MagicGridContainer
              items={playersWithCharacterSheets.length}
              deps={[
                playersWithCharacterSheets.length,
                Object.keys(sceneManager.state.scene.aspects).length,
                showCharacterCards,
              ]}
            >
              {playersWithCharacterSheets.map((player, index) => {
                const isMe =
                  props.mode === SceneMode.PlayOnline &&
                  props.userId === player.id;
                const canControl = isGM || isMe;
                return (
                  <CharacterCard
                    key={player?.id || index}
                    readonly={!canControl}
                    characterSheet={player.character}
                    onRoll={(options) => {
                      roll(player, options);
                    }}
                    onCharacterDialogOpen={() => {
                      setCharacterDialogPlayerId(player.id);
                    }}
                  />
                );
              })}
            </MagicGridContainer>
          </Box>
          <Box pt="1rem" pb="2rem">
            <Divider />
          </Box>
        </>
      )
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
    const width = isLGAndUp ? "25%" : isMD ? "33%" : "100%";
    return (
      <Box pb="2rem">
        {hasAspects && (
          <MagicGridContainer
            items={aspectIds.length}
            deps={[
              playersWithCharacterSheets.length,
              Object.keys(sceneManager.state.scene.aspects).length,
              showCharacterCards,
            ]}
          >
            {aspects.map((aspectId) => {
              return (
                <Box
                  key={aspectId}
                  width={width}
                  className={cx(
                    css({
                      padding: "0 .5rem 1.5rem .5rem",
                    })
                  )}
                >
                  <IndexCard
                    key={aspectId}
                    id={`index-card-${aspectId}`}
                    aspectId={aspectId}
                    readonly={!isGM}
                    sceneManager={sceneManager}
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
                    logger.info("Scene:addAspectEmpty");
                  }}
                  endIcon={<AddCircleOutlineIcon />}
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
          {renderManagementActions()}
          <Container maxWidth="sm">
            <Box mb=".5rem">
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
                    sceneManager.actions.updateName(value);
                  }}
                />
              </Typography>
            </Box>
            <Collapse in={!!sceneManager.state.scene.name}>
              <Box>
                <Grid
                  container
                  spacing={2}
                  wrap="nowrap"
                  justify="center"
                  alignItems="flex-end"
                >
                  <Grid item>
                    <FateLabel>{t("play-route.group")}</FateLabel>
                  </Grid>
                  <Grid item xs={8} sm={4}>
                    <Autocomplete
                      freeSolo
                      options={scenesManager.state.groups.filter((g) => {
                        const currentGroup =
                          sceneManager.state.scene.group ?? "";
                        return g.toLowerCase().includes(currentGroup);
                      })}
                      value={sceneManager.state.scene.group ?? ""}
                      onChange={(event, newValue) => {
                        sceneManager.actions.setGroup(newValue);
                      }}
                      inputValue={sceneManager.state.scene.group ?? ""}
                      onInputChange={(event, newInputValue) => {
                        sceneManager.actions.setGroup(newInputValue);
                      }}
                      disabled={!isGM}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          InputProps={{
                            ...params.InputProps,
                            disableUnderline: true,
                          }}
                          inputProps={{
                            ...params.inputProps,
                            className: css({ padding: "2px" }),
                          }}
                          className={css({
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          })}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Container>
        </Box>

        <Box>
          {renderGMAspectActions()}
          {renderGMSceneActions()}
          {renderPlayerSceneActions()}
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
            <ButtonGroup
              color="secondary"
              variant="contained"
              orientation={isSMAndDown ? "vertical" : "horizontal"}
            >
              <Button
                onClick={() => {
                  sceneManager.actions.addAspect(AspectType.Aspect);
                  logger.info("Scene:onAddCard:Aspect");
                }}
                endIcon={<AddCircleOutlineIcon />}
              >
                {t("play-route.add-aspect")}
              </Button>
              <Button
                onClick={() => {
                  sceneManager.actions.addAspect(AspectType.Boost);
                  logger.info("Scene:onAddCard:Boost");
                }}
                endIcon={<AddCircleOutlineIcon />}
              >
                {t("play-route.add-boost")}
              </Button>
              <Button
                onClick={() => {
                  sceneManager.actions.addAspect(AspectType.NPC);
                  logger.info("Scene:onAddCard:NPC");
                }}
                endIcon={<AddCircleOutlineIcon />}
              >
                {t("play-route.add-npc")}
              </Button>
              <Button
                onClick={() => {
                  sceneManager.actions.addAspect(AspectType.BadGuy);
                  logger.info("Scene:onAddCard:BadGuy");
                }}
                endIcon={<AddCircleOutlineIcon />}
              >
                {t("play-route.add-bad-guy")}
              </Button>
              <Button
                onClick={() => {
                  sceneManager.actions.addAspect(AspectType.IndexCard);
                  logger.info("Scene:onAddCard:IndexCard");
                }}
                endIcon={<AddCircleOutlineIcon />}
              >
                {t("play-route.add-index-card")}
              </Button>
            </ButtonGroup>
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
                  logger.info("Scene:onFireGoodConfetti");
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
                  logger.info("Scene:onFireBadConfetti");
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
                logger.info("Scene:onSort");
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
          {props.mode === SceneMode.PlayOnline && (
            <Grid item>
              <Button
                onClick={() => {
                  setShowCharacterCards((s) => !s);
                  logger.info("Scene:onShowCharacterCards");
                }}
                variant="outlined"
                color={showCharacterCards ? "secondary" : "default"}
                endIcon={<SortIcon />}
              >
                {t("play-route.show-character-cards")}
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
                      try {
                        $shareLinkInputRef.current.select();
                        document.execCommand("copy");
                        navigator.clipboard.writeText(props.shareLink);
                        setShareLinkToolTip({ open: true });
                      } catch (error) {
                        window.open(props.shareLink, "_blank");
                      }

                      logger.info("Scene:onCopyGameLink");
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
        </Grid>
      </Box>
    );
  }

  function renderPlayerSceneActions() {
    if (isGM) {
      return null;
    }
    return (
      <Box pb="1rem">
        <Grid container spacing={1} justify="center">
          <Grid item>
            <Button
              onClick={() => {
                setShowCharacterCards((s) => !s);
                logger.info("Scene:onShowCharacterCards");
              }}
              variant="outlined"
              color={showCharacterCards ? "secondary" : "default"}
              endIcon={<SortIcon />}
            >
              {t("play-route.show-character-cards")}
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }

  function renderManagementActions() {
    if (!isGM) {
      return null;
    }
    return (
      <Box pb="1rem">
        <Grid container spacing={1} justify="center">
          <Grid item>
            <Button
              color="primary"
              endIcon={<SaveIcon />}
              variant={sceneManager.state.dirty ? "contained" : "outlined"}
              onClick={() => {
                scenesManager.actions.upsert(sceneManager.state.scene);
                sceneManager.actions.loadScene(sceneManager.state.scene);
                setSavedSnack(true);
                logger.info("Scene:onSave");
              }}
            >
              {t("play-route.save-scene")}
            </Button>
          </Grid>
          {props.mode !== SceneMode.Manage && (
            <>
              <Grid item>
                <SplitButton
                  color="default"
                  variant="outlined"
                  options={[
                    {
                      label: t("play-route.load-scene"),
                      onClick: () => {
                        scenesManager.actions.openManager(
                          ManagerMode.Use,
                          onLoadScene
                        );
                        logger.info("Scene:onLoadScene");
                      },
                    },
                    {
                      label: t("play-route.load-scene-as-template"),
                      onClick: () => {
                        scenesManager.actions.openManager(
                          ManagerMode.Use,
                          onLoadTemplateScene
                        );
                        logger.info("Scene:onLoadSceneTemplate");
                      },
                    },
                  ]}
                />
              </Grid>
              <Hidden smDown>
                <Grid item className={css({ display: "flex" })}>
                  <Divider orientation="vertical" flexItem />
                </Grid>
              </Hidden>
              <Grid item>
                <ThemeProvider theme={errorTheme}>
                  <Button
                    variant="text"
                    color="primary"
                    endIcon={<ErrorIcon />}
                    className={css({ borderRadius: "20px" })}
                    onClick={() => {
                      const confirmed = confirm(
                        t("play-route.reset-scene-confirmation")
                      );
                      if (confirmed) {
                        sceneManager.actions.resetScene();
                        logger.info("Scene:onReset");
                      }
                    }}
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

  function getLiveMode() {
    if (props.mode === SceneMode.PlayOffline) {
      return LiveMode.Live;
    }
    if (props.mode === SceneMode.Manage) {
      return undefined;
    }
    if (props.isLoading) {
      return LiveMode.Connecting;
    }
    return LiveMode.Live;
  }
};

Scene.displayName = "PlayPage";
