import { css } from "@emotion/css";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Popover, { PopoverOrigin } from "@mui/material/Popover";
import { useTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useContext } from "react";
import { useZIndex } from "../../constants/zIndex";
import { DiceContext } from "../../contexts/DiceContext/DiceContext";
import {
  Dice,
  DiceCustomCommand,
  IDiceCommandSetOption,
} from "../../domains/dice/Dice";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export function DiceMenu(props: {
  anchorEl: any;
  open: boolean;
  ctaLabel?: string;
  commands: Array<IDiceCommandSetOption>;
  showPoolToggle: boolean;
  anchorOrigin: PopoverOrigin;
  transformOrigin: PopoverOrigin;
  sx?: React.CSSProperties;
  onCtaClick?(): void;
  onClose?(): void;
  onClear?(): void;
  onDiceCommandChange: React.Dispatch<
    React.SetStateAction<IDiceCommandSetOption[]>
  >;
}) {
  const theme = useTheme();
  const zIndex = useZIndex();
  const { t } = useTranslate();
  const diceManager = useContext(DiceContext);
  const customCommand = props.commands[0]?.id.startsWith("[")
    ? props.commands[0].id
    : "";

  const customCommandValue = DiceCustomCommand.parse(customCommand);

  return <>{renderPopover()}</>;

  function renderPopover() {
    return (
      <Popover
        open={props.open}
        anchorEl={props.anchorEl}
        disableScrollLock
        sx={props.sx}
        onClose={() => {
          props.onClose?.();
        }}
        anchorOrigin={props.anchorOrigin}
        transformOrigin={props.transformOrigin}
      >
        <Box
          className={css({
            padding: "0 1rem",
            maxWidth: "90vw",
            zIndex: zIndex.diceFab,
          })}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Box maxHeight="70vh" overflow="auto">
            <Box p="1rem">
              {renderOptions([
                Dice.getSetOptions("1d4"),
                Dice.getSetOptions("1d6"),
                Dice.getSetOptions("1d8"),
                Dice.getSetOptions("1d10"),
                Dice.getSetOptions("1d12"),
                Dice.getSetOptions("1d20"),
                Dice.getSetOptions("1d100"),
              ])}
              {renderOptions([
                Dice.getSetOptions("4dF"),
                Dice.getSetOptions("1dF"),
                Dice.getSetOptions("coin"),
                Dice.getSetOptions("card"),
                Dice.getSetOptions("2d6"),
              ])}
              {renderDiceInput()}

              {(props.onClear || props.onCtaClick) && (
                <Box mt="1.5rem">
                  <Grid container justifyContent="center" spacing={2}>
                    {props.showPoolToggle && (
                      <Grid item>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={diceManager.state.options.listResults}
                              onChange={() => {
                                diceManager.actions.setOptions({
                                  listResults:
                                    !diceManager.state.options.listResults,
                                });
                              }}
                              color="secondary"
                            />
                          }
                          label={t("dice-fab.pool")}
                        />
                      </Grid>
                    )}
                    {props.onClear && (
                      <Grid item>
                        <Button
                          color="secondary"
                          variant="text"
                          onClick={props.onClear}
                        >
                          {"Reset"}
                        </Button>
                      </Grid>
                    )}

                    {props.onCtaClick && (
                      <Grid item>
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={props.onCtaClick}
                        >
                          {props.ctaLabel}
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Popover>
    );
  }

  function renderDiceInput() {
    console.log("customCommand", customCommand, customCommandValue);
    return (
      <Box>
        <Grid container justifyContent="center">
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Custom command"
              variant="filled"
              value={customCommandValue}
              onChange={(e) => {
                props.onDiceCommandChange(() => {
                  const newValue = `[${e.target.value}]`;
                  const commandSetOptions =
                    DiceCustomCommand.getOptions(newValue);

                  return [commandSetOptions];
                });
              }}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }

  function renderOptions(options: Array<IDiceCommandSetOption>) {
    return (
      <>
        <Box pb=".5rem">
          <Grid container spacing={1} justifyContent="center">
            {options.map((option) => {
              const badgeContent = props.commands.reduce((acc, curr) => {
                if (option.label === curr.label) {
                  return acc + 1;
                }
                return acc;
              }, 0);
              return (
                <Grid item key={option.label}>
                  <Grid container justifyContent="center" direction="column">
                    <Grid container item justifyContent="center">
                      <IconButton
                        onClick={() => {
                          props.onDiceCommandChange((draft) => {
                            if (customCommand) {
                              return [option];
                            }

                            return [...draft, option];
                          });
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          props.onDiceCommandChange((draft) => {
                            const indexToRemove = draft.findIndex(
                              (selectedOption) =>
                                selectedOption.label === option.label
                            );
                            if (indexToRemove !== -1) {
                              draft.splice(indexToRemove, 1);
                            }
                            return [...draft];
                          });
                        }}
                        className={css({
                          background:
                            badgeContent > 0
                              ? theme.palette.action.hover
                              : "inherit",
                        })}
                        size="large"
                      >
                        <Badge badgeContent={badgeContent} color="secondary">
                          <option.icon
                            className={css({
                              fontSize: "3rem",
                              color:
                                badgeContent > 0
                                  ? theme.palette.secondary.main
                                  : theme.palette.text.secondary,
                            })}
                          />
                        </Badge>
                      </IconButton>
                    </Grid>
                    <Grid container item justifyContent="center">
                      <Typography
                        className={css({
                          fontWeight:
                            badgeContent > 0
                              ? theme.typography.fontWeightBold
                              : "inherit",
                          color:
                            badgeContent > 0
                              ? theme.palette.text.primary
                              : theme.palette.text.secondary,
                          textAlign: "center",
                        })}
                      >
                        {option.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </>
    );
  }
}
