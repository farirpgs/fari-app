import { css, cx } from "@emotion/css";
import Box from "@material-ui/core/Box";
import ButtonBase from "@material-ui/core/ButtonBase";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { IDiceRollWithBonus } from "../../domains/dice/Dice";
import { Font } from "../../domains/font/Font";
import { useDiceRolls } from "../../hooks/useDiceRolls/useDiceRolls";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";

type IProps = {
  rolls: Array<IDiceRollWithBonus>;
  size: string;
  fontSize: string;
  borderSize: string;

  disabled?: boolean;
  showDetails?: boolean;
  onClick: () => void;
  onRolling?: (rolling: boolean) => void;
  onFinalResult?: (realRoll: IDiceRollWithBonus) => void;
};

export const DiceBox: React.FC<IProps> = (props) => {
  const theme = useTheme();
  const diceTextColors = useTextColors(theme.palette.background.paper);
  const diceRollsManager = useDiceRolls(props.rolls, {
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

  const tooltipStyle = css({
    background: tooltipBackground,
    borderRadius: "6px",
    color: tooltipColor.primary,
    minWidth: "14rem",
    maxWidth: "none",
    padding: "0",
    boxShadow: theme.shadows[4],
  });

  const tooltipContent = (
    <Box p="1rem">
      <Grid container alignItems="center" wrap="nowrap" spacing={4}>
        <Grid item xs>
          <Box
            fontSize=".8rem"
            fontWeight="bold"
            lineHeight={Font.lineHeight(0.8)}
            className={css({
              textTransform: "uppercase",
              color: theme.palette.secondary.light,
            })}
          >
            {"Roll"}
          </Box>
          <Box
            fontSize="1.5rem"
            color={tooltipColor.primary}
            lineHeight={Font.lineHeight(1.5)}
            fontWeight="bold"
            fontFamily={
              diceRollsManager.state.display.type === "1dF" ||
              diceRollsManager.state.display.type === "4dF"
                ? "fate"
                : "inherit"
            }
          >
            {diceRollsManager.state.display.spreaded}
          </Box>
          <Box
            fontSize="1rem"
            color={tooltipColor.secondary}
            lineHeight={Font.lineHeight(1)}
          >
            {diceRollsManager.state.display.explanation}
          </Box>
        </Grid>
        <Divider
          orientation="vertical"
          flexItem
          className={css({ background: tooltipColor.disabled })}
        />
        <Grid item>
          <Box
            fontSize="2rem"
            fontWeight="bold"
            lineHeight={Font.lineHeight(2)}
            color={tooltipColor.primary}
          >
            {diceRollsManager.state.display.formatted}
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
    <Box display="flex" flexDirection="column" alignItems="center">
      <Tooltip
        arrow
        title={diceRollsManager.state.finalResultHidden ? "" : tooltipContent}
        classes={{
          arrow: css({
            color: tooltipBackground,
          }),
          tooltip: tooltipStyle,
        }}
      >
        {renderDice()}
      </Tooltip>
    </Box>
  );

  function renderDice() {
    return (
      <div>
        <ButtonBase
          className={css({
            borderRadius: "50%",
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
            data-cy-value={diceRollsManager.state.display.formatted}
            data-cy-rolling={diceRollsManager.state.rolling}
            className={cx(diceStyle, {
              [diceRollingAnimationStyle]: diceRollsManager.state.rolling,
            })}
          >
            {diceRollsManager.state.finalResultHidden
              ? ""
              : diceRollsManager.state.display.formatted}
          </Typography>
        </ButtonBase>
      </div>
    );
  }

  function renderDetails() {
    if (!props.showDetails) {
      return null;
    }

    return (
      <Collapse
        in={!diceRollsManager.state.finalResultHidden}
        timeout={{ enter: 250, exit: 75, appear: 250 }}
      >
        <Box mt="1rem" className={tooltipStyle}>
          {tooltipContent}
        </Box>
      </Collapse>
    );
  }
};
