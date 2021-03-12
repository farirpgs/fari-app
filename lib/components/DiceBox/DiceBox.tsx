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
import { useZIndex } from "../../constants/zIndex";
import {
  Dice,
  DiceCommandOptions,
  IDiceRollWithBonus,
} from "../../domains/dice/Dice";
import { Font } from "../../domains/font/Font";
import { useDiceRolls } from "../../hooks/useDiceRolls/useDiceRolls";
import { useLightBackground } from "../../hooks/useLightBackground/useLightBackground";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { previewContentEditable } from "../ContentEditable/ContentEditable";

type IProps = {
  rolls: Array<IDiceRollWithBonus>;
  size: string;
  fontSize: string;
  borderSize: string;
  tooltipOpen?: boolean;
  tooltipPlacement?: TooltipProps["placement"];
  disabled?: boolean;
  showDetails?: boolean;
  className?: string;
  onClick: () => void;
  onRolling?: (rolling: boolean) => void;
  onFinalResult?: (realRoll: IDiceRollWithBonus) => void;
};

export const DiceBox: React.FC<IProps> = (props) => {
  const theme = useTheme();
  const zIndex = useZIndex();
  const lightBackground = useLightBackground();
  const diceTextColors = useTextColors(theme.palette.background.paper);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const diceRollsManager = useDiceRolls(props.rolls, {
    disableConfettis: false,
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
    fontSize: props.fontSize,
    fontFamily: Font.monospace,
    lineHeight: "normal",
    color: diceRollsManager.state.color,
    background: theme.palette.background.paper,
    border: `${props.borderSize} solid ${theme.palette.text.primary}`,
    borderRadius: "4px",
    padding: ".2rem",
    minWidth: props.size,
    height: props.size,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow:
      "3px 5px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
  });
  const diceRollingAnimationStyle = css({
    animationName: "spin",
    animationDuration: "250ms",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
  });

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
        boxShadow: theme.shadows[4],
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
            <DiceBonusLabel colon rolls={props.rolls} />
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
                    {!isFirst && <span>{" + "}</span>}
                    {r.type}
                  </span>
                );
              }
            )}
            {diceRollsManager.state.finalResultBonus !== undefined && (
              <span>
                {" + "} {diceRollsManager.state.finalResultBonus}
              </span>
            )}
          </Box>
        </Grid>
        <Divider
          orientation="vertical"
          flexItem
          className={css({ background: tooltipColor.disabled })}
        />
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

export function DiceBoxResult(props: { rolls: IDiceRollWithBonus[] }) {
  const diceRollsManager = useDiceRolls(props.rolls, {
    disableConfettis: true,
  });
  console.debug(
    "diceRollsManager.state.finalResultBonus",
    diceRollsManager.state.finalResultBonus
  );
  return (
    <>
      <span>
        {diceRollsManager.state.finalResultRolls.map((r, i) => {
          const group = DiceCommandOptions[r.type];
          const isFirst = i === 0;
          const isFate = r.type === "1dF";
          return (
            <span key={i}>
              {!isFirst && <span>{" + "}</span>}
              <Tooltip title={r.type}>
                <span
                  className={css({
                    verticalAlign: "middle",
                    fontFamily: isFate ? "fate" : "inherit",
                  })}
                >
                  {group.formatDetailedResult(r.value)}
                </span>
              </Tooltip>
            </span>
          );
        })}
        {diceRollsManager.state.finalResultBonus !== undefined && (
          <span
            className={css({
              verticalAlign: "middle",
            })}
          >
            {" + "} {diceRollsManager.state.finalResultBonus}
          </span>
        )}
      </span>
    </>
  );
}
export function DiceBonusLabel(props: {
  rolls: IDiceRollWithBonus[];
  colon?: boolean;
}) {
  const diceRollsManager = useDiceRolls(props.rolls, {
    disableConfettis: true,
  });

  return (
    <>
      {diceRollsManager.state.finalResultBonusLabel !== undefined && (
        <span>
          {props.colon && ": "}
          {previewContentEditable({
            value: diceRollsManager.state.finalResultBonusLabel,
          })}
        </span>
      )}
    </>
  );
}
