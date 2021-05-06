import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import FaceIcon from "@material-ui/icons/Face";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import React, { useState } from "react";
import { useLogger } from "../../../../contexts/InjectionsContext/hooks/useLogger";
import { CharacterSelector } from "../../../../domains/character/CharacterSelector";
import { IDataCyProps } from "../../../../domains/cypress/types/IDataCyProps";
import { Font } from "../../../../domains/font/Font";
import { useLightBackground } from "../../../../hooks/useLightBackground/useLightBackground";
import { IPlayer } from "../../../../hooks/useScene/IScene";
import { useTextColors } from "../../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../../hooks/useTranslate/useTranslate";
import { usePointCounter } from "../../../../routes/Character/components/CharacterDialog/components/blocks/BlockPointCounter";
import { CircleTextField } from "../../../../routes/Character/components/CharacterDialog/components/CircleTextField";
import {
  DiceBonusLabel,
  DiceBox,
  DiceBoxResult,
} from "../../../DiceBox/DiceBox";
import { FateLabel } from "../../../FateLabel/FateLabel";

export const PlayerRow: React.FC<
  {
    permissions: {
      canRoll: boolean;
      canUpdatePoints: boolean;
      canUpdateInitiative: boolean;
      canLoadCharacterSheet: boolean;
      canLoadDuplicateCharacterSheet: boolean;
      canRemove: boolean;
    };
    player: IPlayer;
    isMe: boolean;
    number: number;
    onDiceRoll(): void;
    onPlayedInTurnOrderChange(playedDuringTurn: boolean): void;
    onPointsChange(newPoints: string, newMaxPoints: string | undefined): void;

    onPlayerRemove(): void;
    onCharacterSheetOpen(): void;
    onAssignOriginalCharacterSheet(): void;
    onAssignDuplicateCharacterSheet(): void;
  } & IDataCyProps
