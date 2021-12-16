import { css } from "@emotion/css";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import NativeSelect from "@mui/material/NativeSelect";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { useTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import React, { useContext } from "react";
import { useZIndex } from "../../constants/zIndex";
import { DiceContext } from "../../contexts/DiceContext/DiceContext";
import {
  CommmandSetOptions,
  IDiceCommandSetOption,
  IRollDiceOptions,
  IRollDiceOptionsHighlight,
} from "../../domains/dice/Dice";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { CircleTextField } from "../../routes/Character/components/CharacterDialog/components/CircleTextField";

export function DiceMenu(props: {
  anchorEl: any;
  open: boolean;
  ctaLabel?: string;
  commands: Array<IDiceCommandSetOption>;
  options: IRollDiceOptions | undefined;
  showPoolToggle: boolean;
  onCtaClick?(): void;
  onClose?(): void;
  onClear?(): void;
  onDispatchDiceCommandChange: React.Dispatch<
    React.SetStateAction<IDiceCommandSetOption[]>
  >;
  onDispatchOptionsChange: React.Dispatch<
    React.SetStateAction<IRollDiceOptions | undefined>
  >;
}) {
  const theme = useTheme();
  const zIndex = useZIndex();
  const { t } = useTranslate();
  const diceManager = useContext(DiceContext);
  const [tab, setTab] = React.useState<"dice" | "options">("dice");
  const highlightOptions: IRollDiceOptionsHighlight = {
    value: props.options.highlight?.value ?? 0,
    using: props.options.highlight?.using ?? "highest",
  };

  function handleOnHighlightOptionsValueChange(value: number) {
    props.onDispatchOptionsChange((prev) => {
      return {
        ...prev,
        highlight: {
          ...highlightOptions,
          value: value,
        },
      };
    });
  }

  function handleOnHighlightOptionsUsingChange(value: string) {
    props.onDispatchOptionsChange((prev) => {
      return {
        ...prev,
        highlight: {
          ...highlightOptions,
          using: value as IRollDiceOptionsHighlight["using"],
        },
      };
    });
  }

  return <>{renderPopper()}</>;

  function renderPopper() {
    return (
      <Popper
        open={props.open}
        anchorEl={props.anchorEl}
        transition
        placement="top"
        style={{ zIndex: zIndex.diceFab }}
        modifiers={[
          {
            name: "flip",
            enabled: false,
          },
          {
            name: "offset",
            options: {
              offset: [0, 16],
            },
          },
          {
            name: "preventOverflow",
            enabled: true,
            options: {
              boundariesElement: "viewport",
            },
          },
        ]}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
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
              <Paper elevation={6}>
                <Box maxHeight="70vh" overflow="auto">
                  {renderMenu()}
                </Box>
              </Paper>
            </Box>
          </Grow>
        )}
      </Popper>
    );
  }

  function renderMenu() {
    return (
      <Box p="1rem">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabContext value={tab}>
            <Tabs
              value={tab}
              onChange={(event, newTab) => {
                setTab(newTab);
              }}
            >
              <Tab label="Dice" value={"dice"} />
              <Tab label="Options" value={"options"} />
            </Tabs>
            <TabPanel value={"dice"}>
              {renderCommandSetHeader("Standard Dice")}
              {renderOptions([
                CommmandSetOptions["1d4"],
                CommmandSetOptions["1d6"],
                CommmandSetOptions["1d8"],
                CommmandSetOptions["1d10"],
                CommmandSetOptions["1d12"],
                CommmandSetOptions["1d20"],
                CommmandSetOptions["1d100"],
              ])}
              {renderCommandSetHeader("Misc")}
              {renderOptions([
                CommmandSetOptions["4dF"],
                CommmandSetOptions["1dF"],
                CommmandSetOptions["coin"],
                CommmandSetOptions["card"],
                CommmandSetOptions["2d6"],
              ])}

              {renderActions()}
            </TabPanel>
            <TabPanel value={"options"}>
              <Box minHeight={"15rem"}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <Typography sx={{ fontSize: "1.2rem" }}>
                      Highlight
                    </Typography>
                  </Grid>
                  <Grid item>
                    <CircleTextField
                      value={highlightOptions.value.toString()}
                      onIncrement={() => {
                        handleOnHighlightOptionsValueChange(
                          highlightOptions.value + 1
                        );
                      }}
                      onDecrement={() => {
                        handleOnHighlightOptionsValueChange(
                          highlightOptions.value - 1
                        );
                      }}
                      onChange={(newValue) => {
                        handleOnHighlightOptionsValueChange(parseInt(newValue));
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <NativeSelect
                      value={highlightOptions.using}
                      onChange={(event) => {
                        handleOnHighlightOptionsUsingChange(event.target.value);
                      }}
                      inputProps={{
                        sx: {
                          paddingTop: "0",
                          // paddingBottom: "0",
                          fontSize: "1.2rem",
                        },
                      }}
                    >
                      <option value={"highest"}>highest</option>
                      <option value={"lowest"}>lowest</option>
                    </NativeSelect>
                  </Grid>
                  <Grid>
                    <Typography sx={{ fontSize: "1.2rem" }}>values.</Typography>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    );
  }

  function renderActions() {
    return (
      <>
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
                            listResults: !diceManager.state.options.listResults,
                          });
                        }}
                        color="primary"
                      />
                    }
                    label={t("dice-fab.pool")}
                  />
                </Grid>
              )}
              {props.onClear && (
                <Grid item>
                  <Button variant="text" onClick={props.onClear}>
                    {"Reset"}
                  </Button>
                </Grid>
              )}

              {props.onCtaClick && (
                <Grid item>
                  <Button
                    color="primary"
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
      </>
    );
  }

  function renderCommandSetHeader(header: string) {
    return (
      <Box>
        <Typography
          variant="h6"
          className={css({
            color: theme.palette.text.primary,
            textAlign: "center",
            fontWeight: theme.typography.fontWeightBold,
          })}
        >
          {header}
        </Typography>
      </Box>
    );
  }

  function renderOptions(options: Array<IDiceCommandSetOption>) {
    return (
      <>
        <Box pb=".5rem">
          <Grid container spacing={1} justifyContent="center">
            {options.map((o) => {
              const badgeContent = props.commands.reduce((acc, curr) => {
                if (o.label === curr.label) {
                  return acc + 1;
                }
                return acc;
              }, 0);
              return (
                <Grid item key={o.label}>
                  <Grid container justifyContent="center" direction="column">
                    <Grid container item justifyContent="center">
                      <IconButton
                        onClick={() => {
                          props.onDispatchDiceCommandChange((t) => {
                            return [...t, o];
                          });
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          props.onDispatchDiceCommandChange((draft) => {
                            const indexToRemove = draft.findIndex(
                              (selectedOption) =>
                                selectedOption.label === o.label
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
                        <Badge badgeContent={badgeContent} color="primary">
                          <o.icon
                            className={css({
                              fontSize: "3rem",
                              color:
                                badgeContent > 0
                                  ? theme.palette.primary.main
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
                        {o.label}
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
