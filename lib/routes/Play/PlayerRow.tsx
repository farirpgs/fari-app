import { Chip, Grid, IconButton, lighten, TableCell, TableRow, Typography, useTheme } from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
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
  const rowStyle = css({
    backgroundColor: props.highlight ? highlightBackgroundColor : "transparent",
    color: props.highlight ? textColor.primary : undefined,
  });
  const playedInTurnOrderColor = props.player.playedInTurnOrder
    ? theme.palette.primary.main
    : textColor.disabled;
  return (
    <>
      <TableRow className={rowStyle}>
        <TableCell className={css({ borderBottom: "none" })}>
          <IconButton
            onClick={() => {
              props.onPlayedInTurnOrderChange(!props.player.playedInTurnOrder);
            }}
            disabled={!props.isGM}
            size="small"
          >
            <PlayArrowIcon
              htmlColor={playedInTurnOrderColor}
              className={css({ width: "1.2rem", height: "auto" })}
            ></PlayArrowIcon>
          </IconButton>
        </TableCell>
        <TableCell className={css({ borderBottom: "none" })}>
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
        <TableCell align="right" className={css({ borderBottom: "none" })}>
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
      <TableRow className={cx(rowStyle, css({ borderTop: "none" }))}>
        <TableCell colSpan={3}>
          <Grid container alignItems="center" justify="flex-start" spacing={1}>
          <Grid item>
              <Chip
                label={`Fate Points: ${props.player.fatePoints}`}
                color="primary"
              ></Chip>
            </Grid>
            {props.isGM && (
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
            )}
            {props.isGM && (
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
            )}
          </Grid>
        </TableCell>
      </TableRow>
    </>
  );
};
PlayerRow.displayName = "PlayerRow";

// <Box
//   p=".5rem"
//   borderBottom="1px solid #ddd"
//   bgcolor={props.highlight ? highlightBackgroundColor : "transparent"}
//   color={props.highlight ? textColor.primary : undefined}
// >