> = (props) => {
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

  const textColor = useTextColors(theme.palette.background.default);
  const lightBackground = useLightBackground();
  const playedDuringTurnColor = props.player.playedDuringTurn
    ? theme.palette.primary.main
    : textColor.disabled;

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
    logger.info("ScenePlayer:onDiceRoll");
  }

  return (
    <>
      {renderLoadCharacerSheetDialog()}
      <Box
        bgcolor={props.isMe ? lightBackground : theme.palette.background.paper}
        data-cy={props["data-cy"]}
        onPointerEnter={() => {
          setHover(true);
        }}
        onPointerLeave={() => {
          setHover(false);
        }}
      >
        <Box py=".5rem" px=".5rem">
          <Box>{renderName()}</Box>

          <Box
            className={css({
              borderLeft: `2px solid ${borderColor}`,
              borderRight: `2px solid ${borderColor}`,
              borderBottom: `2px solid ${borderColor}`,
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              marginTop: "-1.5rem",
              marginBottom: ".5rem",
              paddingTop: "2.25rem",
              paddingLeft: "1rem",
              paddingRight: "1rem",
            })}
          >
            <Box pb=".5rem">{renderDice()}</Box>
            <Box pb=".5rem">{renderPointCounter()}</Box>
            <Box pb=".5rem">{renderControls()}</Box>
          </Box>
        </Box>
        <Divider light />
      </Box>
    </>
  );

  function renderDice() {
    return (
      <Box>
        <Grid container spacing={2} wrap="nowrap" alignItems="flex-start">
          <Grid item>
            <Box display="flex" justifyContent="flex-end" height="100%">
              <DiceBox
                disableTooltip={true}
                rolls={props.player.rolls}
                size="2.5rem"
                fontSize="1.25rem"
                borderSize=".15rem"
                disabled={!props.permissions.canRoll}
                onClick={() => {
                  handleOnRoll();
                }}
              />
            </Box>
          </Grid>
          <Grid item container alignItems="center">
            <Grid item xs={12}>
              <Box
                className={css({
                  display: "flex",
                  fontSize: ".75rem",
                  textTransform: "uppercase",
                  color: theme.palette.primary.main,
                  fontWeight: theme.typography.fontWeightBold,
                })}
              >
                <DiceBonusLabel rolls={props.player.rolls} />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <DiceBoxResult rolls={props.player.rolls} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }

  function renderControls() {
    return (
      <Grid item xs container spacing={1} justify="space-between" wrap="nowrap">
        <Grid
          item
          xs={6}
          container
          alignItems="center"
          justify="flex-start"
          spacing={1}
        >
          <Grid item>{renderInitiative()}</Grid>
        </Grid>
        <Grid
          item
          xs={6}
          container
          alignItems="center"
          justify="flex-end"
          spacing={1}
        >
          {props.permissions.canLoadCharacterSheet && (
            <Grid item>{renderSwapCharacterSheetButton()}</Grid>
          )}

          {props.permissions.canRemove && (
            <Grid item>{renderDeleteButton()}</Grid>
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
              data-cy={`${props["data-cy"]}.swap--character-sheet`}
              onClick={() => {
                handleOnLoadCharacterSheet();
              }}
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
                  logger.info("ScenePlayer:onPlayerRemove");
                }
              }}
            >
              <HighlightOffIcon color="error" />
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
              logger.info("ScenePlayer:onPlayedInTurnOrderChange", {
                playedDuringTurn: !props.player.playedDuringTurn,
              });
            }}
            disabled={!props.permissions.canUpdateInitiative}
            className={css({ padding: "0" })}
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
        justify="flex-start"
        alignItems="center"
        spacing={1}
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
          <Grid item>
            <FateLabel uppercase={false} noWrap>
              {mainPointerBlock?.label}
            </FateLabel>
          </Grid>
        )}
      </Grid>
    );
  }

  function renderMainName(name: string | undefined) {
    return (
      <FateLabel title={name} noWrap uppercase={false}>
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
            <Grid item>
              <Box
                className={css({
                  height: "100%",
                  zIndex: 1,
                })}
              >
                <Tooltip
                  title={
                    hasCharacterSheet
                      ? t("player-row.open-character-sheet")
                      : props.permissions.canLoadCharacterSheet
                      ? t("play-route.add-character-sheet")
                      : ""
                  }
                >
                  <span>
                    <IconButton
                      disabled={!canOpenOrLoadSheet}
                      color={hasCharacterSheet ? "primary" : "default"}
                      data-cy={`${props["data-cy"]}.assign-or-open-character-sheet`}
                      className={css({
                        "border": `2px solid ${borderColor}`,
                        "& svg": {
                          transition: theme.transitions.create(["transform"]),
                          transform: "scale(1)",
                        },
                        "&:hover svg": {
                          transform: "scale(1.3)",
                        },
                      })}
                      onClick={() => {
                        if (hasCharacterSheet) {
                          props.onCharacterSheetOpen();
                        } else {
                          handleOnLoadCharacterSheet();
                        }
                        logger.info("ScenePlayer:onCharacterSheetButtonPress");
                      }}
                    >
                      <FaceIcon htmlColor={borderColor} />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Grid>
            <Grid item zeroMinWidth xs>
              <Box
                className={css({
                  borderTop: `2px solid ${borderColor}`,
                  borderRight: `2px solid ${borderColor}`,
                  borderBottom: `1px solid ${theme.palette.text.hint}`,
                  borderTopRightRadius: "8px",
                  marginLeft: "-1.5rem",
                  padding: "0 1rem 0 2rem",
                  height: "100%",
                })}
              >
                <Grid
                  container
                  alignItems="center"
                  className={css({ height: "100%" })}
                >
                  {hasCharacterSheet ? (
                    <>
                      <Grid item xs={12}>
                        {renderMainName(props.player.character?.name)}
                      </Grid>
                      <Grid item xs={12}>
                        {renderSecondaryName(props.player.playerName)}
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12}>
                        {renderMainName(props.player.playerName)}
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </>
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
            <Grid container wrap="nowrap" justify="space-around" spacing={2}>
              <Grid item>
                <Button
                  color="primary"
                  variant="outlined"
                  endIcon={<GroupAddIcon />}
                  data-cy={`${props["data-cy"]}.character-sheet-dialog.assign-duplicate`}
                  onClick={() => {
                    setLoadCharacterDialogOpen(false);
                    props.onAssignDuplicateCharacterSheet();
                    logger.info("PlayerRow:onLoadAndDuplicateCharacterSheet");
                  }}
                >
                  {
                    // prettier-ignore
                    t("player-row.load-character-sheet-dialog.load-and-duplicate")
                  }
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
                    logger.info("PlayerRow:onLoadCharacterSheet");
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
};
PlayerRow.displayName = "PlayerRow";
