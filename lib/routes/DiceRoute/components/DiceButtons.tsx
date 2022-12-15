import Badge from "@mui/material/Badge";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React from "react";
import { DiceOptions, IDiceCommandId } from "../../../domains/dice/Dice";

export function DiceButtons(props: {
  commands: Array<IDiceCommandId>;
  pool?: Array<IDiceCommandId>;
  onClick(command: IDiceCommandId): void;
  onRightClick?(command: IDiceCommandId): void;
}) {
  const theme = useTheme();
  const pool = props.pool || [];
  return (
    <Grid container spacing={1} justifyContent="center">
      {props.commands.map((command) => {
        const options = DiceOptions[command];
        const count = pool.filter((c) => c === command).length;
        return (
          <Grid item key={command}>
            <Grid container justifyContent="center" direction="column">
              <Grid container item justifyContent="center">
                <IconButton
                  onClick={() => props.onClick(command)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    props.onRightClick?.(command);
                  }}
                  size="large"
                >
                  <Badge badgeContent={count} color="primary">
                    <options.icon
                      style={{
                        fontSize: "3rem",
                        color: theme.palette.primary.main,
                      }}
                    />
                  </Badge>
                </IconButton>
              </Grid>
              <Grid container item justifyContent="center">
                <Typography>{options.label}</Typography>
              </Grid>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}
