import {
  Badge,
  Box,
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
import FlareIcon from "@material-ui/icons/Flare";
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
  highlight: boolean;
  isGM: boolean;
  offline: boolean;
  onPlayedInTurnOrderChange(playedInTurnOrder: boolean): void;
  onPlayerFatePointsChange(fatePoints: number): void;
  onPlayerRemove(): void;
}> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const diceManager = useFudgeDice(props.player.rolls);
  const highlightBackgroundColor = lighten(theme.palette.primary.main, 0.95);
  const textColor = useTextColors(highlightBackgroundColor);
  const playedDuringTurnColor = props.player.playedDuringTurn
    ? theme.palette.primary.main
    : textColor.disabled;
  const shouldRenderOfflinePlayerRemoveButton =
    props.offline && !props.highlight;
  const shouldRenderDiceResult = !props.offline || props.highlight;
  const shouldHighlight = props.highlight && !props.offline;
  const rowStyle = css({
    backgroundColor: shouldHighlight ? highlightBackgroundColor : "transparent",
    color: shouldHighlight ? textColor.primary : undefined,
  });
  const firstRowTableCellStyle = css({
    padding: "0.7rem",
    borderBottom: "none",
  });
  const secondRowTableCellStyle = css({
    padding: "0 0.5rem",
  });
  return (
    <>
      <TableRow className={rowStyle}>
        <TableCell className={firstRowTableCellStyle} align="left">
          <Typography
            noWrap
            className={css({
              fontSize: "1.2rem",
              lineHeight: Font.lineHeight(1.2),
            })}
          >
            {t(props.player.playerName as IPossibleTranslationKeys)}
          </Typography>
        </TableCell>
        <TableCell className={firstRowTableCellStyle} align="center">
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
                disabled={!props.isGM}
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
        <TableCell className={cx(firstRowTableCellStyle)} align="center">
          <Tooltip title={t("player-row.fate-points")}>
            <Badge badgeContent={props.player.fatePoints} color="primary">
              <FlareIcon width="2"></FlareIcon>
            </Badge>
          </Tooltip>
        </TableCell>
        <TableCell className={cx(firstRowTableCellStyle)} align="right">
          {shouldRenderDiceResult && (
            <Box display="flex" justifyContent="flex-end">
              <Tooltip title={diceManager.state.tooltip}>
                <Typography
                  className={css({
                    fontSize: "1.2rem",
                    lineHeight: Font.lineHeight(1.2),
                    color: diceManager.state.color,
                    border: `.1rem solid ${theme.palette.primary.main}`,
                    width: "2rem",
                    borderRadius: "4px",
                    height: "2rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow:
                      "2px 2px 2px 0px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
                    animationName: diceManager.state.rolling
                      ? "spin"
                      : undefined,
                    animationDuration: "250ms",
                    animationIterationCount: "infinite",
                    animationTimingFunction: "linear",
                  })}
                >
                  {diceManager.state.label}
                </Typography>
              </Tooltip>
            </Box>
          )}
        </TableCell>
      </TableRow>
      {props.isGM && (
        <TableRow className={cx(rowStyle, secondRowTableCellStyle)}>
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
                        props.onPlayerFatePointsChange(newValue);
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
                      props.onPlayerFatePointsChange(
                        props.player.fatePoints + 1
                      );
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
      )}
    </>
  );
};
PlayerRow.displayName = "PlayerRow";
