import { css, cx } from "@emotion/css";
import Box from "@material-ui/core/Box";
import ButtonBase from "@material-ui/core/ButtonBase";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { FontFamily } from "../../constants/FontFamily";
import { useZIndex } from "../../constants/zIndex";
import { arraySort } from "../../domains/array/arraySort";
import {
  Dice,
  DiceCommandOptions,
  IDiceRollResult,
  RollType,
} from "../../domains/dice/Dice";
import { Font } from "../../domains/font/Font";
import { useLatestDiceRoll } from "../../hooks/useLatestDiceRoll/useLatestDiceRoll";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { DiceCommandGroup } from "../../routes/Character/components/CharacterDialog/domains/DiceCommandGroup/DiceCommandGroup";
import { previewContentEditable } from "../ContentEditable/ContentEditable";

type IProps = {
  rolls: Array<IDiceRollResult>;
  size: string;
  fontSize: string;
  borderSize: string;
  disableTooltip?: boolean;
  tooltipOpen?: boolean;
  tooltipPlacement?: TooltipProps["placement"];
  disabled?: boolean;
  reduceOpacityWithoutHover?: boolean;
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

  const handleTooltipOpen = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.target);
    setOpen(true);
  };

  const handleTooltipClose = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.target);
    setOpen(false);
  };

  const diceStyle = css({
    "fontSize": props.fontSize,
    "fontFamily": Font.monospace,
    "lineHeight": "normal",
    "color": diceRollsManager.state.color,
    "background": theme.palette.background.paper,
    "border": `${props.borderSize} solid ${theme.palette.text.primary}`,
    "borderRadius": "4px",
    "padding": ".2rem",
    "minWidth": props.size,
    "height": props.size,
    "display": "flex",
    "justifyContent": "center",
    "alignItems": "center",
    "boxShadow": theme.shadows[2],
    "transition": theme.transitions.create(["opacity"]),
    "opacity": props.reduceOpacityWithoutHover ? "1" : "1",
    "&:hover": {
      opacity: "1",
    },
  });
  const diceRollingAnimationStyle = css({
    animationName: "spin",
    animationDuration: "250ms",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
  });
  const shouldListResult =
    diceRollsManager.state.finalResult?.options.listResults;
  const separator = shouldListResult ? " • " : " + ";
  const isPool = shouldListResult ?? false;
  const shouldRenderTotal = !isPool;
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
              color: theme.palette.secondary.light,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            })}
          >
            {"Roll"}
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
            color={tooltipColor.secondary}
            lineHeight={Font.lineHeight(1)}
          >
            {Dice.simplifyRolls(diceRollsManager.state.finalResultRolls).map(
              (r, i) => {
                const isFirst = i === 0;
                return (
                  <span key={i} className={css({})}>
                    {!isFirst && <span>{separator}</span>}
                    {previewContentEditable({ value: r.label })}
                  </span>
                );
              }
            )}
          </Box>
        </Grid>
        <Divider
          orientation="vertical"
          flexItem
          className={css({ background: tooltipColor.disabled })}
        />
        {shouldRenderTotal && (
          <Grid item xs>
            <Box
              fontSize="2rem"
              fontWeight="bold"
              textAlign="center"
              lineHeight={Font.lineHeight(2)}
              color={tooltipColor.primary}
            >
              {diceRollsManager.state.finalResultTotal}
            </Box>
          </Grid>
        )}
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
            zIndex: zIndex.tooltip,
          })}
          modifiers={{
            flip: {
              enabled: false,
            },
            enabled: true,
            offset: {
              offset: "0, 16px",
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: "viewport",
            },
          }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Box
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
      <Box onMouseEnter={handleTooltipOpen} onMouseLeave={handleTooltipClose}>
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
              : isPool
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

export function DiceBoxResult(props: { rolls: Array<IDiceRollResult> }) {
  const diceRollsManager = useLatestDiceRoll(props.rolls, {
    disableConfettis: true,
  });
  const shouldListResult =
    diceRollsManager.state.finalResult?.options.listResults ?? false;
  const finalRolls = diceRollsManager.state.finalResultRolls;
  const separator = shouldListResult ? "•" : "+";
  const finalResultIncludesAStringValue = finalRolls.some((c) => {
    return c.type === RollType.DiceCommand && typeof c.value === "string";
  });
  const shouldSortRolls = shouldListResult && !finalResultIncludesAStringValue;
  const rolls = shouldSortRolls
    ? arraySort(finalRolls, [
        (roll) => {
          if (roll.type === RollType.DiceCommand) {
            return { value: roll.value, direction: "desc" };
          }
          return { value: 0, direction: "desc" };
        },
      ])
    : finalRolls;
  return (
    <>
      <span>
        {rolls.map((r, i) => {
          const isFirst = i === 0;
          if (r.type === RollType.Label) {
            return null;
          }
          if (r.type === RollType.Modifier) {
            return (
              <span
                key={i}
                className={css({
                  label: "DiceBoxResult-rollType-Modifier",
                  display: "inline-block",
                  verticalAlign: "middle",
                })}
              >
                {!isFirst && (
                  <span
                    className={css({
                      label: "DiceBoxResult-rollType-Modifier-separator",
                      margin: "0 .2rem",
                      verticalAlign: "middle",
                    })}
                  >
                    {separator}
                  </span>
                )}
                <Tooltip title={r.label}>
                  <span
                    className={css({
                      label: "DiceBoxResult-rollType-Modifier-value",
                      verticalAlign: "middle",
                    })}
                  >
                    {r.value}
                  </span>
                </Tooltip>
              </span>
            );
          }

          const options = DiceCommandOptions[r.commandName];
          const isFate = r.commandName === "1dF";
          const IconForPool = DiceCommandGroup.getCommandGroupById(
            r.commandGroupId
          ).icon;

          return (
            <span
              key={i}
              className={css({
                label: "DiceBoxResult-rollType-DiceCommand",
                display: "inline-block",
                verticalAlign: "middle",
              })}
            >
              {!isFirst && (
                <span
                  className={css({
                    label: "DiceBoxResult-rollType-DiceCommand-separator",
                    margin: "0 .2rem",
                    verticalAlign: "middle",
                  })}
                >
                  {separator}
                </span>
              )}
              <Tooltip title={r.commandGroupId}>
                <span>
                  <span
                    className={css({
                      label: "DiceBoxResult-rollType-DiceCommand-value",
                      fontFamily: isFate ? FontFamily.Fate : "inherit",
                      verticalAlign: "middle",
                    })}
                  >
                    {options.formatDetailedResult(r.value)}
                  </span>
                  {!isFate && (
                    <span
                      className={css({
                        label: "DiceBoxResult-rollType-DiceCommand-icon",
                        paddingLeft: ".25rem",
                        verticalAlign: "sub",
                      })}
                    >
                      {shouldListResult && <IconForPool />}
                    </span>
                  )}
                </span>
              </Tooltip>
            </span>
          );
        })}
      </span>
    </>
  );
}

export function DiceBonusLabel(props: {
  rolls: IDiceRollResult[];
  colonBefore?: boolean;
}) {
  const diceRollsManager = useLatestDiceRoll(props.rolls, {
    disableConfettis: true,
  });

  const label = diceRollsManager.state.finalResult?.commandResult
    .filter((c) => c.type === RollType.Modifier || c.type === RollType.Label)
    .map((c) => {
      if (c.type === RollType.Modifier || c.type === RollType.Label) {
        return previewContentEditable({ value: c.label });
      }
    })
    .join(" • ");

  return (
    <>
      {label && (
        <span>
          {props.colonBefore && ": "}
          {label}
        </span>
      )}
    </>
  );
}
