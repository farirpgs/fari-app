import { Box, Grid, lighten, Typography, useTheme } from "@material-ui/core";
import { css } from "emotion";
import React from "react";
import { Font } from "../../domains/font/Font";
import { useFudgeDice } from "../../hooks/useFudgeDice/useFudgeDice";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { IPlayer } from "./useScene/IScene";

export const PlayerRow: React.FC<{
  player: IPlayer;
  highlight: boolean;
}> = (props) => {
  const theme = useTheme();
  const diceManager = useFudgeDice(props.player.rolls);
  const highlightBackgroundColor = lighten(theme.palette.primary.main, 0.95);
  const textColor = useTextColors(highlightBackgroundColor);

  return (
    <Box
      p=".5rem"
      borderBottom="1px solid #ddd"
      bgcolor={props.highlight ? highlightBackgroundColor : "transparent"}
      color={props.highlight ? textColor.primary : undefined}
    >
      <Grid container spacing={2} justify="space-between" alignItems="flex-end">
        <Grid item xs={8}>
          <Typography
            noWrap
            className={css({
              fontSize: "1.2rem",
              lineHeight: Font.lineHeight(1.2),
            })}
          >
            {props.player.playerName}
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            className={css({
              fontSize: "1.2rem",
              lineHeight: Font.lineHeight(1.2),
              color: diceManager.state.color,
            })}
          >
            {diceManager.state.roll ?? <>&nbsp;</>}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
PlayerRow.displayName = "PlayerRow";
