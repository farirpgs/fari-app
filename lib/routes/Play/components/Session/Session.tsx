import ChatIcon from "@mui/icons-material/Chat";
import CircleIcon from "@mui/icons-material/Circle";
import ErrorIcon from "@mui/icons-material/Error";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PanToolIcon from "@mui/icons-material/PanTool";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import { darken, useTheme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Page } from "../../../../components/Page/Page";
import { PlayerRow } from "../../../../components/Scene/components/PlayerRow/PlayerRow";
import { Scene } from "../../../../components/Scene/Scene";
import { TabbedScreen } from "../../../../components/Scene/TabbedScreen";
import { Toolbox } from "../../../../components/Toolbox/Toolbox";
import { WindowPortal } from "../../../../components/WindowPortal/WindowPortal";
import { CharactersContext } from "../../../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../../../contexts/MyBinderContext/MyBinderContext";
import { arraySort } from "../../../../domains/array/arraySort";
import { CharacterSelector } from "../../../../domains/character/CharacterSelector";
import { ICharacter } from "../../../../domains/character/types";
import { IDicePoolResult } from "../../../../domains/dice/Dice";
import { Font } from "../../../../domains/font/Font";
import { Icons } from "../../../../domains/Icons/Icons";
import { usePrompt } from "../../../../hooks/useBlocker/useBlocker";
import { useBlockReload } from "../../../../hooks/useBlockReload/useBlockReload";
import { useEvent } from "../../../../hooks/useEvent/useEvent";
import { useLightBackground } from "../../../../hooks/useLightBackground/useLightBackground";
import { IPlayer } from "../../../../hooks/useScene/IScene";
import { useScene } from "../../../../hooks/useScene/useScene";
import { useTranslate } from "../../../../hooks/useTranslate/useTranslate";
import { CharacterV3Dialog } from "../../../Character/components/CharacterDialog/CharacterV3Dialog";
import {
  MiniThemeContext,
  useMiniTheme,
} from "../../../Character/components/CharacterDialog/MiniThemeContext";
import {
  TlDrawErrorBoundary,
  TldrawReader,
  TldrawWriter,
} from "../../../Draw/TldrawWriterAndReader";
import {
  IPlayerInteraction,
  PlayerInteractionFactory,
} from "../../types/IPlayerInteraction";
import { Chat } from "../Chat/Chat";
import {
  IMessage,
  IMessageToSend,
  MessageType,
  RollMessage,
  RollMessageValue,
  useChat,
} from "../Chat/useChat";
import { DiceRollerMessage } from "../DiceRollMessage/DiceRollMessage";
import { useSession, useSessionCharacterSheets } from "./useSession";

