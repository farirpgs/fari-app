import { css } from "@emotion/css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CreateIcon from "@mui/icons-material/Create";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import ErrorIcon from "@mui/icons-material/Error";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import FilterHdrIcon from "@mui/icons-material/FilterHdr";
import MovieIcon from "@mui/icons-material/Movie";
import PanToolIcon from "@mui/icons-material/PanTool";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SaveIcon from "@mui/icons-material/Save";
import Masonry from "@mui/lab/Masonry";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import { darken, useTheme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
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
import { ICharacter } from "../../domains/character/types";
import { IDiceRollResult } from "../../domains/dice/Dice";
import { Font } from "../../domains/font/Font";
import { Icons } from "../../domains/Icons/Icons";
import { useBlockReload } from "../../hooks/useBlockReload/useBlockReload";
import { useElementWidth } from "../../hooks/useElementWidth/useElementWidth";
import { LazyState } from "../../hooks/useLazyState/useLazyState";
import { useResponsiveValue } from "../../hooks/useResponsiveValue/useResponsiveValue";
import {
  IIndexCard,
  IIndexCardType,
  IPlayer,
  IScene,
} from "../../hooks/useScene/IScene";
import { useScene } from "../../hooks/useScene/useScene";
import {
  useSession,
  useSessionCharacterSheets,
} from "../../hooks/useScene/useSession";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { CharacterV3Dialog } from "../../routes/Character/components/CharacterDialog/CharacterV3Dialog";
import { IDicePoolElement } from "../../routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";
import {
  MiniThemeContext,
  useMiniTheme,
} from "../../routes/Character/components/CharacterDialog/MiniThemeContext";
import {
  TlDrawErrorBoundary,
  TldrawReader,
  TldrawWriter,
} from "../../routes/Draw/TldrawWriterAndReader";
import {
  IPlayerInteraction,
  PlayerInteractionFactory,
} from "../../routes/Play/types/IPlayerInteraction";
import {
  ContentEditable,
  previewContentEditable,
} from "../ContentEditable/ContentEditable";
import { FateLabel } from "../FateLabel/FateLabel";
import { IndexCard, IndexCardMinWidth } from "../IndexCard/IndexCard";
import { Page } from "../Page/Page";
import { SplitButton } from "../SplitButton/SplitButton";
import { Toolbox } from "../Toolbox/Toolbox";
import { WindowPortal } from "../WindowPortal/WindowPortal";
import { CharacterCard } from "./components/PlayerRow/CharacterCard/CharacterCard";
import { PlayerRow } from "./components/PlayerRow/PlayerRow";
import { useHiddenIndexCardRecord } from "./hooks/useHiddenIndexCardRecord";
import { TabbedScreen } from "./TabbedScreen";

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

const paperStyle = css({ borderRadius: "0px", flex: "1 0 auto" });

type IProps = {
  sessionManager: ReturnType<typeof useSession>;
  sessionCharactersManager: ReturnType<typeof useSessionCharacterSheets>;
  sceneManager: ReturnType<typeof useScene>;
  userId: string;
  isLoading?: boolean;
  error?: any;
  shareLink?: string;
  idFromParams?: string;
  onPlayerInteraction?(interaction: IPlayerInteraction): void;
};

export const Session: React.FC<IProps> = (props) => {
  const { sessionManager, sceneManager, sessionCharactersManager } = props;

  const charactersManager = useContext(CharactersContext);
  const myBinderManager = useContext(MyBinderContext);

  const isGM = !props.idFromParams;

  useBlockReload(sceneManager.state.dirty);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const miniTheme = useMiniTheme({
    enforceBackground: theme.palette.background.default,
  });

  const { t } = useTranslate();
  const logger = useLogger();
  const diceManager = useContext(DiceContext);

  const characterCardWidth = useResponsiveValue({
    xl: "400px",
    lg: "400px",
    md: "400px",
    sm: "400px",
    xs: "300px",
  });

  const textColors = useTextColors(theme.palette.primary.main);

  const [streamerModalOpen, setStreamerModalOpen] = useState(false);
  const [shareLinkToolTip, setShareLinkToolTip] = useState({ open: false });
  const [characterDialogPlayerId, setCharacterDialogPlayerId] = useState<
    string | undefined
  >(undefined);

  const $shareLinkInputRef = useRef<HTMLInputElement | null>(null);

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
  const userId = props.userId;
  const gm = sessionManager.state.session.gm;
  const players = Object.values(sessionManager.state.session.players) ?? [];

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

  const handleGMAddNpc = () => {
    sessionManager.actions.addNpc();
  };

  const handleAssignOriginalCharacterSheet = (
    playerId: string,
    character: ICharacter
  ) => {
    if (isGM) {
      sessionCharactersManager.actions.loadPlayerCharacter(playerId, character);
    } else {
      props.onPlayerInteraction?.(
        PlayerInteractionFactory.updatePlayerCharacter(playerId, character)
      );
    }
  };

  function handleUpdateCharacter(
    playerId: string,
    updatedCharacter: ICharacter
  ) {
    if (isGM) {
      sessionCharactersManager.actions.updatePlayerCharacter(
        playerId,
        updatedCharacter
      );
    } else {
      props.onPlayerInteraction?.(
        PlayerInteractionFactory.updatePlayerCharacter(
          playerId,
          updatedCharacter
        )
      );
    }
  }

  const handleOnToggleCharacterSync = (character: ICharacter | undefined) => {
    charactersManager.actions.upsert(character);
  };

  const handleSetMyRoll = (result: IDiceRollResult) => {
    if (isGM) {
      sessionManager.actions.updateGmRoll(result);
    } else {
      props.onPlayerInteraction?.(
        PlayerInteractionFactory.updatePlayerRolls(me!.id, result)
      );
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
      props.onPlayerInteraction?.(
        PlayerInteractionFactory.updatePlayerRolls(me!.id, result)
      );
    }
  };
  return (
    <Page pb="6rem" isLive gameId={props.idFromParams} maxWidth="none">
      <Box px="1rem">
        <Prompt when={true} message={t("manager.leave-without-saving")} />

        {/* <Prompt
          when={isGMHostingOnlineOrOfflineGame}
          message={t("play-route.host-leaving-warning")}
        /> */}
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
              {isGM && (
                <Grid item>
                  <Tooltip title={t("play-route.fire-rainbow-confetti")}>
                    <IconButton
                      onClick={() => {
                        sessionManager.actions.fireGoodConfetti();
                        logger.track("session.fire_good_confetti");
                      }}
                      color="primary"
                      size="large"
                    >
                      <Icons.PartyPopper
                        className={css({ width: "2rem", height: "2rem" })}
                        htmlColor={darken(theme.palette.success.main, 0.2)}
                      />
                    </IconButton>
                  </Tooltip>
                </Grid>
              )}

              <Grid item>
                <Tooltip title={t("play-route.pause-session")}>
                  <IconButton
                    onClick={() => {
                      if (isGM) {
                        sessionManager.actions.pause();
                      } else {
                        props.onPlayerInteraction?.(
                          PlayerInteractionFactory.pause()
                        );
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
                </Tooltip>
              </Grid>

              {isGM && (
                <Grid item>
                  <Tooltip title={t("play-route.fire-red-confetti")}>
                    <IconButton
                      onClick={() => {
                        sessionManager.actions.fireBadConfetti();

                        logger.track("session.fire_fire_confetti");
                      }}
                      color="primary"
                      size="large"
                    >
                      <Icons.PartyPopper
                        className={css({ width: "2rem", height: "2rem" })}
                        htmlColor={darken(theme.palette.error.main, 0.2)}
                      />
                    </IconButton>
                  </Tooltip>
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
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  function renderPageContent() {
    return (
      <Fade in>
        <Box>
          <Grid container spacing={2}>
            <Grid
              item
              className={css({
                flex: isSmall ? "1 1 auto" : "0 1 auto",
                minWidth: "25rem",
              })}
            >
              {renderSidePanel()}
            </Grid>
            <Grid item xs={12} md>
              {renderSession()}
            </Grid>
          </Grid>
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
        {isGM && (
          <DialogActions>
            <Button
              color="secondary"
              onClick={() => {
                sessionManager.actions.unpause();
              }}
            >
              {t("play-route.paused-dialog.continue")}
            </Button>
          </DialogActions>
        )}
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
                    {Object.keys(sessionManager.state.session.players).length +
                      1}
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
                            logger.track("session.reset_initiative");
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
                                handleGMAddNpc();

                                logger.track("session.add_npc");
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
              dataCyIndex: "gm",
              isChild: false,
              color: gm.color,
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
                              color: gm.color,
                              canControl: me?.id === gm.id,
                              isMe: me?.id === gm.id,
                              isChild: true,
                              dataCyIndex: `gm-npc-${npcIndex}`,
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
                    color: player.color,
                    isChild: false,
                    dataCyIndex: playerRowIndex,
                  })}
                </React.Fragment>
              );
            })}
          </Paper>
        </Box>
      </Box>
    );
  }

  function getCharacterSheet(playerId: string) {
    const playerCharacter =
      sessionCharactersManager.state.characterSheets[playerId];
    return playerCharacter;
  }

  function renderPlayerCharacterDialog(options: {
    player: IPlayer;
    canControl: boolean;
  }) {
    const { player, canControl } = options;
    if (characterDialogPlayerId !== player.id) {
      return null;
    }

    const characterSheet = getCharacterSheet(player.id);
    const isCharacterInStorage = charactersManager.selectors.isInStorage(
      characterSheet?.id
    );

    return (
      <CharacterV3Dialog
        readonly={!canControl}
        open={characterDialogPlayerId === player.id}
        character={characterSheet}
        dialog={true}
        onSave={(updatedCharacter) => {
          handleUpdateCharacter(player.id, updatedCharacter);
        }}
        onClose={() => {
          setCharacterDialogPlayerId(undefined);
        }}
        synced={isCharacterInStorage}
        onToggleSync={() => {
          handleOnToggleCharacterSync(characterSheet);
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
    dataCyIndex: number | string;
    isChild: boolean;
    color: string;
    children?: JSX.Element;
  }) {
    const {
      player,
      canControl,
      isMe,
      isChild,
      dataCyIndex: playerRowDataCyIndex,
      children: playerRowChildren,
    } = options;
    const characterSheet = getCharacterSheet(player.id);

    return (
      <PlayerRow
        data-cy={`scene.player-row.${playerRowDataCyIndex}`}
        color={options.color}
        isChild={isChild}
        permissions={{
          canRoll: canControl,
          canUpdatePoints: canControl,
          canUpdateInitiative: canControl,
          canLoadCharacterSheet: canControl && !player.isGM,
          canRemove: isGM && !player.isGM,
          canMarkPrivate: isGM && isChild,
        }}
        key={player.id}
        isMe={isMe}
        player={player}
        characterSheet={characterSheet}
        onPlayerRemove={() => {
          sessionManager.actions.removePlayer(player.id);
          sessionCharactersManager.actions.removeCharacterSheet(player.id);
        }}
        onTogglePrivate={() => {
          sessionManager.actions.togglePlayerVisibility(player.id);
        }}
        onCharacterSheetOpen={() => {
          if (characterSheet) {
            setCharacterDialogPlayerId(player.id);
          }
        }}
        onAssignCharacterSheet={() => {
          myBinderManager.actions.open({
            folder: "characters",
            callback: (character) => {
              handleAssignOriginalCharacterSheet(player.id, character);
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
            props.onPlayerInteraction?.(
              PlayerInteractionFactory.updatePlayerPlayedDuringTurn(
                player.id,
                playedInTurnOrder
              )
            );
          }
        }}
        onPointsChange={(points, maxPoints) => {
          if (isGM) {
            sessionCharactersManager.actions.updatePlayerCharacterMainPointCounter(
              player.id,
              points,
              maxPoints
            );
          } else {
            props.onPlayerInteraction?.(
              PlayerInteractionFactory.updatePlayerPoints(
                player.id,
                points,
                maxPoints
              )
            );
          }
        }}
      >
        {playerRowChildren}
      </PlayerRow>
    );
  }

  function renderCharacterCards() {
    const everyone = sessionManager.computed.everyone;
    const characters = sessionCharactersManager.state.characterSheets;
    const playersWithCharacterSheets = Object.keys(characters)
      .map((characterId) => {
        const playerMatch = everyone.find(
          (player) => player.id === characterId
        ) as IPlayer;
        return {
          ...playerMatch,
          characterSheet: characters[characterId],
        };
      })
      .sort((a, b) => {
        return a.id === props.userId ? -1 : b.id === props.userId ? 1 : 0;
      });
    return (
      <>
        <Box>
          <Box
            className={css({
              display: "flex",
              flexFlow: "row",
              flexWrap: "nowrap",
              overflow: "hidden",
              overflowX: "auto",
            })}
          >
            {showEmptyWarnings()}
            <MiniThemeContext.Provider value={miniTheme}>
              {playersWithCharacterSheets.map((player, index) => {
                const isMe = props.userId === player.id;
                const isVisible = isGM || !player.private;
                const canControl = isGM || isMe;

                if (!isVisible) {
                  return null;
                }

                return (
                  <Box
                    key={player?.id || index}
                    sx={{
                      display: "inline-block",
                      marginBottom: "1rem",
                      width: characterCardWidth,
                    }}
                  >
                    <CharacterCard
                      key={player?.id || index}
                      readonly={!canControl}
                      playerName={player.playerName}
                      characterSheet={player.characterSheet}
                      onCharacterDialogOpen={() => {
                        setCharacterDialogPlayerId(player.id);
                      }}
                      onChange={(updatedCharacter) => {
                        handleUpdateCharacter(player.id, updatedCharacter);
                      }}
                      onRoll={(newDiceRollResult) => {
                        handleSetPlayerRoll(player.id, newDiceRollResult);
                      }}
                    />
                  </Box>
                );
              })}
            </MiniThemeContext.Provider>
          </Box>
        </Box>
      </>
    );
  }

  function renderZones() {
    return (
      <TlDrawErrorBoundary>
        <Box border={`1px solid ${theme.palette.divider}`} margin="0 auto">
          {isGM ? (
            <TldrawWriter
              state={sessionManager.state.session.tlDrawDoc}
              onChange={(state) => {
                sessionManager.actions.updateDrawAreaObjects(state);
              }}
            />
          ) : (
            <TldrawReader state={sessionManager.state.session.tlDrawDoc} />
          )}
        </Box>
      </TlDrawErrorBoundary>
    );
  }

  function showEmptyWarnings() {
    const numberOfSheets = Object.keys(
      sessionCharactersManager.state.characterSheets
    ).length;
    const showNoPlayersWarning =
      sessionManager.computed.playersAndNPCs.length === 0;
    const showNoSheetsWarning = numberOfSheets === 0;

    if (showNoPlayersWarning) {
      return (
        <Box>
          <Typography variant="h6" color="textSecondary">
            There are no players or GM characters in this session.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Copy and send the session link to your friends, or add GM characters
            using the buttons on the left.
          </Typography>
        </Box>
      );
    }

    if (showNoSheetsWarning) {
      return (
        <Box>
          <Typography variant="h6" color="textSecondary">
            No character sheets have been loaded yet.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            To assign a character sheet to a player, click on their{" "}
            <CreateIcon /> button, and select the character sheet you want to
            use.
          </Typography>
        </Box>
      );
    }

    return null;
  }

  function renderSession() {
    return (
      <Box>
        <TabbedScreen
          tabs={[
            {
              value: "characters",
              dataCy: "session.tabs.scene",
              label: t("menu.characters"),
              icon: <PeopleAltIcon />,
              render: renderCharacterCards,
            },
            {
              value: "scene",
              dataCy: "session.tabs.characters",
              label: t("menu.scenes"),
              icon: <MovieIcon />,
              render: () => (
                <Scene
                  sceneManager={sceneManager}
                  isGM={isGM}
                  canLoad={isGM}
                  onRoll={handleSetMyRoll}
                  onPoolClick={(element) => {
                    diceManager.actions.addOrRemovePoolElement(element);
                    diceManager.actions.setPlayerId(gm.id);
                  }}
                  onIndexCardUpdate={(indexCard, type) => {
                    if (isGM) {
                      sceneManager.actions.updateIndexCard(indexCard, type);
                    } else {
                      props.onPlayerInteraction?.({
                        type: "update-index-card",
                        payload: {
                          indexCard: indexCard,
                          indexCardType: type,
                        },
                      });
                    }
                  }}
                />
              ),
            },
            {
              value: "draw",
              dataCy: "session.tabs.draw",
              label: t("draw-route.meta.title"),
              icon: <FilterHdrIcon />,
              render: renderZones,
            },
          ]}
        />
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

                  logger.track("session.copy_session_link");
                }
              }}
              variant="outlined"
              color={shareLinkToolTip.open ? "secondary" : "inherit"}
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
          {props.shareLink && (
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

  const scenesManager = useContext(ScenesContext);
  const myBinderManager = useContext(MyBinderContext);

  const headerBackgroundColor = useTextColors(
    theme.palette.background.paper
  ).primary;

  const indexCardsContainerRef = useRef<HTMLElement>(null);
  const indexCardsContainerWidth = useElementWidth(indexCardsContainerRef);
  const numberOfColumnsForIndexCardsMasonry = Math.floor(
    indexCardsContainerWidth / IndexCardMinWidth
  );

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
    sceneManager.actions.loadScene(newScene);
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
                {"No Scene has been loaded yet."}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box mb="4rem">
          <Grid container justifyContent="center" spacing={1}>
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
        {props.canLoad && (
          <Grid item>
            <ButtonGroup
              color="primary"
              aria-label="outlined primary button group"
            >
              <Button
                color="secondary"
                data-cy="scene.new-scene"
                onClick={() => {
                  const confirmed = sceneManager.state.scene
                    ? confirm(t("play-route.reset-scene-confirmation"))
                    : true;
                  if (confirmed) {
                    sceneManager.actions.addAndSetNewScene();

                    logger.track("session.new_scene");
                  }
                }}
              >
                {t("play-route.new-scene")}
              </Button>
              <Button
                color="secondary"
                onClick={() => {
                  myBinderManager.actions.open({
                    folder: "scenes",
                    callback: handleLoadScene,
                  });
                }}
              >
                {t("play-route.load-scene")}
              </Button>
              <Button
                color="secondary"
                onClick={() => {
                  myBinderManager.actions.open({
                    folder: "scenes",
                    callback: handleCloneAndLoadScene,
                  });
                }}
              >
                {t("play-route.clone-and-load-scene")}
              </Button>
            </ButtonGroup>
          </Grid>
        )}

        {sceneManager.state.scene && props.isGM && (
          <Grid item>
            <Button
              color="secondary"
              data-cy="scene.save"
              endIcon={<SaveIcon />}
              variant={sceneManager.state.dirty ? "contained" : "outlined"}
              onClick={() => {
                scenesManager.actions.upsert(sceneManager.state.scene);
                sceneManager.actions.loadScene(
                  sceneManager.state.scene as IScene
                );
                setSavedSnack(true);
                logger.track("scene.save");
              }}
            >
              {t("play-route.save-scene")}
            </Button>
          </Grid>
        )}
      </>
    );
  }

  function renderSceneTabsAndContent() {
    const tabPanelStyle = css({ padding: "0" });

    return (
      <Box>
        <Box>
          {/* <Box mb="1rem">
            <Grid
              container
              justifyContent={props.canLoad ? "flex-start" : "center"}
              spacing={2}
            >
              
            </Grid>
          </Box> */}
          <Box mb="1rem">
            <Grid container justifyContent="space-between" spacing={2}>
              <Grid item xs={12} md={12} lg={8}>
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={8}>
                    {renderSceneName()}
                  </Grid>
                  <Grid item xs={4}>
                    {renderSceneGroup()}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={12} lg={4}>
                <Grid container spacing={2} justifyContent="flex-end">
                  {renderSceneActionGridItems()}
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <TabContext value={sceneTab}>
            {renderSceneTabs()}
            <Box>
              <Box
                py="2rem"
                position="relative"
                sx={{
                  overflowX: "auto",
                }}
              >
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

  function renderSceneName() {
    return (
      <>
        <FateLabel
          variant="h4"
          uppercase={false}
          className={css({
            borderBottom: `1px solid ${theme.palette.divider}`,
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
        <FormHelperText>{t("play-route.scene-name")}</FormHelperText>
      </>
    );
  }

  function renderSceneGroup() {
    return (
      <>
        <Box>
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
          <FormHelperText>{t("play-route.group")}</FormHelperText>
        </Box>
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
        <Box>{renderIndexCardActions(type)}</Box>

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

    const sorters: Array<IArraySortGetter<IIndexCard>> = [];
    if (sort === SortMode.PinnedFirst) {
      sorters.push(sortByPinned);
    }

    const cardsWithChildren = indexCardsFromTab.filter((card) => {
      return card.subCards.length > 0;
    });
    const cardsWithoutChildren = indexCardsFromTab.filter((card) => {
      return card.subCards.length === 0;
    });

    return (
      <Box ref={indexCardsContainerRef}>
        {renderIndexCardMasonry({
          columns: 1,
          allCards: indexCardsFromTab,
          cards: cardsWithChildren,
          type: type,
        })}
        {renderIndexCardMasonry({
          columns: numberOfColumnsForIndexCardsMasonry,
          allCards: indexCardsFromTab,
          cards: cardsWithoutChildren,
          type: type,
        })}
      </Box>
    );
  }

  function renderIndexCardMasonry(renderProps: {
    columns: number;
    cards: Array<IIndexCard>;
    allCards: Array<IIndexCard>;
    type: IIndexCardType;
  }) {
    if (!renderProps.cards.length) {
      return null;
    }
    return (
      <Box>
        <Masonry columns={renderProps.columns}>
          {renderProps.cards.map((indexCard, index) => {
            const hasChildren = indexCard.subCards.length > 0;
            return (
              <Box
                key={indexCard.id}
                sx={{
                  padding: ".5rem",
                  width: hasChildren ? "100% !important" : undefined,
                }}
              >
                <IndexCard
                  type={renderProps.type}
                  allCards={renderProps.allCards}
                  canMove={
                    (sort === SortMode.None ||
                      indexCard.subCards.length === 0) &&
                    props.isGM
                  }
                  data-cy={`scene.aspect.${index}`}
                  id={`index-card-${indexCard.id}`}
                  indexCardHiddenRecord={
                    hiddenIndexCardRecord.state.indexCardHiddenRecord
                  }
                  onMove={(oldId, newId) => {
                    sceneManager.actions.moveIndexCard(
                      oldId,
                      newId,
                      renderProps.type
                    );
                  }}
                  onToggleVisibility={(indexCard) => {
                    hiddenIndexCardRecord.actions.toggle(indexCard);
                  }}
                  onTogglePrivate={() => {
                    sceneManager.actions.toggleIndexCardSection(
                      indexCard,
                      renderProps.type
                    );
                  }}
                  onMoveTo={(
                    idOfIndexCardToMove: string,
                    idOfIndexCardToMoveTo: string
                  ) => {
                    sceneManager.actions.moveIndexCardTo(
                      idOfIndexCardToMove,
                      idOfIndexCardToMoveTo,
                      renderProps.type
                    );
                  }}
                  onMoveOut={(idOfIndexCardToMove) => {
                    sceneManager.actions.moveIndexCardOut(
                      idOfIndexCardToMove,
                      renderProps.type
                    );
                  }}
                  isGM={props.isGM}
                  indexCard={indexCard}
                  onRoll={props.onRoll}
                  onPoolClick={props.onPoolClick}
                  onChange={(newIndexCard) => {
                    props.onIndexCardUpdate(newIndexCard, renderProps.type);
                  }}
                  onDuplicate={() => {
                    sceneManager.actions.duplicateIndexCard(
                      indexCard,
                      renderProps.type
                    );
                  }}
                  onRemove={() => {
                    sceneManager.actions.removeIndexCard(
                      indexCard.id,
                      renderProps.type
                    );
                  }}
                />
              </Box>
            );
          })}
        </Masonry>
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
            indicator: css({
              height: ".4rem",
              backgroundColor: theme.palette.secondary.main,
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

  function renderIndexCardActions(type: IIndexCardType) {
    return (
      <Box mb="1rem">
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          {props.isGM && (
            <Grid item>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <FormControl variant="standard">
                    <Select
                      native
                      inputProps={{
                        "data-cy": "scene.card-collections",
                      }}
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
                  <SplitButton
                    data-cy="scene.add-card"
                    instant
                    color="secondary"
                    options={[
                      {
                        label: t("play-route.add-index-card").toUpperCase(),
                        endIcon: <AddCircleOutlineIcon />,
                        onClick: () => {
                          sceneManager.actions.addIndexCard(type);
                          logger.track("scene.add_index_card");
                        },
                      },
                      ...(selectedIndexCardCollection?.indexCards ?? []).map(
                        (card) => {
                          return {
                            label: previewContentEditable({
                              value: card.titleLabel.toUpperCase(),
                            }),
                            endIcon: <AddCircleOutlineIcon />,
                            onClick: () => {
                              return sceneManager.actions.duplicateIndexCard(
                                card,
                                type
                              );
                            },
                          };
                        }
                      ),
                    ]}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
          <Grid item>
            <Grid container spacing={1} alignItems="center">
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
                  color="secondary"
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
          </Grid>
        </Grid>
      </Box>
    );
  }
}
