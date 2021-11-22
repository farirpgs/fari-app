import { css, cx } from "@emotion/css";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import Popper from "@mui/material/Popper";
import { useTheme } from "@mui/material/styles";
import Tooltip, { TooltipProps } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { FontFamily } from "../../constants/FontFamily";
import { useZIndex } from "../../constants/zIndex";
import { arraySort } from "../../domains/array/arraySort";
import {
  CommmandSetOptions,
  Dice,
  DiceCommandOptions,
  IDiceRollResult,
} from "../../domains/dice/Dice";
import { Font } from "../../domains/font/Font";
import { useLatestDiceRoll } from "../../hooks/useLatestDiceRoll/useLatestDiceRoll";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { DiceLabelsColors } from "../IndexCard/IndexCardColor";

type IProps = {
  rolls: Array<IDiceRollResult>;
  size: string;
  fontSize: string;
  borderSize: string;
  disableTooltip?: boolean;
  tooltipOpen?: boolean;
  tooltipPlacement?: TooltipProps["placement"];
  disabled?: boolean;
  showDetails?: boolean;
  className?: string;
  disableConfettis?: boolean;
  onClick: () => void;
  onRolling?: (rolling: boolean) => void;
  onFinalResult?: (realRoll: IDiceRollResult) => void;
};

export const DiceBox: React.FC<IProps> = (props) => {
  const theme = useTheme();
  const zIndex = useZIndex();
  const diceTextColors = useTextColors(theme.palette.background.paper);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const diceRollsManager = useLatestDiceRoll(props.rolls, {
    disableConfettis: props.disableConfettis ?? false,
    onRolling: props.onRolling,
    onFinalResult: props.onFinalResult,
  });
  const tooltipBackground = "#182026";
  const tooltipColor = useTextColors(tooltipBackground);

  function handleButtonBoxClick() {
    if (diceRollsManager.state.rolling) {
      return;
    }
    props.onClick();
  }

  const diceStyle = css({
    fontSize: props.fontSize,
    fontFamily: Font.monospace,
    lineHeight: "normal",
    color: theme.palette.getContrastText(diceRollsManager.state.color),
    background: diceRollsManager.state.color,
    fontWeight: theme.typography.fontWeightBold,
    border: `1px dashed ${
      diceRollsManager.state.rolling || !diceRollsManager.state.finalResult
        ? theme.palette.primary.main
        : "transparent"
    }`,
    borderRadius: "4px",
    padding: ".2rem",
    minWidth: props.size,
    height: props.size,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: theme.shadows[2],
    transition: theme.transitions.create(["background"], {
      duration: theme.transitions.duration.shortest,
    }),
  });
  const diceRollingAnimationStyle = css({
    animationName: "spin",
    animationDuration: "250ms",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
  });
  const shouldListResult =
    diceRollsManager.state.finalResult?.options.listResults ?? false;
  const separator = shouldListResult ? " • " : " + ";
  const tooltipContent = !diceRollsManager.state.finalResultHidden && (
    <Box
      className={css({
        background: tooltipBackground,
        borderRadius: "6px",
        maxWidth: "90vw",
        maxHeight: "95vh",
        overflow: "auto",
        color: tooltipColor.primary,
        padding: "1rem",
        boxShadow: theme.shadows[2],
      })}
    >
      <Grid container alignItems="center" wrap="nowrap" spacing={4}>
        <Grid item xs className={css({ minWidth: "16rem", maxWidth: "18rem" })}>
          <Box
            fontSize=".8rem"
            fontWeight="bold"
            lineHeight={Font.lineHeight(0.8)}
            className={css({
              textTransform: "uppercase",
              minWidth: "8rem",
              color: tooltipColor.primary,
            })}
          >
            <DiceBonusLabel colonBefore rolls={props.rolls} />
          </Box>
          <Box
            fontSize="1.5rem"
            color={tooltipColor.primary}
            lineHeight={Font.lineHeight(1.5)}
            fontWeight="bold"
            display="inline-flex"
            alignItems="center"
            className={css({
              width: "100%",
            })}
          >
            <DiceBoxResult rolls={props.rolls} />
          </Box>
          <Box
            fontSize="1rem"
            mt=".5rem"
            color={tooltipColor.secondary}
            lineHeight={Font.lineHeight(1)}
          >
            <Grid container>
              {Dice.simplifyRolls(diceRollsManager.state.finalResultRolls).map(
                (rollGroup, rollGroupIndex) => {
                  const color = DiceLabelsColors[rollGroupIndex];
                  return rollGroup.simplifiedRolls.map((label, rollIndex) => {
                    const isFirst = rollGroupIndex === 0 && rollIndex === 0;
                    return (
                      <React.Fragment key={`${rollGroupIndex}_${rollIndex}`}>
                        {!isFirst && (
                          <Grid
                            item
                            className={css({
                              fontFamily: FontFamily.Console,
                              marginRight: "4px",
                            })}
                          >
                            {separator}
                          </Grid>
                        )}
                        <Grid
                          item
                          className={css({
                            fontFamily: FontFamily.Console,
                            color: color,
                            marginRight: "4px",
                          })}
                        >
                          {label}
                        </Grid>
                      </React.Fragment>
                    );
                  });
                }
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  if (props.showDetails) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        {renderDice()}
        {renderDetails()}
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      className={props.className}
    >
      {renderDice()}
      {!props.disableTooltip && (
        <Popper
          open={!!anchorEl && (props.tooltipOpen ?? open)}
          anchorEl={anchorEl}
          transition
          placement={props.tooltipPlacement}
          className={css({
            zIndex: zIndex.modal,
          })}
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
                // m="1rem"
                onContextMenu={(e) => {
                  e.preventDefault();
                }}
              >
                {tooltipContent}
              </Box>
            </Grow>
          )}
        </Popper>
      )}
    </Box>
  );

  function renderDice() {
    return (
      <Box
        onMouseEnter={(event) => {
          setAnchorEl(event.target);
          setOpen(true);
        }}
        onMouseLeave={(event) => {
          setAnchorEl(event.target);
          setOpen(false);
        }}
      >
        <ButtonBase
          ref={(p) => {
            setAnchorEl(p);
          }}
          className={css({
            color: diceTextColors.primary,
          })}
          disabled={props.disabled || diceRollsManager.state.rolling}
          onClick={(e) => {
            e.stopPropagation();
            handleButtonBoxClick();
          }}
        >
          <Typography
            component="span"
            data-cy="dice"
            data-cy-value={diceRollsManager.state.finalResultTotal}
            data-cy-rolling={diceRollsManager.state.rolling}
            className={cx(diceStyle, {
              [diceRollingAnimationStyle]: diceRollsManager.state.rolling,
            })}
          >
            {diceRollsManager.state.finalResultHidden
              ? ""
              : shouldListResult
              ? "~"
              : diceRollsManager.state.finalResultTotal}
          </Typography>
        </ButtonBase>
      </Box>
    );
  }

  function renderDetails() {
    if (!props.showDetails) {
      return null;
    }

    return (
      <Grow in={!!tooltipContent}>
        <Box mt="1rem">{tooltipContent}</Box>
      </Grow>
    );
  }
};

