import { css } from "@emotion/css";
import Alert from "@material-ui/core/Alert";
import Autocomplete from "@material-ui/core/Autocomplete";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fade from "@material-ui/core/Fade";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import { darken, useTheme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import ErrorIcon from "@material-ui/icons/Error";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import FilterHdrIcon from "@material-ui/icons/FilterHdr";
import MovieIcon from "@material-ui/icons/Movie";
import PanToolIcon from "@material-ui/icons/PanTool";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import SaveIcon from "@material-ui/icons/Save";
import TabContext from "@material-ui/lab/TabContext";
import TabPanel from "@material-ui/lab/TabPanel";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Prompt } from "react-router";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { DiceContext } from "../../contexts/DiceContext/DiceContext";
import { IndexCardCollectionsContext } from "../../contexts/IndexCardCollectionsContext/IndexCardCollectionsContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { ScenesContext } from "../../contexts/SceneContext/ScenesContext";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { arraySort, IArraySortGetter } from "../../domains/array/arraySort";
import { CharacterFactory } from "../../domains/character/CharacterFactory";
import { ICharacter } from "../../domains/character/types";
import { IDiceRollResult } from "../../domains/dice/Dice";
import { DragAndDropTypes } from "../../domains/drag-and-drop/DragAndDropTypes";
import { Font } from "../../domains/font/Font";
import { Icons } from "../../domains/Icons/Icons";
import { useBlockReload } from "../../hooks/useBlockReload/useBlockReload";
import { LazyState } from "../../hooks/useLazyState/useLazyState";
import { usePeerConnections } from "../../hooks/usePeerJS/usePeerConnections";
import { useResponsiveValue } from "../../hooks/useResponsiveValue/useResponsiveValue";
import {
  IIndexCard,
  IIndexCardType,
  IPlayer,
  IScene,
} from "../../hooks/useScene/IScene";
import { useScene } from "../../hooks/useScene/useScene";
import { useSession } from "../../hooks/useScene/useSession";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { CharacterV3Dialog } from "../../routes/Character/components/CharacterDialog/CharacterV3Dialog";
import { IDicePoolElement } from "../../routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";
import { IPeerActions } from "../../routes/Play/types/IPeerActions";
import {
  ContentEditable,
  previewContentEditable,
} from "../ContentEditable/ContentEditable";
import { DrawArea } from "../DrawArea/DrawArea";
import { FateLabel } from "../FateLabel/FateLabel";
import { IndexCard } from "../IndexCard/IndexCard";
import { LiveMode, Page } from "../Page/Page";
import { SplitButton } from "../SplitButton/SplitButton";
import { Toolbox } from "../Toolbox/Toolbox";
import { WindowPortal } from "../WindowPortal/WindowPortal";
import { CharacterCard } from "./components/PlayerRow/CharacterCard/CharacterCard";
import { PlayerRow } from "./components/PlayerRow/PlayerRow";
import { useHiddenIndexCardRecord } from "./hooks/useHiddenIndexCardRecord";

export enum SceneMode {
  PlayOnline,
  PlayOffline,
  Manage,
}

enum SortMode {
  None = "Custom",
  GroupFirst = "GroupFirst",
  PinnedFirst = "PinnedFirst",
}

export const paperStyle = css({ borderRadius: "0px", flex: "1 0 auto" });

type IProps =
  | {
      mode: SceneMode.Manage;
      sessionManager: ReturnType<typeof useSession>;
      sceneManager: ReturnType<typeof useScene>;
      connectionsManager?: undefined;
      idFromParams?: undefined;
      isLoading?: undefined;
      error?: undefined;
    }
  | {
      mode: SceneMode.PlayOnline;
      sessionManager: ReturnType<typeof useSession>;
      sceneManager: ReturnType<typeof useScene>;
      connectionsManager: ReturnType<typeof usePeerConnections>;
      userId: string;
      isLoading: boolean;
      error: any;
      shareLink: string;
      idFromParams?: string;
    }
  | {
      mode: SceneMode.PlayOffline;
      sessionManager: ReturnType<typeof useSession>;
      sceneManager: ReturnType<typeof useScene>;
      connectionsManager?: undefined;
      idFromParams?: undefined;
      isLoading?: undefined;
      error?: undefined;
    };

