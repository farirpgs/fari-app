import { css } from "@emotion/css";
import CreateIcon from "@mui/icons-material/Create";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import FaceIcon from "@mui/icons-material/Face";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RestorePageIcon from "@mui/icons-material/RestorePage";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { FontFamily } from "../../../../constants/FontFamily";
import { useLogger } from "../../../../contexts/InjectionsContext/hooks/useLogger";
import { CharacterSelector } from "../../../../domains/character/CharacterSelector";
import { IDataCyProps } from "../../../../domains/cypress/types/IDataCyProps";
import { Font } from "../../../../domains/font/Font";
import { useLightBackground } from "../../../../hooks/useLightBackground/useLightBackground";
import { IPlayer } from "../../../../hooks/useScene/IScene";
import { useTranslate } from "../../../../hooks/useTranslate/useTranslate";
import { usePointCounter } from "../../../../routes/Character/components/CharacterDialog/components/blocks/BlockPointCounter";
import { CircleTextField } from "../../../../routes/Character/components/CharacterDialog/components/CircleTextField";
import {
  MiniThemeContext,
  useMiniTheme,
} from "../../../../routes/Character/components/CharacterDialog/MiniThemeContext";
import { previewContentEditable } from "../../../ContentEditable/ContentEditable";
import {
  DiceBonusLabel,
  DiceBox,
  DiceBoxResult,
} from "../../../DiceBox/DiceBox";
import { FateLabel } from "../../../FateLabel/FateLabel";

