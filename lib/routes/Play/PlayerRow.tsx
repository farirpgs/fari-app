import {
  Badge,
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
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import { css, cx } from "emotion";
import React from "react";
import { Font } from "../../domains/font/Font";
import { useFudgeDice } from "../../hooks/useFudgeDice/useFudgeDice";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { IPlayer } from "./useScene/IScene";

export const PlayerRow: React.FC<{
  player: IPlayer;
  highlight: boolean;
  isGM: boolean;
  onPlayedInTurnOrderChange(playedInTurnOrder: boolean): void;
  onPlayerFatePointsChange(fatePoints: number): void;
}> = (props) => {
  const theme = useTheme();
  const diceManager = useFudgeDice(props.player.rolls);
  const highlightBackgroundColor = lighten(theme.palette.primary.main, 0.95);
  const textColor = useTextColors(highlightBackgroundColor);
  const playedDuringTurnColor = props.player.playedDuringTurn
    ? theme.palette.primary.main
    : textColor.disabled;
  const rowStyle = css({
    backgroundColor: props.highlight ? highlightBackgroundColor : "transparent",
    color: props.highlight ? textColor.primary : undefined,
  });
  const firstRowTableCellStyle = css({
    padding: "0.7rem",
    borderBottom: "none",
  });
  const secondRowTableCellStyle = css({
    padding: "0 0.7rem",
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
            {props.player.playerName}
          </Typography>
        </TableCell>
        <TableCell className={firstRowTableCellStyle} align="center">
          <IconButton
            onClick={() => {
              props.onPlayedInTurnOrderChange(!props.player.playedDuringTurn);
            }}
            disabled={!props.isGM}
            size="small"
          >
            <Tooltip
              title={
                props.player.playedDuringTurn
                  ? "This player played"
                  : "This player has not played"
              }
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
            </Tooltip>
          </IconButton>
        </TableCell>
        <TableCell className={cx(firstRowTableCellStyle)} align="center">
          <Tooltip title="Fate Points">
            <Badge badgeContent={props.player.fatePoints} color="primary">
              <FlareIcon width="2"></FlareIcon>
            </Badge>
          </Tooltip>
        </TableCell>
        <TableCell className={cx(firstRowTableCellStyle)} align="right">
          <Typography
            className={css({
              fontSize: "1.2rem",
              lineHeight: Font.lineHeight(1.2),
              color: diceManager.state.color,
            })}
          >
            {diceManager.state.roll ?? <>-</>}
          </Typography>
        </TableCell>
      </TableRow>
      {props.isGM && (
        <TableRow className={cx(rowStyle, secondRowTableCellStyle)}>
          <TableCell colSpan={4}>
            <Grid container alignItems="center" justify="flex-end" spacing={1}>
              <Grid item>
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
              </Grid>

              <Grid item>
                <IconButton
                  size="small"
                  onClick={() => {
                    props.onPlayerFatePointsChange(props.player.fatePoints + 1);
                  }}
                >
                  <AddCircleOutlineOutlinedIcon
                    className={css({ width: "1.2rem", height: "auto" })}
                  ></AddCircleOutlineOutlinedIcon>
                </IconButton>
              </Grid>
            </Grid>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
PlayerRow.displayName = "PlayerRow";
