import {
  Avatar,
  Box,
  ButtonBase,
  darken,
  Grid,
  IconButton,
  lighten,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import { css, cx } from "emotion";
import React from "react";
import { useLogger } from "../../../../contexts/InjectionsContext/hooks/useLogger";
import { IRollDiceOptions } from "../../../../domains/dice/Dice";
import { Font } from "../../../../domains/font/Font";
import { IPlayer } from "../../../../hooks/useScene/IScene";
import { useTextColors } from "../../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../../hooks/useTranslate/useTranslate";
import { DiceBox } from "../../../DiceBox/DiceBox";

export const PlayerRow: React.FC<{
  player: IPlayer;
  isGM: boolean;
  isMe: boolean;
  offline: boolean;
  onDiceRoll(options: IRollDiceOptions): void;
  onPlayedInTurnOrderChange(playedDuringTurn: boolean): void;
  onFatePointsChange(fatePoints: number): void;
  onPlayerRemove(): void;
  onCharacterDialogOpen(): void;
}> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const logger = useLogger();
  const shouldRenderOfflinePlayerRemoveButton =
    props.isGM && props.player.offline && !props.isMe;
  const shouldHighlight = props.isMe && !props.offline;
  const canControl = props.isGM || props.isMe;
  const textColor = useTextColors(theme.palette.background.default);
  const playedDuringTurnColor = props.player.playedDuringTurn
    ? theme.palette.primary.main
    : textColor.disabled;

  const name = props.player?.playerName || props.player?.character?.name || "";
  const hasCharacterSheet = !!props.player.character;

  const selectedRowStyle = css(
    theme.palette.type === "light"
      ? {
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          backgroundColor: darken(theme.palette.secondary.dark, 0.75),
        }
  );
  const playerInfoCellStyle = css({
    padding: "0.7rem",
    borderBottom: "none",
  });
  const controlsRowStyle = css({
    padding: "0 0.7rem",
  });
  const defaultTableCellStyle = css({ border: "none" });
  const borderTableCellStyle = css({ padding: "0" });

  const fatePointsStyle = css({
    background:
      props.player.fatePoints === 0
        ? textColor.disabled
        : theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transition: theme.transitions.create("background"),
    width: "2rem",
    height: "2rem",
    margin: "0 auto",
  });

  function roll(options: IRollDiceOptions) {
    props.onDiceRoll(options);
    logger.info("ScenePlayer:onDiceRoll");
  }

  return (
    <>
      <TableRow
        selected={false}
        className={cx({
          [selectedRowStyle]: shouldHighlight,
        })}
      >
        <TableCell className={playerInfoCellStyle} align="left">
          <Tooltip
            title={
              hasCharacterSheet
                ? t("player-row.open-character-sheet")
                : t("player-row.has-no-character-sheet")
            }
          >
            <span>
              <ButtonBase
                disabled={!hasCharacterSheet}
                onClick={(e) => {
                  props.onCharacterDialogOpen();
                  logger.info("ScenePlayer:onCharacterDialogOpen");
                }}
              >
                <Typography
                  noWrap
                  color="inherit"
                  className={css({
                    fontSize: "1.2rem",
                    lineHeight: Font.lineHeight(1.2),
                    fontWeight: props.isMe ? "bold" : "normal",
                  })}
                >
                  {name}
                </Typography>
              </ButtonBase>
            </span>
          </Tooltip>
        </TableCell>
        <TableCell className={playerInfoCellStyle} align="center">
          <Tooltip
            title={
              props.player.playedDuringTurn
                ? t("player-row.played")
                : t("player-row.not-played")
            }
          >
            <span>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  props.onPlayedInTurnOrderChange(
                    !props.player.playedDuringTurn
                  );
                  logger.info("ScenePlayer:onPlayedInTurnOrderChange", {
                    playedDuringTurn: !props.player.playedDuringTurn,
                  });
                }}
                disabled={!canControl}
                size="small"
              >
                {props.player.playedDuringTurn ? (
                  <DirectionsRunIcon htmlColor={playedDuringTurnColor} />
                ) : (
                  <EmojiPeopleIcon htmlColor={playedDuringTurnColor} />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </TableCell>
        <TableCell className={cx(playerInfoCellStyle)} align="center">
          <Tooltip title={t("player-row.fate-points")}>
            <span>
              <ButtonBase
                className={css({
                  borderRadius: "50%",
                })}
                disabled={!canControl}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onFatePointsChange(props.player.fatePoints - 1);
                  logger.info("ScenePlayer:onConsumeFatePoints");
                }}
              >
                <Avatar className={fatePointsStyle}>
                  {props.player.fatePoints}
                </Avatar>
              </ButtonBase>
            </span>
          </Tooltip>
        </TableCell>
        <TableCell className={cx(playerInfoCellStyle)} align="right">
          <Box display="flex" justifyContent="flex-end">
            <DiceBox
              rolls={props.player.rolls}
              size="2rem"
              fontSize="1.2rem"
              borderSize=".15rem"
              disabled={!canControl}
              onClick={() => {
                roll({});
              }}
            />
          </Box>
        </TableCell>
      </TableRow>
      {renderGMControls()}
      {renderBorder()}
    </>
  );

  function renderGMControls() {
    if (!props.isGM) {
      return null;
    }

    return (
      <TableRow
        selected={false}
        className={cx(controlsRowStyle, {
          [selectedRowStyle]: shouldHighlight,
        })}
      >
        <TableCell colSpan={4} className={defaultTableCellStyle}>
          <Grid container alignItems="center" justify="flex-end" spacing={1}>
            <Grid item>
              <Tooltip title={t("player-row.remove-fate-point")}>
                <span>
                  <IconButton
                    size="small"
                    disabled={props.player.fatePoints === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      const fatePointsMinusOne = props.player.fatePoints - 1;
                      const newValue =
                        fatePointsMinusOne < 0 ? 0 : fatePointsMinusOne;
                      props.onFatePointsChange(newValue);
                      logger.info("ScenePlayer:onGMConsumeFatePoint");
                    }}
                  >
                    <RemoveCircleOutlineOutlinedIcon
                      className={css({ width: "1rem", height: "1rem" })}
                    />
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>

            <Grid item>
              <Tooltip title={t("player-row.add-fate-point")}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onFatePointsChange(props.player.fatePoints + 1);
                    logger.info("ScenePlayer:onGMRefreshFatePoint");
                  }}
                >
                  <AddCircleOutlineOutlinedIcon
                    className={css({ width: "1rem", height: "1rem" })}
                  />
                </IconButton>
              </Tooltip>
            </Grid>
            {shouldRenderOfflinePlayerRemoveButton && (
              <Grid item>
                <Tooltip title={t("player-row.remove-character")}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onPlayerRemove();
                      logger.info("ScenePlayer:onPlayerRemove");
                    }}
                  >
                    <HighlightOffIcon
                      color="error"
                      className={css({ width: "1rem", height: "1rem" })}
                    />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
          </Grid>
        </TableCell>
      </TableRow>
    );
  }

  function renderBorder() {
    return (
      <TableRow>
        <TableCell colSpan={4} className={borderTableCellStyle} />
      </TableRow>
    );
  }
};
PlayerRow.displayName = "PlayerRow";
