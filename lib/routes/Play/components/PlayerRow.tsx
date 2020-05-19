import {
  Avatar,
  Box,
  ButtonBase,
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
import { Font } from "../../../domains/font/Font";
import { useFudgeDice } from "../../../hooks/useFudgeDice/useFudgeDice";
import { useTextColors } from "../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { IPossibleTranslationKeys } from "../../../services/internationalization/IPossibleTranslationKeys";
import { IPlayer } from "../useScene/IScene";

export const PlayerRow: React.FC<{
  player: IPlayer;
  isGM: boolean;
  isMe: boolean;
  offline: boolean;
  onDiceRoll(): void;
  onPlayedInTurnOrderChange(playedInTurnOrder: boolean): void;
  onFatePointsChange(fatePoints: number): void;
  onPlayerRemove(): void;
}> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const diceManager = useFudgeDice(props.player.rolls);

  const shouldRenderOfflinePlayerRemoveButton = props.offline && !props.isMe;
  const shouldHighlight = props.isMe && !props.offline;
  const canControl = props.isGM || props.isMe;
  const highlightBackgroundColor = lighten(theme.palette.primary.main, 0.95);
  const textColor = useTextColors(highlightBackgroundColor);
  const playedDuringTurnColor = props.player.playedDuringTurn
    ? theme.palette.primary.main
    : textColor.disabled;
  const rowStyle = css({
    backgroundColor: shouldHighlight ? highlightBackgroundColor : "transparent",
    color: shouldHighlight ? textColor.primary : undefined,
  });
  const playerInfoRowStyle = css({
    padding: "0.7rem",
    borderBottom: "none",
  });
  const controlsRowStyle = css({
    padding: "0 0.5rem",
  });

  const diceTextColors = useTextColors(highlightBackgroundColor);
  const diceStyle = css({
    fontSize: "1.2rem",
    lineHeight: Font.lineHeight(1.2),
    color: diceManager.state.color,
    background: highlightBackgroundColor,
    border: `.1rem solid ${theme.palette.primary.main}`,
    width: "2rem",
    borderRadius: "4px",
    height: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow:
      "2px 2px 2px 0px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
  });
  const diceRollingAnimationStyle = css({
    animationName: "spin",
    animationDuration: "250ms",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
  });

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
  return (
    <>
      <TableRow className={rowStyle}>
        <TableCell className={playerInfoRowStyle} align="left">
          <Typography
            noWrap
            className={css({
              fontSize: "1.2rem",
              lineHeight: Font.lineHeight(1.2),
            })}
          >
            {props.isGM
              ? t(props.player.playerName as IPossibleTranslationKeys)
              : props.player.playerName}
          </Typography>
        </TableCell>
        <TableCell className={playerInfoRowStyle} align="center">
          <Tooltip
            title={
              props.player.playedDuringTurn
                ? t("player-row.played")
                : t("player-row.not-played")
            }
          >
            <span>
              <IconButton
                onClick={() => {
                  props.onPlayedInTurnOrderChange(
                    !props.player.playedDuringTurn
                  );
                }}
                disabled={!canControl}
                size="small"
              >
                {props.player.playedDuringTurn ? (
                  <DirectionsRunIcon
                    htmlColor={playedDuringTurnColor}
                  ></DirectionsRunIcon>
                ) : (
                  <EmojiPeopleIcon
                    htmlColor={playedDuringTurnColor}
                  ></EmojiPeopleIcon>
                )}
              </IconButton>
            </span>
          </Tooltip>
        </TableCell>
        <TableCell className={cx(playerInfoRowStyle)} align="center">
          <Tooltip title={t("player-row.fate-points")}>
            <span>
              <ButtonBase
                className={css({
                  borderRadius: "50%",
                })}
                disabled={!canControl}
                onClick={() => {
                  props.onFatePointsChange(props.player.fatePoints - 1);
                }}
              >
                <Avatar className={fatePointsStyle}>
                  {props.player.fatePoints}
                </Avatar>
              </ButtonBase>
            </span>
          </Tooltip>
        </TableCell>
        <TableCell className={cx(playerInfoRowStyle)} align="right">
          <Box display="flex" justifyContent="flex-end">
            <Tooltip title={diceManager.state.tooltip}>
              <span>
                <ButtonBase
                  className={css({
                    borderRadius: "4px%",
                    color: diceTextColors.primary,
                  })}
                  disabled={!canControl}
                  onClick={() => {
                    props.onDiceRoll();
                  }}
                >
                  <Typography
                    className={cx(diceStyle, {
                      [diceRollingAnimationStyle]: diceManager.state.rolling,
                    })}
                  >
                    {diceManager.state.label}
                  </Typography>
                </ButtonBase>
              </span>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
      {props.isGM && renderGMControls()}
    </>
  );

  function renderGMControls() {
    return (
      <TableRow className={cx(rowStyle, controlsRowStyle)}>
        <TableCell colSpan={4}>
          <Grid container alignItems="center" justify="flex-end" spacing={1}>
            <Grid item>
              <Tooltip title={t("player-row.remove-fate-point")}>
                <span>
                  <IconButton
                    size="small"
                    disabled={props.player.fatePoints === 0}
                    onClick={() => {
                      const fatePointsMinusOne = props.player.fatePoints - 1;
                      const newValue =
                        fatePointsMinusOne < 0 ? 0 : fatePointsMinusOne;
                      props.onFatePointsChange(newValue);
                    }}
                  >
                    <RemoveCircleOutlineOutlinedIcon
                      className={css({ width: "1.2rem", height: "auto" })}
                    ></RemoveCircleOutlineOutlinedIcon>
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>

            <Grid item>
              <Tooltip title={t("player-row.add-fate-point")}>
                <IconButton
                  size="small"
                  onClick={() => {
                    props.onFatePointsChange(props.player.fatePoints + 1);
                  }}
                >
                  <AddCircleOutlineOutlinedIcon
                    className={css({ width: "1.2rem", height: "auto" })}
                  ></AddCircleOutlineOutlinedIcon>
                </IconButton>
              </Tooltip>
            </Grid>
            {shouldRenderOfflinePlayerRemoveButton && (
              <Grid item>
                <Tooltip title={t("player-row.remove-character")}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      props.onPlayerRemove();
                    }}
                  >
                    <HighlightOffIcon
                      color="error"
                      className={css({ width: "1.2rem", height: "auto" })}
                    ></HighlightOffIcon>
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
          </Grid>
        </TableCell>
      </TableRow>
    );
  }
};
PlayerRow.displayName = "PlayerRow";