export function DiceBoxResult(props: {
  rolls: Array<IDiceRollResult>;
  noColor?: boolean;
}) {
  const diceRollsManager = useLatestDiceRoll(props.rolls, {
    disableConfettis: true,
  });
  const shouldListResult =
    diceRollsManager.state.finalResult?.options.listResults ?? false;
  const separator = shouldListResult ? "•" : "+";

  const items = diceRollsManager.state.finalResultRolls.flatMap(
    (rollGroup, i) => {
      const color = !props.noColor ? DiceLabelsColors[i] : undefined;

      const commandSets = rollGroup.commandSets.flatMap((commandSet) => {
        return commandSet.commands.flatMap((command) => {
          return {
            name: command.name,
            value: command.value,
            commandSetId: commandSet.id,
            label: rollGroup.label,
            color: color,
          };
        });
      });

      return shouldListResult
        ? arraySort(commandSets, [
            (c) => ({
              value: c.value.toString(),
              direction: "desc",
            }),
          ])
        : commandSets;
    }
  );

  return (
    <>
      <Grid container justifyContent="flex-start" alignItems="center">
        {items.map((item, itemIndex) => {
          const isFirst = itemIndex === 0;
          const isFate = item.name === "1dF";
          const options = CommmandSetOptions[item.commandSetId];
          const diceCommandOptions = DiceCommandOptions[item.name!];
          const content = diceCommandOptions.formatDetailedResult(item.value);
          const IconForPool = options.icon;

          return (
            <React.Fragment key={itemIndex}>
              {!isFirst && (
                <Grid
                  item
                  className={css({
                    label: "DiceBoxResult-rollType-DiceCommand-separator",
                    display: "flex",
                    margin: "0 4px",
                    fontSize: ".8rem",
                    height: "100%",
                  })}
                >
                  {separator}
                </Grid>
              )}
              <Grid
                item
                className={css({
                  height: "100%",
                })}
              >
                <Tooltip
                  title={
                    item.label
                      ? `${options.label} (${item.label})`
                      : options.label
                  }
                >
                  <Box
                    className={css({
                      color: item.color ? item.color : undefined,
                      height: "100%",
                      borderBottom: item.color
                        ? `3px solid ${item.color}`
                        : undefined,
                    })}
                  >
                    <Grid
                      container
                      alignItems="center"
                      className={css({
                        height: "100%",
                      })}
                    >
                      {content && (
                        <Grid
                          item
                          className={css({
                            height: "100%",
                          })}
                        >
                          <Box
                            className={css({
                              label: "DiceBoxResult-rollType-DiceCommand-value",
                              fontFamily: isFate ? FontFamily.Fate : "inherit",
                              marginLeft: isFate ? ".2rem" : undefined,
                              verticalAlign: "middle",
                              height: "100%",
                            })}
                          >
                            {content}
                          </Box>
                        </Grid>
                      )}
                      {!isFate && (
                        <Grid
                          item
                          className={css({
                            height: "100%",
                          })}
                        >
                          <IconForPool
                            className={css({
                              width: "2rem",
                              height: "2rem",
                              display: "flex",
                              marginLeft: content ? "4px" : undefined,
                            })}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Tooltip>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
    </>
  );
}

export function DiceBonusLabel(props: {
  rolls: IDiceRollResult[];
  colonBefore?: boolean;
  noColor?: boolean;
}) {
  const diceRollsManager = useLatestDiceRoll(props.rolls, {
    disableConfettis: true,
  });

  const labels = diceRollsManager.state.finalResultRolls
    .flatMap((rollGroup, i) => {
      const color = !props.noColor ? DiceLabelsColors[i] : undefined;
      const label = rollGroup.label;
      const modifier = rollGroup.modifier;
      return { color, text: label, modifier };
    })
    .filter((l) => l.text);

  return (
    <>
      <Grid container alignItems="center">
        {labels.map((label, index) => {
          const isFirstLabel = index === 0;
          return (
            <React.Fragment key={index}>
              {!isFirstLabel && (
                <Grid item className={css({ padding: "0 2px" })}>
                  {"/"}
                </Grid>
              )}

              <Grid item>
                <span
                  className={css({
                    color: label.color,
                  })}
                >
                  {label.text} {label.modifier ? `(${label.modifier})` : null}
                </span>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
    </>
  );
}