export function Session(props: {
  sessionManager: ReturnType<typeof useSession>;
  sessionCharactersManager: ReturnType<typeof useSessionCharacterSheets>;
  sceneManager: ReturnType<typeof useScene>;
  chatManager: ReturnType<typeof useChat>;
  userId: string;
  isLoading?: boolean;
  error?: any;
  shareLink?: string;
  idFromParams?: string;
  onPlayerInteraction?(interaction: IPlayerInteraction): void;
  onOpenChat?(): void;
}) {
  const {
    sessionManager,
    sceneManager,
    sessionCharactersManager,
    chatManager,
  } = props;

  const charactersManager = useContext(CharactersContext);
  const myBinderManager = useContext(MyBinderContext);
  const [characterIdCard, setCharacterIdCard] = useState<string>("");
  const isGM = !props.idFromParams;
  const lightBackground = useLightBackground();

  useBlockReload(sceneManager.state.dirty);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("lg"));

  const miniTheme = useMiniTheme({
    enforceBackground: theme.palette.background.default,
  });

  const { t } = useTranslate();
  usePrompt(t("manager.leave-without-saving"), true);
  const logger = useLogger();

  const [streamerModalOpen, setStreamerModalOpen] = useState(false);
  const [shareLinkToolTip, setShareLinkToolTip] = useState({ open: false });
  const [rollMessage, setRollMessage] = useState<RollMessageValue>();
  const [rollSnackVisible, setRollSnackVisible] = useState(false);
  const rollSnackTimeoutRef = useRef<any>();
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
    .filter((player) => {
      const hasPlayer = !!player.id;
      const isVisible = isGM || !player.private;
      return isVisible && hasPlayer;
    })
    .sort((a, b) => {
      return a.id === props.userId ? -1 : b.id === props.userId ? 1 : 0;
    });

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

  const handleSetMyRoll = (result: IDicePoolResult) => {
    const rollMessage = RollMessage.fromDicePoolResult(result);
    const message: IMessage = {
      type: MessageType.Roll,
      fromUserId: userId,
      value: rollMessage,
    };
    handleRollMessageSnackOpen(rollMessage);
    if (isGM) {
      chatManager.actions.sendMessage(message);
    } else {
      props.onPlayerInteraction?.(
        PlayerInteractionFactory.sendMessage(message)
      );
    }
  };

  const handleSetPlayerRoll = (
    playerId: string | undefined,
    result: IDicePoolResult
  ) => {
    const rollMessage = RollMessage.fromDicePoolResult(result);
    const message: IMessage = {
      type: MessageType.Roll,
      fromUserId: playerId || userId,
      value: rollMessage,
    };
    handleRollMessageSnackOpen(rollMessage);
    if (isGM) {
      chatManager.actions.sendMessage(message);
    } else {
      props.onPlayerInteraction?.(
        PlayerInteractionFactory.sendMessage(message)
      );
    }
  };

  const handleMessageSubmission = useEvent((messageToSend: IMessageToSend) => {
    const message = {
      type: messageToSend.type,
      value: messageToSend.value,
      fromUserId: userId,
    } as IMessage;

    if (isGM) {
      chatManager.actions.sendMessage(message);
    } else {
      props.onPlayerInteraction?.(
        PlayerInteractionFactory.sendMessage(message)
      );
    }
  });

  const handleReadAllMessages = useEvent(() => {
    chatManager.actions.readAll();
  });

  const handleRollMessageSnackOpen = useEvent((message: RollMessageValue) => {
    clearTimeout(rollSnackTimeoutRef.current);
    setRollMessage(message);
    setRollSnackVisible(true);
    rollSnackTimeoutRef.current = setTimeout(() => {
      setRollSnackVisible(false);
    }, 5000);
  });

  const handleRollMessageSnackClose = useEvent(
    (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      setRollSnackVisible(false);
    }
  );

  return (
    <Page isLive gameId={props.idFromParams} maxWidth="none" hideFooter sx={{}}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={rollSnackVisible}
        onClose={handleRollMessageSnackClose}
        sx={{
          "& .MuiPaper-root": {
            width: "100%",
            display: "block",
          },
        }}
        message={
          <>
            <DiceRollerMessage dark message={rollMessage} />
          </>
        }
      />
      <Box
        sx={{
          padding: "2rem",
          top: "0",
          bottom: "10rem",
          position: "absolute",
          width: "100%",
          overflow: "auto",
          height: {
            xs: "calc(100vh - 12rem)",
            sm: "calc(100vh - 12rem)",
            md: "calc(100vh - 12em)",
            lg: "calc(100vh - 10em)",
          },
        }}
      >
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
          diceFabProps={{
            onRoll(results) {
              const modifierTotal: number = results.reduce((acc, result) => {
                return acc + (result.modifier || 0);
              }, 0);

              const singleResult: IDicePoolResult = {
                id: "Pool",
                modifier: modifierTotal,
                label: results.map((r) => r.label).join(", "),
                commandResults: [],
              };

              results.forEach((result) => {
                singleResult.commandResults = [
                  ...singleResult.commandResults,
                  ...result.commandResults,
                ];
              });
              handleSetMyRoll(singleResult);
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
                        sx={{ width: "2rem", height: "2rem" }}
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
                      sx={{ width: "1.8rem", height: "1.8rem" }}
                      htmlColor={theme.palette.text.primary}
                    />
                  </IconButton>
                </Tooltip>
              </Grid>
              {props.onOpenChat && (
                <Grid item>
                  <Tooltip title={t("play-route.chat")}>
                    <IconButton
                      onClick={props.onOpenChat}
                      color="primary"
                      size="large"
                    >
                      <ChatIcon
                        sx={{ width: "1.8rem", height: "1.8rem" }}
                        htmlColor={theme.palette.text.primary}
                      />
                    </IconButton>
                  </Tooltip>
                </Grid>
              )}

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
                        sx={{ width: "2rem", height: "2rem" }}
                        htmlColor={darken(theme.palette.error.main, 0.2)}
                      />
                    </IconButton>
                  </Tooltip>
                </Grid>
              )}
            </>
          }
        />
        {props.error ? renderPageError() : renderPage()}
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
        <Grid
          container
          spacing={2}
          wrap={isSmall ? "wrap" : "nowrap"}
          sx={{
            height: "100%",
          }}
        >
          <Grid
            item
            sx={{
              width: isSmall ? "100%" : "25rem",
              flex: "0 0 auto",
            }}
          >
            {renderSidePanel()}
          </Grid>
          <Grid
            item
            xs
            sx={{
              width: isSmall ? "100%" : undefined,
              flex: "1 0 auto",
            }}
          >
            {renderSessionTabs()}
          </Grid>
        </Grid>
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
                sx={{
                  width: "3rem",
                  height: "3rem",
                }}
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
      <>
        <TabbedScreen
          tabs={[
            {
              label: t("play-route.side-panel.tabs.players"),
              dataCy: "players-tab",
              value: "players",
              sx: { padding: "0", overflow: "auto" },
              render: renderPlayers,
            },
            {
              label: `${t("play-route.side-panel.tabs.chat")} (${
                chatManager.state.unreadCount
              })`,
              dataCy: "chat-tab",
              value: "chat",
              sx: { padding: "0", overflow: "auto", height: "100%" },
              render: renderChat,
            },
          ]}
        />
      </>
    );
  }

  function renderChat() {
    const playersNameMapping = everyone.reduce((acc, player) => {
      acc[player.id] = player.playerName;
      return acc;
    }, {} as Record<string, string | undefined>);

    return (
      <Chat
        userId={userId}
        chatManager={chatManager}
        playersNameMapping={playersNameMapping}
        onMessageSubmit={handleMessageSubmission}
        onReadAllMessages={handleReadAllMessages}
      />
    );
  }
  function renderPlayers() {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box
            sx={{
              minHeight: "4rem",
              padding: ".5rem",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid
                item
                sx={{
                  flex: "1 0 auto",
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    fontSize: ".8rem",
                    lineHeight: Font.lineHeight(0.8),
                    fontWeight: "bold",
                  }}
                >
                  {t("play-route.players")}
                </Typography>
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      fontSize: "1.2rem",
                      lineHeight: Font.lineHeight(1.2),
                    }}
                  >
                    {Object.keys(sessionManager.state.session.players).length +
                      1}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: ".8rem",
                      lineHeight: Font.lineHeight(0.8),
                    }}
                  >
                    {" "}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: ".8rem",
                      lineHeight: Font.lineHeight(0.8),
                    }}
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
                          data-cy="scene.add-player"
                          onClick={() => {
                            handleGMAddNpc();
                            logger.track("session.add_npc");
                          }}
                          color="inherit"
                          size="small"
                          variant="outlined"
                          endIcon={<PersonAddIcon />}
                        >
                          {t("play-route.gm-add-gm-character")}
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Box>
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
            {renderSessionControls()}
          </Box>
        </Box>
      </>
    );
  }

  function renderSessionControls() {
    if (!isGM) {
      return null;
    }
    return (
      <>
        <Box sx={{ padding: "1rem 0" }}>
          <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
          >
            {props.shareLink && (
              <>
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
                    <span>
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

                            logger.track("session.copy_session_link");
                          }
                        }}
                        size="small"
                        variant="outlined"
                        color={shareLinkToolTip.open ? "secondary" : "inherit"}
                      >
                        <FileCopyIcon />
                        {t("play-route.copy-game-link")}
                      </Button>
                    </span>
                  </Tooltip>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </>
    );
  }

  function getCharacterSheet(playerId: string) {
    const playerCharacter =
      sessionCharactersManager.state.characterSheets[playerId];
    return playerCharacter;
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

    const mainPointerBlock =
      CharacterSelector.getCharacterMainPointerBlock(characterSheet);
    const points = mainPointerBlock?.value ?? player.points;
    const maxPoints = mainPointerBlock?.meta.max ?? undefined;

    return (
      <PlayerRow
        dataCy={`scene.player-row.${playerRowDataCyIndex}`}
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
        hasCharacterSheet={!!characterSheet}
        isPrivate={player.private}
        status={player.status}
        playerName={player.playerName}
        characterName={characterSheet?.name}
        points={points}
        maxPoints={maxPoints}
        pointsLabel={mainPointerBlock?.label}
        onPlayerRemove={() => {
          sessionManager.actions.removePlayer(player.id);
          sessionCharactersManager.actions.removeCharacterSheet(player.id);
        }}
        onTogglePrivate={() => {
          sessionManager.actions.togglePlayerVisibility(player.id);
        }}
        onAssignCharacterSheet={() => {
          myBinderManager.actions.open({
            folder: "characters",
            callback: (character) => {
              handleAssignOriginalCharacterSheet(player.id, character);
            },
          });
        }}
        onStatusChange={(newStatus) => {
          if (isGM) {
            sessionManager.actions.updatePlayerStatus(player.id, newStatus);
          } else {
            props.onPlayerInteraction?.(
              PlayerInteractionFactory.updatePlayerStatus(player.id, newStatus)
            );
          }
        }}
      >
        {playerRowChildren}
      </PlayerRow>
    );
  }

  function renderCharacters() {
    const hasCharacters = playersWithCharacterSheets.length > 0;
    const currentCardId =
      characterIdCard || playersWithCharacterSheets[0]?.characterSheet.id || "";
    return (
      <>
        <Box>
          {showEmptyWarnings()}
          {hasCharacters && (
            <>
              <Box
                sx={{
                  height: "100%",
                }}
              >
                <Box>
                  <Tabs
                    orientation="horizontal"
                    variant="scrollable"
                    textColor="secondary"
                    indicatorColor="secondary"
                    value={currentCardId}
                    onChange={(event, value) => {
                      setCharacterIdCard(value);
                    }}
                    sx={{
                      borderRight: 1,
                      borderColor: "divider",
                      background: lightBackground,
                    }}
                  >
                    {playersWithCharacterSheets.map((player) => {
                      return (
                        <Tab
                          key={player.id}
                          sx={{}}
                          label={
                            <>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "100%",

                                  textTransform: "none",
                                }}
                              >
                                <Grid container spacing={1} alignItems="center">
                                  <Grid item>
                                    <CircleIcon
                                      sx={{
                                        marginRight: ".25rem",
                                      }}
                                      htmlColor={player.color}
                                    />
                                  </Grid>
                                  <Grid item>
                                    <Box
                                      sx={{
                                        display: "flex",
                                      }}
                                    >
                                      <Typography variant="body1">
                                        {player.playerName}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                      }}
                                    >
                                      <Typography variant="body2">
                                        {player.characterSheet.name}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Box>
                            </>
                          }
                          value={player.characterSheet.id}
                        />
                      );
                    })}
                  </Tabs>
                </Box>
              </Box>

              <Box>
                <TabContext value={currentCardId}>
                  <TabPanel value="" />
                  <MiniThemeContext.Provider value={miniTheme}>
                    {playersWithCharacterSheets.map((player) => {
                      const isMe = props.userId === player.id;
                      const canControl = isGM || isMe;
                      const isCharacterInStorage =
                        charactersManager.selectors.isInStorage(
                          player.characterSheet?.id
                        );
                      return (
                        <TabPanel
                          sx={{
                            padding: "0",
                          }}
                          key={`${player.id}_${player.characterSheet.id}`}
                          value={player.characterSheet.id}
                        >
                          <Box
                            sx={{
                              width: "100%",
                            }}
                          >
                            <CharacterV3Dialog
                              readonly={!canControl}
                              open={true}
                              autosave
                              preview={true}
                              character={player.characterSheet}
                              dialog={false}
                              onSave={(updatedCharacter) => {
                                handleUpdateCharacter(
                                  player.id,
                                  updatedCharacter
                                );
                              }}
                              synced={isCharacterInStorage}
                              onToggleSync={() => {
                                handleOnToggleCharacterSync(
                                  player.characterSheet
                                );
                              }}
                              onRoll={(newDiceRollResult) => {
                                handleSetPlayerRoll(
                                  player.id,
                                  newDiceRollResult
                                );
                              }}
                            />
                            {/* <CharacterCard
                                      readonly={!canControl}
                                      characterSheet={player.characterSheet}
                                      onCharacterDialogOpen={() => {
                                        setCharacterDialogPlayerId(player.id);
                                      }}
                                      onChange={(updatedCharacter) => {
                                        handleUpdateCharacter(
                                          player.id,
                                          updatedCharacter
                                        );
                                      }}
                                      onRoll={(newDiceRollResult) => {
                                        handleSetPlayerRoll(
                                          player.id,
                                          newDiceRollResult
                                        );
                                      }}
                                    /> */}
                          </Box>
                        </TabPanel>
                      );
                    })}
                  </MiniThemeContext.Provider>
                </TabContext>
              </Box>
            </>
          )}
        </Box>
      </>
    );
  }

  function renderDrawArea() {
    return (
      <TlDrawErrorBoundary>
        <Box
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            margin: "0 auto",
            height: "100%",
            minHeight: {
              xs: "60vh",
              sm: "60vh",
              md: "60vh",
            },
            position: "relative",
            overflow: "hidden",
          }}
        >
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
        <Box sx={{ padding: "1rem" }}>
          <Typography variant="h6" color="textSecondary">
            {t("play-route.characters-tab.no-players-warning.title")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t("play-route.characters-tab.no-players-warning.description")}
          </Typography>
        </Box>
      );
    }

    if (showNoSheetsWarning) {
      return (
        <Box sx={{ padding: "1rem" }}>
          <Typography variant="h6" color="textSecondary">
            {t("play-route.characters-tab.no-sheets-warning.title")}
          </Typography>
        </Box>
      );
    }

    return null;
  }

  function renderSessionTabs() {
    return (
      <TabbedScreen
        tabs={[
          {
            value: "characters",
            dataCy: "session.tabs.scene",
            label: `${t("menu.characters")} (${
              playersWithCharacterSheets.length
            })`,
            sx: { padding: "0" },
            render: renderCharacters,
          },
          {
            value: "scene",
            dataCy: "session.tabs.characters",
            label: t("menu.scenes"),
            sx: { padding: "0" },
            render: renderScene,
          },
          {
            value: "draw",
            dataCy: "session.tabs.draw",
            label: t("draw-route.meta.title"),
            sx: { padding: "0", height: "100%" },
            render: renderDrawArea,
          },
        ]}
      />
    );
  }

  function renderScene() {
    return (
      <Box
        sx={{
          padding: "1rem",
        }}
      >
        <Scene
          sceneManager={sceneManager}
          isGM={isGM}
          canLoad={isGM}
          onRoll={handleSetMyRoll}
          onOpenChat={props.onOpenChat}
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
}
Session.displayName = "Session";