export function PlayerRow(
  props: {
    permissions: {
      canRoll: boolean;
      canUpdatePoints: boolean;
      canUpdateInitiative: boolean;
      canLoadCharacterSheet: boolean;
      canLoadDuplicateCharacterSheet: boolean;
      canRemove: boolean;
      canMarkPrivate: boolean;
    };
    player: IPlayer;
    isMe: boolean;
    children?: JSX.Element;
    onDiceRoll(): void;
    onPlayedInTurnOrderChange(playedDuringTurn: boolean): void;
    onPointsChange(newPoints: string, newMaxPoints: string | undefined): void;

    onTogglePrivate(): void;
    onPlayerRemove(): void;
    onCharacterSheetOpen(): void;
    onAssignOriginalCharacterSheet(): void;
    onAssignDuplicateCharacterSheet(): void;
  } & IDataCyProps
) {
  const theme = useTheme();
  const { t } = useTranslate();
  const logger = useLogger();
  const [hover, setHover] = useState(false);
  const mainPointerBlock = CharacterSelector.getCharacterMainPointerBlock(
    props.player.character
  );
  const pointFromProps = mainPointerBlock?.value ?? props.player.points;
  const maxPointsFromProps = mainPointerBlock?.meta.max ?? undefined;

  const pointsManager = usePointCounter({
    points: pointFromProps,
    maxPoints: maxPointsFromProps,
    onPointsChange(newPoints) {
      props.onPointsChange(newPoints, pointsManager.state.maxPoints);
    },
    onMaxPointsChange(newMaxPoints) {
      props.onPointsChange(pointsManager.state.points, newMaxPoints);
    },
  });

  const miniTheme = useMiniTheme({
    enforceBackground: theme.palette.background.paper,
  });

  const lightBackground = useLightBackground();
  const playedDuringTurnColor = props.player.playedDuringTurn
    ? theme.palette.primary.main
    : theme.palette.text.secondary;

  const hasCharacterSheet = !!props.player.character;
  const [loadCharacterDialogOpen, setLoadCharacterDialogOpen] = useState(false);

  const borderColor = hasCharacterSheet
    ? theme.palette.primary.main
    : theme.palette.text.secondary;

  function handleOnLoadCharacterSheet() {
    if (props.permissions.canLoadDuplicateCharacterSheet) {
      setLoadCharacterDialogOpen(true);
    } else {
      props.onAssignOriginalCharacterSheet();
    }
  }

  function handleOnRoll() {
    props.onDiceRoll();
    logger.track("session.player_reroll_dice");
  }

  return (
    <>
      {renderLoadCharacerSheetDialog()}
      <MiniThemeContext.Provider value={miniTheme}>
        <Box
          bgcolor={
            props.isMe ? lightBackground : theme.palette.background.paper
          }
          m=".5rem"
          data-cy={props["data-cy"]}
          onClick={() => {
            setHover(true);
          }}
          onPointerEnter={() => {
            setHover(true);
          }}
          onPointerLeave={() => {
            setHover(false);
          }}
        >
          <Box
            py=".5rem"
            px="1rem"
            className={css({
              border: `2px solid ${borderColor}`,
              borderRadius: "8px",
            })}
          >
            <Box>{renderName()}</Box>

            <Box mb=".5rem">
              <Box pb=".5rem">{renderDice()}</Box>
              <Box pb=".5rem">{renderPointCounter()}</Box>
              <Box pb={props.children ? ".5rem" : undefined}>
                {renderControls()}
              </Box>
              {props.children}
            </Box>
          </Box>
        </Box>
      </MiniThemeContext.Provider>
    </>
  );

  function renderDice() {
    return (
      <Box>
        <Grid container spacing={1} wrap="nowrap" alignItems="flex-start">
          <Grid item>
            <Box display="flex" justifyContent="flex-end" height="100%">
              <DiceBox
                rolls={props.player.rolls}
                size="3rem"
                fontSize="1.5rem"
                borderSize=".15rem"
                disableConfettis={props.isMe}
                disabled={!props.permissions.canRoll}
                onClick={() => {
                  handleOnRoll();
                }}
              />
            </Box>
          </Grid>
          {props.player.rolls.length > 0 && (
            <Grid item>
              <Box
                className={css({
                  fontWeight: theme.typography.fontWeightBold,
                  borderRadius: "4px",
                  padding: ".3rem .5rem",
                })}
              >
                <Grid container alignItems="center">
                  <Grid item xs={12}>
                    <Box
                      className={css({
                        display: "flex",
                        fontSize: ".75rem",
                        textTransform: "uppercase",
                        fontWeight: theme.typography.fontWeightBold,
                      })}
                    >
                      <DiceBonusLabel rolls={props.player.rolls} noColor />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <DiceBoxResult rolls={props.player.rolls} noColor />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    );
  }

  function renderControls() {
    return (
      <Grid
        item
        xs
        container
        spacing={1}
        justifyContent="space-between"
        wrap="nowrap"
      >
        <Grid
          item
          xs={6}
          container
          alignItems="center"
          justifyContent="flex-start"
          spacing={1}
        >
          <Grid item>{renderInitiative()}</Grid>
          <Grid item>{renderPlayerId()}</Grid>
        </Grid>
        <Grid
          item
          xs={6}
          container
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
        >
          {props.permissions.canLoadCharacterSheet && (
            <Grid item>{renderSwapCharacterSheetButton()}</Grid>
          )}

          {props.permissions.canRemove && (
            <Grid item>{renderDeleteButton()}</Grid>
          )}
          {props.permissions.canRemove && (
            <Grid item>{renderMarkPrivateButton()}</Grid>
          )}
        </Grid>
      </Grid>
    );
  }

  function renderSwapCharacterSheetButton() {
    return (
      <Fade in={hover && hasCharacterSheet}>
        <Tooltip title={t("player-row.swap-character-sheet")}>
          <span>
            <IconButton
              className={css({ padding: "0" })}
              color={hasCharacterSheet ? "default" : "primary"}
              data-cy={`${props["data-cy"]}.swap-character-sheet`}
              onClick={() => {
                handleOnLoadCharacterSheet();
              }}
              size="large"
            >
              <RestorePageIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Fade>
    );
  }
  function renderDeleteButton() {
    return (
      <Fade in={hover}>
        <Tooltip title={t("player-row.remove-player")}>
          <span>
            <IconButton
              data-cy={`${props["data-cy"]}.remove`}
              className={css({ padding: "0" })}
              onClick={(e) => {
                e.stopPropagation();
                const confirmed = confirm(
                  t("player-row.remove-player-confirmation")
                );
                if (confirmed) {
                  props.onPlayerRemove();
                  logger.track("session.remove_player");
                }
              }}
              size="large"
            >
              <HighlightOffIcon color="error" />
            </IconButton>
          </span>
        </Tooltip>
      </Fade>
    );
  }
  function renderMarkPrivateButton() {
    return (
      <Fade in={hover}>
        <Tooltip
          title={
            props.player.private
              ? t("player-row.show-to-players")
              : t("player-row.hide-from-players")
          }
        >
          <span>
            <IconButton
              data-cy={`${props["data-cy"]}.mark-private`}
              className={css({ padding: "0" })}
              onClick={(e) => {
                e.stopPropagation();

                props.onTogglePrivate();
              }}
              size="large"
            >
              {props.player.private ? (
                <VisibilityIcon />
              ) : (
                <VisibilityOffIcon />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </Fade>
    );
  }

  function renderInitiative() {
    return (
      <Tooltip
        title={
          props.player.playedDuringTurn
            ? t("player-row.played")
            : t("player-row.not-played")
        }
      >
        <span>
          <IconButton
            data-cy={`${props["data-cy"]}.toggle-initiative`}
            onClick={(e) => {
              e.stopPropagation();
              props.onPlayedInTurnOrderChange(!props.player.playedDuringTurn);
              logger.track("session.change_player_initiative");
            }}
            disabled={!props.permissions.canUpdateInitiative}
            className={css({ padding: "0" })}
            size="large"
          >
            {props.player.playedDuringTurn ? (
              <DirectionsRunIcon htmlColor={playedDuringTurnColor} />
            ) : (
              <EmojiPeopleIcon htmlColor={playedDuringTurnColor} />
            )}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  function renderPointCounter() {
    return (
      <Grid
        container
        justifyContent="flex-start"
        alignItems="center"
        wrap="nowrap"
      >
        <Grid item>
          <Box ml="-.5rem">
            <CircleTextField
              data-cy={`${props["data-cy"]}.counter`}
              value={pointsManager.state.points}
              readonly={!props.permissions.canUpdatePoints}
              highlight
              onChange={(newValue) => {
                pointsManager.actions.setPoints(newValue);
              }}
              onIncrement={() => {
                pointsManager.actions.increment();
              }}
              onDecrement={() => {
                pointsManager.actions.decrement();
              }}
            />
          </Box>
        </Grid>
        {pointsManager.state.maxPoints !== undefined && (
          <>
            <Grid item>
              <Typography
                className={css({
                  fontSize: "2rem",
                  color: "#bdbdbd",
                  lineHeight: Font.lineHeight(2),
                })}
              >
                {"/"}
              </Typography>
            </Grid>
            <Grid item>
              <CircleTextField
                data-cy={`${props["data-cy"]}.counter.max`}
                value={pointsManager.state.maxPoints ?? ""}
                readonly={!props.permissions.canUpdatePoints}
                highlight
                onChange={(newMax) => {
                  pointsManager.actions.setMaxPoints(newMax);
                }}
                onIncrement={() => {
                  pointsManager.actions.incrementMax();
                }}
                onDecrement={() => {
                  pointsManager.actions.decrementMax();
                }}
              />
            </Grid>
          </>
        )}
        {mainPointerBlock?.label && (
          <Grid
            item
            className={css({
              alignSelf: "flex-end",
              marginBottom: ".2rem",
            })}
          >
            <FateLabel
              uppercase={true}
              noWrap
              className={css({
                color: theme.palette.primary.main,
                fontSize: ".8rem",
                fontWeight: theme.typography.fontWeightBold,
                marginLeft: ".5rem",
              })}
            >
              {previewContentEditable({ value: mainPointerBlock?.label })}
            </FateLabel>
          </Grid>
        )}
      </Grid>
    );
  }

  function renderMainName(name: string | undefined) {
    return (
      <FateLabel
        title={name}
        noWrap
        uppercase={false}
        className={css({
          color: theme.palette.primary.main,
        })}
      >
        {name ?? "..."}
      </FateLabel>
    );
  }

  function renderSecondaryName(name: string | undefined) {
    return (
      <FateLabel
        noWrap
        title={name}
        uppercase={false}
        className={css({
          fontSize: ".85rem",
          fontWeight: theme.typography.fontWeightRegular,
          color: theme.palette.text.secondary,
        })}
      >
        {name}
      </FateLabel>
    );
  }

  function renderName() {
    const canOpenOrLoadSheet =
      hasCharacterSheet || props.permissions.canLoadCharacterSheet;

    return (
      <>
        <Box>
          <Grid container wrap="nowrap">
            <Grid item zeroMinWidth xs>
              <Box mb=".5rem">
                <Grid
                  container
                  alignItems="center"
                  className={css({ height: "100%" })}
                >
                  {hasCharacterSheet ? (
                    <>
                      <Grid item xs={12} zeroMinWidth>
                        {renderMainName(props.player.character?.name)}
                      </Grid>
                      <Grid item xs={12} zeroMinWidth>
                        {renderSecondaryName(props.player.playerName)}
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12} zeroMinWidth>
                        {renderMainName(props.player.playerName)}
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            </Grid>

            <Grid item>
              <Tooltip
                title={
                  hasCharacterSheet
                    ? t("player-row.open-character-sheet")
                    : props.permissions.canLoadCharacterSheet
                    ? t("play-route.assign-character-sheet")
                    : ""
                }
              >
                <span>
                  <IconButton
                    size="small"
                    disabled={!canOpenOrLoadSheet}
                    color={"primary"}
                    data-cy={`${props["data-cy"]}.assign-or-open-character-sheet`}
                    className={css({
                      visibility: canOpenOrLoadSheet ? "visible" : "hidden",
                      border: `1px solid ${theme.palette.primary.main}`,
                      borderRadius: "50%",
                      boxShadow: theme.shadows[2],
                    })}
                    onClick={() => {
                      if (hasCharacterSheet) {
                        props.onCharacterSheetOpen();
                      } else {
                        handleOnLoadCharacterSheet();
                      }

                      logger.track("session.open_character_sheet");
                    }}
                  >
                    {hasCharacterSheet ? (
                      <FaceIcon htmlColor={borderColor} />
                    ) : (
                      <CreateIcon htmlColor={borderColor} />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }

  function renderPlayerId() {
    return (
      <Typography
        className={css({
          fontSize: ".8rem",
          fontFamily: FontFamily.Console,
          color: theme.palette.text.secondary,
        })}
        display="inline"
      >
        [{props.player.id.slice(0, 5)}]
      </Typography>
    );
  }

  function renderLoadCharacerSheetDialog() {
    return (
      <Dialog
        open={loadCharacterDialogOpen}
        onClose={() => {
          setLoadCharacterDialogOpen(false);
        }}
      >
        <DialogTitle>
          {t("player-row.load-character-sheet-dialog.title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("player-row.load-character-sheet-dialog.description")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Box mb=".5rem" width="100%">
            <Grid
              container
              wrap="nowrap"
              justifyContent="space-around"
              spacing={2}
            >
              <Grid item>
                <Button
                  color="primary"
                  variant="outlined"
                  endIcon={<GroupAddIcon />}
                  data-cy={`${props["data-cy"]}.character-sheet-dialog.assign-duplicate`}
                  onClick={() => {
                    setLoadCharacterDialogOpen(false);
                    props.onAssignDuplicateCharacterSheet();
                    logger.track("session.load_and_duplicate_character");
                  }}
                >
                  {t(
                    "player-row.load-character-sheet-dialog.load-and-duplicate"
                  )}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  autoFocus
                  color="primary"
                  variant="outlined"
                  endIcon={<PersonAddIcon />}
                  data-cy={`${props["data-cy"]}.character-sheet-dialog.assign-original`}
                  onClick={() => {
                    setLoadCharacterDialogOpen(false);
                    props.onAssignOriginalCharacterSheet();
                    logger.track("session.load_character");
                  }}
                >
                  {t("player-row.load-character-sheet-dialog.load")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogActions>
      </Dialog>
    );
  }
}
PlayerRow.displayName = "PlayerRow";