export const Session: React.FC<IProps> = (props) => {
  const { sessionManager, sceneManager, connectionsManager } = props;

  const charactersManager = useContext(CharactersContext);
  const myBinderManager = useContext(MyBinderContext);

  const isGM = !props.idFromParams;

  const isGMHostingOnlineOrOfflineGame =
    props.mode !== SceneMode.Manage && isGM;
  const isGMEditingDirtyScene =
    props.mode === SceneMode.Manage && sceneManager.state.dirty;

  useBlockReload(isGMHostingOnlineOrOfflineGame || isGMEditingDirtyScene);

  const theme = useTheme();
  const { t } = useTranslate();
  const logger = useLogger();
  const diceManager = useContext(DiceContext);

  const characterCardWidth = useResponsiveValue({
    xl: "25%",
    lg: "33%",
    md: "50%",
    sm: "100%",
    xs: "100%",
  });

  const textColors = useTextColors(theme.palette.primary.main);

  const [streamerModalOpen, setStreamerModalOpen] = useState(false);
  const [shareLinkToolTip, setShareLinkToolTip] = useState({ open: false });
  const [characterDialogPlayerId, setCharacterDialogPlayerId] = useState<
    string | undefined
  >(undefined);

  const [tab, setTab] = useState<"characters" | "scene" | "draw">("scene");

  const $shareLinkInputRef = useRef<HTMLInputElement | null>(null);

  const headerColor = theme.palette.background.paper;
  const headerBackgroundColor = useTextColors(
    theme.palette.background.paper
  ).primary;

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

  //#region TODO: refac into another function
  const userId = props.mode === SceneMode.PlayOnline ? props.userId : undefined;
  const gm = sessionManager.state.session.gm;
  const players = sessionManager.state.session.players ?? [];

  const sortedPlayers = arraySort(players, [
    (p) => {
      return {
        value: userId === p.id,
        direction: "asc",
      };
    },
  ]);

  const everyone = [gm, ...sortedPlayers];
  const controllablePlayerIds = everyone
    .filter((player) => {
      if (isGM) {
        return true;
      }
      return userId === player.id;
    })
    .map((p) => p.id);

  const me = everyone.find((player) => {
    if (isGM) {
      return player.isGM;
    }
    return userId === player.id;
  });
  //#endregion

  const liveMode = getLiveMode();

  const handleGMAddOfflinePlayer = () => {
    sessionManager.actions.addOfflinePlayer();
  };

  const handleAssignOriginalCharacterSheet = (
    playerId: string,
    character: ICharacter
  ) => {
    if (isGM) {
      sessionManager.actions.loadPlayerCharacter(playerId, character);
    } else {
      connectionsManager?.actions.sendToHost<IPeerActions>({
        action: "load-character",
        payload: character,
      });
    }
  };

  const handleAssignDuplicateCharacterSheet = (
    playerId: string,
    character: ICharacter
  ) => {
    const copy = CharacterFactory.duplicate(character);
    charactersManager.actions.upsert(copy);

    if (isGM) {
      sessionManager.actions.loadPlayerCharacter(playerId, copy);
    } else {
      connectionsManager?.actions.sendToHost<IPeerActions>({
        action: "load-character",
        payload: copy,
      });
    }
  };

  const handleOnToggleCharacterSync = (character: ICharacter | undefined) => {
    charactersManager.actions.upsert(character);
  };

  const handleSetMyRoll = (result: IDiceRollResult) => {
    if (isGM) {
      sessionManager.actions.updateGmRoll(result);
    } else {
      connectionsManager?.actions.sendToHost<IPeerActions>({
        action: "roll",
        payload: result,
      });
    }
  };

  const handleSetPlayerRoll = (
    playerId: string | undefined,
    result: IDiceRollResult
  ) => {
    if (isGM) {
      if (playerId) {
        sessionManager.actions.updatePlayerRoll(playerId, result);
      } else {
        sessionManager.actions.updateGmRoll(result);
      }
    } else {
      connectionsManager?.actions.sendToHost<IPeerActions>({
        action: "roll",
        payload: result,
      });
    }
  };
  return (
    <Page
      pb="6rem"
      gameId={props.idFromParams}
      live={liveMode}
      liveLabel={sceneManager.state.scene?.name ?? ""}
    >
      <Box px="1rem">
        <Prompt
          when={isGMEditingDirtyScene}
          message={t("manager.leave-without-saving")}
        />
        <Prompt
          when={isGMHostingOnlineOrOfflineGame}
          message={t("play-route.host-leaving-warning")}
        />
        {renderPauseDialog()}
        {streamerModalOpen && (
          <WindowPortal
            onClose={() => {
              setStreamerModalOpen(false);
            }}
          >
            <div id="lol">
              <button>Test...</button>
            </div>
          </WindowPortal>
        )}

        <Toolbox
          dice={{
            onRoll: (result) => {
              handleSetMyRoll(result);
            },
            rollsForDiceBox: me?.rolls ?? [],
            onRollPool: (result, playerId) => {
              handleSetPlayerRoll(playerId, result);
            },
          }}
          centerActions={
            <>
              {isGM && props.mode !== SceneMode.Manage && (
                <Grid item>
                  <IconButton
                    onClick={() => {
                      sessionManager.actions.fireGoodConfetti();
                      logger.info("Scene:onFireGoodConfetti");
                    }}
                    color="primary"
                    size="large"
                  >
                    <Icons.PartyPopper
                      className={css({ width: "2rem", height: "2rem" })}
                      htmlColor={darken(theme.palette.success.main, 0.2)}
                    />
                  </IconButton>
                </Grid>
              )}
              {props.mode !== SceneMode.Manage && (
                <Grid item>
                  <IconButton
                    onClick={() => {
                      if (isGM) {
                        sessionManager.actions.pause();
                      } else {
                        connectionsManager?.actions.sendToHost<IPeerActions>({
                          action: "pause",
                          payload: undefined,
                        });
                      }
                    }}
                    color="primary"
                    size="large"
                  >
                    <PanToolIcon
                      className={css({ width: "1.8rem", height: "1.8rem" })}
                      htmlColor={theme.palette.text.primary}
                    />
                  </IconButton>
                </Grid>
              )}

              {isGM && props.mode !== SceneMode.Manage && (
                <Grid item>
                  <IconButton
                    onClick={() => {
                      sessionManager.actions.fireBadConfetti();
                      logger.info("Scene:onFireBadConfetti");
                    }}
                    color="primary"
                    size="large"
                  >
                    <Icons.PartyPopper
                      className={css({ width: "2rem", height: "2rem" })}
                      htmlColor={darken(theme.palette.error.main, 0.2)}
                    />
                  </IconButton>
                </Grid>
              )}
            </>
          }
        />
        <Box px="1rem">{props.error ? renderPageError() : renderPage()}</Box>
      </Box>
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
          {props.mode === SceneMode.Manage ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {renderSessionTabsAndContent()}
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} md={5} lg={3}>
                {renderSidePanel()}
              </Grid>
              <Grid item xs={12} md={7} lg={9}>
                {renderSessionTabsAndContent()}
              </Grid>
            </Grid>
          )}
        </Box>
      </Fade>
    );
  }

  function renderPauseDialog() {
    return (
      <Dialog
        fullWidth
        maxWidth="sm"
        open={sessionManager.state.session.paused}
        keepMounted={false}
        onClose={() => {
          if (isGM) {
            sessionManager.actions.unpause();
          }
        }}
      >
        <DialogTitle>
          <Grid container justifyContent="center">
            <Grid item>{t("play-route.paused-dialog.title")}</Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid container justifyContent="center">
            <Grid item>
              <ErrorIcon
                className={css({
                  width: "3rem",
                  height: "3rem",
                })}
              />
            </Grid>
          </Grid>

          <DialogContentText textAlign="center">
            {t("play-route.paused-dialog.content")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              sessionManager.actions.unpause();
            }}
          >
            {t("play-route.paused-dialog.continue")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  function renderSidePanel() {
    return (
      <Box>
        <Box>{renderManagementActions()}</Box>

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
                    {sessionManager.state.session.players.length + 1}
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
              <Grid item>
                <Grid container spacing={1}>
                  {isGM && (
                    <>
                      <Grid item>
                        <Button
                          data-cy="scene.reset-initiative"
                          onClick={() => {
                            sessionManager.actions.resetInitiative();
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
                        <Tooltip title={t("play-route.gm-add-gm-character")}>
                          <span>
                            <Button
                              data-cy="scene.add-player"
                              onClick={() => {
                                handleGMAddOfflinePlayer();
                                logger.info("Scene:addPlayer");
                              }}
                              variant="contained"
                              color="secondary"
                            >
                              <PersonAddIcon />
                            </Button>
                          </span>
                        </Tooltip>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Paper className={paperStyle}>
            {renderPlayerRow({
              player: gm,
              canControl: me?.id === gm.id,
              isMe: me?.id === gm.id,
              index: "gm",
              isChild: false,
              children: (
                <>
                  {gm.npcs.map((npc, npcIndex) => {
                    if (npc.private && !isGM) {
                      return null;
                    }
                    return (
                      <React.Fragment key={npc.id}>
                        <Box>
                          {renderPlayerCharacterDialog({
                            player: npc,
                            canControl: me?.id === gm.id,
                          })}
                          <Box mx="-.5rem">
                            {renderPlayerRow({
                              player: npc,
                              canControl: me?.id === gm.id,
                              isMe: me?.id === gm.id,
                              isChild: true,
                              index: `gm-npc-${npcIndex}`,
                            })}
                          </Box>
                        </Box>
                      </React.Fragment>
                    );
                  })}
                </>
              ),
            })}
            {sortedPlayers.map((player, playerRowIndex) => {
              const isMe = me?.id === player.id;
              const canControl = controllablePlayerIds.includes(player.id);

              return (
                <React.Fragment key={player.id}>
                  {renderPlayerCharacterDialog({ player, canControl })}
                  {renderPlayerRow({
                    player,
                    canControl,
                    isMe,
                    isChild: false,
                    index: playerRowIndex,
                  })}
                </React.Fragment>
              );
            })}
          </Paper>
        </Box>
      </Box>
    );
  }

  function renderPlayerCharacterDialog(options: {
    player: IPlayer;
    canControl: boolean;
  }) {
    const { player, canControl } = options;
    if (characterDialogPlayerId !== player.id) {
      return null;
    }

    const isCharacterInStorage = charactersManager.selectors.isInStorage(
      player.character?.id
    );

    return (
      <CharacterV3Dialog
        readonly={!canControl}
        open={characterDialogPlayerId === player.id}
        character={player.character}
        dialog={true}
        onSave={(updatedCharacter) => {
          if (isGM) {
            sessionManager.actions.updatePlayerCharacter(
              player.id,
              updatedCharacter
            );
          } else {
            connectionsManager?.actions.sendToHost<IPeerActions>({
              action: "update-character",
              payload: updatedCharacter,
            });
          }
        }}
        onClose={() => {
          setCharacterDialogPlayerId(undefined);
        }}
        synced={isCharacterInStorage}
        onToggleSync={() => {
          handleOnToggleCharacterSync(player.character);
        }}
        onRoll={(newDiceRollResult) => {
          handleSetPlayerRoll(player.id, newDiceRollResult);
        }}
      />
    );
  }

  function renderPlayerRow(options: {
    player: IPlayer;
    canControl: boolean;
    isMe: boolean;
    index: number | string;
    isChild: boolean;
    children?: JSX.Element;
  }) {
    const {
      player,
      canControl,
      isMe,
      isChild,
      index: playerRowIndex,
      children: playerRowChildren,
    } = options;

    return (
      <PlayerRow
        data-cy={`scene.player-row.${playerRowIndex}`}
        permissions={{
          canRoll: canControl,
          canUpdatePoints: canControl,
          canUpdateInitiative: canControl,
          canLoadDuplicateCharacterSheet: isGM,
          canLoadCharacterSheet: canControl && !player.isGM,
          canRemove: isGM && !player.isGM,
          canMarkPrivate: isGM && isChild,
        }}
        key={player.id}
        isMe={isMe}
        player={player}
        onPlayerRemove={() => {
          sessionManager.actions.removePlayer(player.id);
        }}
        onTogglePrivate={() => {
          sessionManager.actions.togglePlayerVisibility(player.id);
        }}
        onCharacterSheetOpen={() => {
          if (player.character) {
            setCharacterDialogPlayerId(player.id);
          }
        }}
        onAssignOriginalCharacterSheet={() => {
          myBinderManager.actions.open({
            folder: "characters",
            callback: (character) => {
              handleAssignOriginalCharacterSheet(player.id, character);
            },
          });
        }}
        onAssignDuplicateCharacterSheet={() => {
          myBinderManager.actions.open({
            folder: "characters",
            callback: (character) => {
              handleAssignDuplicateCharacterSheet(player.id, character);
            },
          });
        }}
        onDiceRoll={() => {
          handleSetPlayerRoll(
            player.id,
            diceManager.actions.rollCommandGroups()
          );
        }}
        onPlayedInTurnOrderChange={(playedInTurnOrder) => {
          if (isGM) {
            sessionManager.actions.updatePlayerPlayedDuringTurn(
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
        onPointsChange={(points, maxPoints) => {
          if (isGM) {
            sessionManager.actions.updatePlayerCharacterMainPointCounter(
              player.id,
              points,
              maxPoints
            );
          } else {
            connectionsManager?.actions.sendToHost<IPeerActions>({
              action: "update-main-point-counter",
              payload: { points, maxPoints },
            });
          }
        }}
      >
        {playerRowChildren}
      </PlayerRow>
    );
  }

  function renderPlayersCharacterCards() {
    const { playersWithCharacterSheets } = sessionManager.computed;

    return (
      <>
        <Box>
          <Box
            className={css({
              display: "flex",
              flexFlow: "row",
              flexWrap: "wrap",
            })}
          >
            {playersWithCharacterSheets.map((player, index) => {
              const isMe =
                props.mode === SceneMode.PlayOnline &&
                props.userId === player.id;
              const canControl = isGM || isMe;
              return (
                <Box
                  key={player?.id || index}
                  className={css({
                    width: characterCardWidth,
                    display: "inline-block",
                    marginBottom: "1rem",
                  })}
                >
                  <CharacterCard
                    key={player?.id || index}
                    readonly={!canControl}
                    playerName={player.playerName}
                    characterSheet={player.character}
                    onCharacterDialogOpen={() => {
                      setCharacterDialogPlayerId(player.id);
                    }}
                    onRoll={(newDiceRollResult) => {
                      handleSetPlayerRoll(player.id, newDiceRollResult);
                    }}
                  />
                </Box>
              );
            })}
            {props.mode === SceneMode.PlayOffline &&
              sessionManager.state.session.gm.npcs.map((npc, index) => {
                const canControl = isGM;
                return (
                  <Box
                    key={npc?.id || index}
                    className={css({
                      width: characterCardWidth,
                      display: "inline-block",
                      marginBottom: "1rem",
                    })}
                  >
                    <CharacterCard
                      key={npc?.id || index}
                      readonly={!canControl}
                      playerName={npc.playerName}
                      characterSheet={npc.character}
                      onCharacterDialogOpen={() => {
                        setCharacterDialogPlayerId(npc.id);
                      }}
                      onRoll={(newDiceRollResult) => {
                        handleSetPlayerRoll(npc.id, newDiceRollResult);
                      }}
                    />
                  </Box>
                );
              })}
          </Box>
        </Box>
      </>
    );
  }
  function renderNpcsCharacterCards() {
    return (
      <>
        <Box>
          <Box
            className={css({
              display: "flex",
              flexFlow: "row",
              flexWrap: "wrap",
            })}
          >
            {sessionManager.computed.npcsWithCharacterSheets.map(
              (npc, index) => {
                return (
                  <Box
                    key={npc?.id || index}
                    className={css({
                      width: characterCardWidth,
                      display: "inline-block",
                      marginBottom: "1rem",
                    })}
                  >
                    <CharacterCard
                      key={npc?.id || index}
                      readonly={!isGM}
                      playerName={npc.playerName}
                      characterSheet={npc.character}
                      onCharacterDialogOpen={() => {
                        setCharacterDialogPlayerId(npc.id);
                      }}
                      onRoll={(newDiceRollResult) => {
                        handleSetPlayerRoll(npc.id, newDiceRollResult);
                      }}
                    />
                  </Box>
                );
              }
            )}
          </Box>
        </Box>
      </>
    );
  }

  function renderSessionTabsAndContent() {
    const tabPanelStyle = css({ padding: "0" });
    return (
      <Box mx=".5rem">
        <Box>
          <TabContext value={tab}>
            {props.mode !== SceneMode.Manage && renderSessionTabs()}
            <Box>
              <Box py="2rem" position="relative" minHeight="20rem">
                <TabPanel value={"characters"} className={tabPanelStyle}>
                  {renderPlayersCharacterCards()}
                </TabPanel>
                <TabPanel value={"npcs"} className={tabPanelStyle}>
                  {renderNpcsCharacterCards()}
                </TabPanel>
                <TabPanel value={"scene"} className={tabPanelStyle}>
                  <Scene
                    sceneManager={sceneManager}
                    isGM={isGM}
                    canLoad={props.mode !== SceneMode.Manage && isGM}
                    onRoll={handleSetMyRoll}
                    onPoolClick={(element) => {
                      diceManager.actions.addOrRemovePoolElement(element);
                      diceManager.actions.setPlayerId(gm.id);
                    }}
                    onIndexCardUpdate={(indexCard, type) => {
                      if (isGM) {
                        sceneManager.actions.updateIndexCard(indexCard, type);
                      } else {
                        connectionsManager?.actions.sendToHost<IPeerActions>({
                          action: "update-index-card",
                          payload: { indexCard: indexCard },
                        });
                      }
                    }}
                  />
                </TabPanel>

                <TabPanel value={"draw"} className={tabPanelStyle}>
                  {renderZones()}
                </TabPanel>
              </Box>
            </Box>
          </TabContext>
        </Box>
      </Box>
    );
  }

  function renderZones() {
    const tokenTitles = sessionManager.state.session.players.map(
      (p) => (p.character?.name ?? p.playerName) as string
    );
    return (
      <Box
        border={`1px solid ${theme.palette.divider}`}
        maxWidth="600px"
        margin="0 auto"
      >
        <DrawArea
          objects={sessionManager.state.session.drawAreaObjects}
          readonly={!isGM}
          tokenTitles={tokenTitles}
          onChange={(lines) => {
            sessionManager.actions.updateDrawAreaObjects(lines);
          }}
        />
      </Box>
    );
  }

  function renderSessionTabs() {
    const tabClass = css({
      background: headerBackgroundColor,
      color: `${headerColor} !important`,
      padding: "0 1.5rem",
      marginRight: ".5rem",
      // Pentagone
      // https://bennettfeely.com/clippy/
      clipPath: "polygon(0 0, 90% 0, 100% 35%, 100% 100%, 0 100%)",
    });
    const tabLabelClass = css({
      fontSize: "1rem",
      width: "100%",
    });

    return (
      <Box>
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          value={tab}
          classes={{
            flexContainer: css({
              borderBottom: `3px solid ${headerBackgroundColor}`,
            }),
          }}
          onChange={(e, newValue) => {
            setTab(newValue);
          }}
        >
          {props.mode !== SceneMode.Manage && (
            <Tab
              value="characters"
              data-cy="session.tabs.characters"
              label={
                <>
                  <FateLabel className={tabLabelClass}>
                    {t("menu.characters")}
                  </FateLabel>
                </>
              }
              className={tabClass}
              icon={<PeopleAltIcon />}
            />
          )}

          <Tab
            value="scene"
            data-cy="session.tabs.scene"
            label={
              <>
                <FateLabel className={tabLabelClass}>
                  {t("menu.scenes")}
                </FateLabel>
              </>
            }
            className={tabClass}
            icon={<MovieIcon />}
          />

          {props.mode !== SceneMode.Manage && (
            <Tab
              value="draw"
              data-cy="session.tabs.draw"
              label={
                <>
                  <FateLabel className={tabLabelClass}>
                    {t("draw-route.meta.title")}
                  </FateLabel>
                </>
              }
              className={tabClass}
              icon={<FilterHdrIcon />}
            />
          )}
        </Tabs>
      </Box>
    );
  }

  function renderCopyGameLink(link: string) {
    return (
      <>
        <input
          ref={$shareLinkInputRef}
          type="text"
          value={link}
          readOnly
          hidden
        />
        <Tooltip open={shareLinkToolTip.open} title="Copied!" placement="top">
          <span>
            <Button
              onClick={() => {
                if (link && $shareLinkInputRef.current) {
                  try {
                    $shareLinkInputRef.current.select();
                    document.execCommand("copy");
                    navigator.clipboard.writeText(link);
                    setShareLinkToolTip({ open: true });
                  } catch (error) {
                    window.open(link, "_blank");
                  }

                  logger.info("Scene:onCopyGameLink");
                }
              }}
              variant="outlined"
              color={shareLinkToolTip.open ? "primary" : "inherit"}
              endIcon={<FileCopyIcon />}
            >
              {t("play-route.copy-game-link")}
            </Button>
          </span>
        </Tooltip>
      </>
    );
  }

  function renderManagementActions() {
    if (!isGM) {
      return null;
    }

    return (
      <Box pb="1rem">
        <Grid
          container
          spacing={1}
          justifyContent="space-evenly"
          alignItems="center"
        >
          {props.mode === SceneMode.PlayOnline && props.shareLink && (
            <Grid item>{renderCopyGameLink(props.shareLink)}</Grid>
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
Session.displayName = "Session";

export function Scene(props: {
  sceneManager: ReturnType<typeof useScene>;
  isGM: boolean;
  canLoad: boolean;
  onRoll(diceRollResult: IDiceRollResult): void;
  onPoolClick(element: IDicePoolElement): void;
  onIndexCardUpdate(indexCard: IIndexCard, type: IIndexCardType): void;
}) {
  const { sceneManager } = props;
  const settingsManager = useContext(SettingsContext);
  const indexCardCollectionsManager = useContext(IndexCardCollectionsContext);
  const selectedIndexCardCollection =
    indexCardCollectionsManager.state.sceneIndexCardCollections.find(
      (i) => i.id === settingsManager.state.gameTemplate
    );

  const theme = useTheme();
  const logger = useLogger();
  const { t } = useTranslate();
  const isSMAndDown = useMediaQuery(theme.breakpoints.down("md"));
  const scenesManager = useContext(ScenesContext);
  const myBinderManager = useContext(MyBinderContext);

  const headerBackgroundColor = useTextColors(
    theme.palette.background.paper
  ).primary;
  const numberOfColumnsForCards = useResponsiveValue({
    xl: 3,
    lg: 3,
    md: 2,
    sm: 1,
    xs: 1,
  });
  const hiddenIndexCardRecord = useHiddenIndexCardRecord(
    sceneManager.state.scene?.indexCards
  );

  const [sort, setSort] = useState<SortMode>(SortMode.None);
  const [savedSnack, setSavedSnack] = useState(false);
  const [sceneTab, setSceneTab] = useState<"public" | "private" | "notes">(
    "public"
  );

  const headerColor = theme.palette.background.paper;
  const hasScene = !!sceneManager.state.scene;

  const handleLoadScene = (newScene: IScene) => {
    sceneManager.actions.loadScene(newScene, true);
  };

  const handleCloneAndLoadScene = (newScene: IScene) => {
    sceneManager.actions.cloneAndLoadNewScene(newScene);
  };

  return (
    <>
      {renderSavedSnackBar()}
      {hasScene ? renderSceneTabsAndContent() : renderNoScene()}
    </>
  );

  function renderSavedSnackBar() {
    return (
      <Snackbar
        open={savedSnack}
        autoHideDuration={2000}
        onClose={(event, reason) => {
          if (reason === "clickaway") {
            return;
          }
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
    );
  }

  function renderNoScene() {
    return (
      <Box>
        <Box mb="1rem">
          <Grid container justifyContent="center">
            <Grid item>
              <Typography variant="h6" color="textSecondary">
                {"No Scene Currently in Play"}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box mb="4rem">
          <Grid container justifyContent="center" spacing={2}>
            {renderSceneActionGridItems()}
          </Grid>
        </Box>
        <Box>
          <Grid container justifyContent="center">
            <Grid item>
              <img
                src="https://img.icons8.com/plasticine/100/000000/alps.png"
                className={css({
                  filter: "grayscale(1)",
                })}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }

  function renderSceneActionGridItems() {
    return (
      <>
        {sceneManager.state.scene && (
          <Grid item>
            <Button
              color="primary"
              data-cy="scene.save"
              endIcon={<SaveIcon />}
              variant={sceneManager.state.dirty ? "contained" : "outlined"}
              onClick={() => {
                scenesManager.actions.upsert(sceneManager.state.scene);
                sceneManager.actions.loadScene(
                  sceneManager.state.scene as IScene,
                  false
                );
                setSavedSnack(true);
                logger.info("Scene:onSave");
              }}
            >
              {t("play-route.save-scene")}
            </Button>
          </Grid>
        )}
        {props.canLoad && (
          <>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                data-cy="scene.new-scene"
                endIcon={<MovieIcon />}
                onClick={() => {
                  const confirmed = sceneManager.state.scene
                    ? confirm(t("play-route.reset-scene-confirmation"))
                    : true;
                  if (confirmed) {
                    sceneManager.actions.addAndSetNewScene();
                    logger.info("Scene:onReset");
                  }
                }}
              >
                {t("play-route.new-scene")}
              </Button>
            </Grid>
            <Grid item>
              <SplitButton
                color="primary"
                variant="outlined"
                options={[
                  {
                    label: t("play-route.load-scene"),
                    onClick: () => {
                      myBinderManager.actions.open({
                        folder: "scenes",
                        callback: handleLoadScene,
                      });
                    },
                  },
                  {
                    label: t("play-route.clone-and-load-scene"),
                    onClick: () => {
                      myBinderManager.actions.open({
                        folder: "scenes",
                        callback: handleCloneAndLoadScene,
                      });
                    },
                  },
                ]}
              />
            </Grid>
          </>
        )}
      </>
    );
  }

  function renderSceneTabsAndContent() {
    const tabPanelStyle = css({ padding: "0" });

    return (
      <Box>
        <Box>
          <Box mb="1rem">
            <Grid
              container
              justifyContent={props.canLoad ? "flex-start" : "center"}
              spacing={2}
            >
              {renderSceneActionGridItems()}
            </Grid>
          </Box>
          <Box>
            <Container maxWidth="sm">{renderSceneNameAndGroup()}</Container>
          </Box>

          <TabContext value={sceneTab}>
            {renderSceneTabs()}
            <Box>
              <Box py="2rem" position="relative" minHeight="20rem">
                <TabPanel value={"public"} className={tabPanelStyle}>
                  {renderIndexCardsForTab(
                    sceneManager.state.scene?.indexCards.public,
                    "public"
                  )}
                </TabPanel>
                <TabPanel value={"private"} className={tabPanelStyle}>
                  {renderIndexCardsForTab(
                    sceneManager.state.scene?.indexCards.private,
                    "private"
                  )}
                </TabPanel>
                <TabPanel value={"notes"} className={tabPanelStyle}>
                  {renderSceneNotes()}
                </TabPanel>
              </Box>
            </Box>
          </TabContext>
        </Box>
      </Box>
    );
  }

  function renderSceneNameAndGroup() {
    return (
      <>
        <Box mb=".5rem">
          <FateLabel
            variant="h4"
            uppercase={false}
            className={css({
              borderBottom: `1px solid ${theme.palette.divider}`,
              textAlign: "center",
            })}
          >
            <ContentEditable
              autoFocus
              data-cy="scene.name"
              value={sceneManager.state.scene?.name ?? ""}
              readonly={!props.isGM}
              onChange={(value) => {
                sceneManager.actions.updateName(value);
              }}
            />
          </FateLabel>
          <FormHelperText className={css({ textAlign: "right" })}>
            {t("play-route.scene-name")}
          </FormHelperText>
        </Box>
        <Collapse in={!!(sceneManager.state.scene?.name ?? "")}>
          <Box mb="1rem">
            <Grid
              container
              spacing={2}
              wrap="nowrap"
              justifyContent="center"
              alignItems="flex-end"
            >
              <Grid item>
                <FateLabel>{t("play-route.group")}</FateLabel>
              </Grid>
              <Grid item xs={8} sm={4}>
                <LazyState
                  value={sceneManager.state.scene?.group}
                  delay={750}
                  onChange={(newGroup) => {
                    sceneManager.actions.setGroup(newGroup);
                  }}
                  render={([lazyGroup, setLazyGroup]) => {
                    return (
                      <Autocomplete
                        freeSolo
                        // multiple
                        options={scenesManager.state.groups.filter((g) => {
                          const currentGroup = lazyGroup ?? "";
                          return g.toLowerCase().includes(currentGroup);
                        })}
                        value={lazyGroup ?? ""}
                        onChange={(event, newValue) => {
                          setLazyGroup(newValue || undefined);
                        }}
                        inputValue={lazyGroup ?? ""}
                        onInputChange={(event, newInputValue) => {
                          setLazyGroup(newInputValue);
                        }}
                        disabled={!props.isGM}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            InputProps={{
                              ...params.InputProps,
                              disableUnderline: true,
                            }}
                            data-cy="scene.group"
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
                    );
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </>
    );
  }
  function renderSceneNotes() {
    return (
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Box>
            <Box mb="1rem">
              <FateLabel variant="h6">{t("play-route.gm-notes")}</FateLabel>
            </Box>
            <Box>
              <ContentEditable
                autoFocus
                placeholder={"Scene Notes..."}
                value={sceneManager.state.scene?.notes ?? ""}
                onChange={(newNotes) => {
                  sceneManager.actions.setNotes(newNotes);
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    );
  }

  function renderIndexCardsForTab(
    indexCardsFromTab: Array<IIndexCard> = [],
    type: IIndexCardType
  ) {
    const hasIndexCards = indexCardsFromTab.length > 0;

    return (
      <Box>
        <Box>{renderGMIndexCardActions(type)}</Box>
        <Box mb="2rem">
          <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="flex-end"
          >
            <Grid item>
              <FormControl variant="standard">
                <InputLabel>{t("play-route.sort")}</InputLabel>

                <Select
                  native
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as SortMode);
                  }}
                  variant="standard"
                >
                  <option value={SortMode.None}>
                    {t("play-route.sort-options.none")}
                  </option>
                  <option value={SortMode.GroupFirst}>
                    {t("play-route.sort-options.groups-first")}
                  </option>
                  <option value={SortMode.PinnedFirst}>
                    {t("play-route.sort-options.pinned-first")}
                  </option>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  hiddenIndexCardRecord.actions.toggleAll();
                }}
              >
                {hiddenIndexCardRecord.state.areAllCardsVisible
                  ? t("play-route.collapse-all")
                  : t("play-route.expand-all")}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {renderIndexCards(indexCardsFromTab, type)}

        {!hasIndexCards && (
          <Box py="6rem" textAlign="center">
            <Typography
              variant="h6"
              className={css({
                fontWeight: theme.typography.fontWeightBold,
              })}
            >
              {t("play-route.no-aspects")}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  function renderIndexCards(
    indexCardsFromTab: Array<IIndexCard>,
    type: IIndexCardType
  ) {
    const sortByPinned: IArraySortGetter<IIndexCard> = (indexCard) => {
      return { value: indexCard.pinned, direction: "asc" };
    };
    const sortByGroup: IArraySortGetter<IIndexCard> = (indexCard) => {
      return { value: indexCard.subCards.length > 0, direction: "asc" };
    };
    const sorters: Array<IArraySortGetter<IIndexCard>> = [];
    if (sort === SortMode.GroupFirst) {
      sorters.push(sortByGroup);
    } else if (sort === SortMode.PinnedFirst) {
      sorters.push(sortByPinned);
    }
    const sortedCards = arraySort(indexCardsFromTab, sorters);

    return (
      <Box>
        <ImageList
          variant={sortedCards.length >= 10 ? "masonry" : "standard"}
          cols={numberOfColumnsForCards}
          gap={16}
          className={css({
            overflow: "initial",
          })}
        >
          {sortedCards.map((indexCard, index) => {
            const hasChildren = indexCard.subCards.length > 0;
            return (
              <ImageListItem
                key={`${indexCard.id}.${type}`}
                cols={hasChildren ? numberOfColumnsForCards : 1}
                className={css({
                  width: "100%",
                  paddingTop: ".25rem",
                  paddingBottom: ".25rem",
                  // Cards with children take 100% of the available space
                  columnSpan: hasChildren ? "all" : "initial",
                  /**
                   * Disables bottom being cut-off in Chrome
                   */
                  // breakInside: "avoid",
                  /**
                   * Disables bottom being cut-off in Firefox
                   */
                  display: hasChildren ? "block" : "inline-block",
                })}
              >
                <IndexCard
                  type={type}
                  reactDndIndex={index}
                  allCards={sortedCards}
                  canMove={sort === SortMode.None && props.isGM}
                  key={indexCard.id}
                  reactDndType={DragAndDropTypes.SceneIndexCards}
                  data-cy={`scene.aspect.${index}`}
                  id={`index-card-${indexCard.id}`}
                  indexCardHiddenRecord={
                    hiddenIndexCardRecord.state.indexCardHiddenRecord
                  }
                  onToggleVisibility={(indexCard) => {
                    hiddenIndexCardRecord.actions.toggle(indexCard);
                  }}
                  onTogglePrivate={() => {
                    sceneManager.actions.toggleIndexCardSection(
                      indexCard,
                      type
                    );
                  }}
                  onMoveTo={(
                    idOfIndexCardToMove: string,
                    idOfIndexCardToMoveTo: string
                  ) => {
                    sceneManager.actions.moveIndexCardTo(
                      idOfIndexCardToMove,
                      idOfIndexCardToMoveTo,
                      type
                    );
                  }}
                  isGM={props.isGM}
                  indexCard={indexCard}
                  onRoll={props.onRoll}
                  onPoolClick={props.onPoolClick}
                  onMove={(dragIndex, hoverIndex) => {
                    sceneManager.actions.moveIndexCard(
                      dragIndex,
                      hoverIndex,
                      type
                    );
                  }}
                  onChange={(newIndexCard) => {
                    props.onIndexCardUpdate(newIndexCard, type);
                  }}
                  onDuplicate={() => {
                    sceneManager.actions.duplicateIndexCard(indexCard, type);
                  }}
                  onRemove={() => {
                    sceneManager.actions.removeIndexCard(indexCard.id, type);
                  }}
                />
              </ImageListItem>
            );
          })}
        </ImageList>
      </Box>
    );
  }

  function renderSceneTabs() {
    const tabClass = css({
      background: headerBackgroundColor,
      marginRight: ".5rem",
      color: `${headerColor} !important`,
      // Pentagone
      // https://bennettfeely.com/clippy/
      // clipPath: "polygon(0 0, 90% 0, 100% 35%, 100% 100%, 0 100%)",
    });
    const tabLabelClass = css({
      fontSize: ".8rem",
      // width: "100%",
    });

    return (
      <Box>
        <Tabs
          // variant="scrollable"
          // scrollButtons="auto"
          value={sceneTab}
          classes={{
            flexContainer: css({
              borderBottom: `1px solid ${headerBackgroundColor}`,
            }),
          }}
          onChange={(e, newValue) => {
            setSceneTab(newValue);
          }}
        >
          <Tab
            value="public"
            data-cy="scene.tabs.public"
            label={
              <>
                <FateLabel className={tabLabelClass}>
                  {t("play-route.public")}
                </FateLabel>
              </>
            }
            className={tabClass}
          />
          {props.isGM && (
            <Tab
              value="private"
              data-cy="scene.tabs.private"
              label={
                <>
                  <FateLabel className={tabLabelClass}>
                    {t("play-route.private")}
                  </FateLabel>
                </>
              }
              className={tabClass}
            />
          )}
          {props.isGM && (
            <Tab
              value="notes"
              data-cy="scene.tabs.gm-notes"
              label={
                <>
                  <FateLabel className={tabLabelClass}>
                    {t("play-route.gm-notes")}
                  </FateLabel>
                </>
              }
              className={tabClass}
            />
          )}
        </Tabs>
      </Box>
    );
  }

  function renderGMIndexCardActions(type: IIndexCardType) {
    if (!props.isGM) {
      return null;
    }
    return (
      <Box mb="1rem">
        <Grid container spacing={1} justifyContent="center">
          <Grid item>
            <FormControl variant="standard">
              <Select
                native
                value={settingsManager.state.gameTemplate}
                onChange={(e) => {
                  settingsManager.actions.setGameTemplate(e.target.value);
                }}
                variant="standard"
              >
                <option value={""}>- Collections -</option>
                {indexCardCollectionsManager.state.sceneIndexCardCollections.map(
                  (indexCardCollection) => (
                    <option
                      key={indexCardCollection.id}
                      value={indexCardCollection.id}
                    >
                      {previewContentEditable({
                        value: indexCardCollection.name,
                      })}
                    </option>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <ButtonGroup
              color="inherit"
              variant="outlined"
              orientation={isSMAndDown ? "vertical" : "horizontal"}
            >
              <Button
                data-cy="scene.add-card"
                onClick={() => {
                  sceneManager.actions.addIndexCard(type);
                  logger.info("Scene:onAddCard:IndexCard");
                }}
                endIcon={<AddCircleOutlineIcon />}
              >
                {t("play-route.add-index-card")}
              </Button>
              {(selectedIndexCardCollection?.indexCards ?? []).map((card) => {
                return (
                  <Button
                    key={card.titleLabel}
                    data-cy={`scene.add-card-${card.titleLabel}`}
                    onClick={() => {
                      sceneManager.actions.duplicateIndexCard(card, type);
                    }}
                    endIcon={<AddCircleOutlineIcon />}
                  >
                    {card.titleLabel}
                  </Button>
                );
              })}
            </ButtonGroup>
          </Grid>
        </Grid>
      </Box>
    );
  }
}
