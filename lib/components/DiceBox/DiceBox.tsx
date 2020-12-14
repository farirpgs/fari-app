import { css, cx } from "@emotion/css";
import Box from "@material-ui/core/Box";
import ButtonBase from "@material-ui/core/ButtonBase";
import Collapse from "@material-ui/core/Collapse";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { IDiceRoll } from "../../domains/dice/IDiceRoll";
import { Font } from "../../domains/font/Font";
import { useFudgeDice } from "../../hooks/useFudgeDice/useFudgeDice";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";

type IProps = {
  rolls: Array<IDiceRoll>;
  size: string;
  fontSize: string;
  borderSize: string;
  borderColor?: string;
  disabled?: boolean;
  showDetails?: boolean;
  onClick: () => void;
  onRolling?: (rolling: boolean) => void;
  onFinalResult?: (realRoll: IDiceRoll) => void;
};

export const DiceBox: React.FC<IProps> = (props) => {
  const theme = useTheme();
  const diceTextColors = useTextColors(theme.palette.background.paper);
  const diceManager = useFudgeDice(props.rolls, {
    onRolling: props.onRolling,
    onFinalResult: props.onFinalResult,
  });

  function onClick() {
    if (diceManager.state.rolling) {
      return;
    }
    props.onClick();
  }

  const diceStyle = css({
    fontSize: props.fontSize,
    fontFamily: Font.monospace,
    lineHeight: "normal",
    color: diceManager.state.color,
    background: theme.palette.background.paper,
    border: `${props.borderSize} solid ${
      props.borderColor ?? theme.palette.primary.main
    }`,
    borderRadius: "4px",
    width: props.size,
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

  const tooltipContent = diceManager.state.tooltipTitle && (
    <Box textAlign="center">
      {diceManager.state.tooltipTitle && (
        <Box>{diceManager.state.tooltipTitle}</Box>
      )}
      {diceManager.state.tooltipDescription && (
        <Box>{diceManager.state.tooltipDescription}</Box>
      )}
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
        title={tooltipContent}
        classes={{
          tooltip: css({
            fontSize: "1.2rem",
            fontFamily: "monospace",
          }),
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
          disabled={props.disabled || diceManager.state.rolling}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <Typography
            component="span"
            data-cy="dice"
            data-cy-value={diceManager.state.label}
            data-cy-rolling={diceManager.state.rolling}
            className={cx(diceStyle, {
              [diceRollingAnimationStyle]: diceManager.state.rolling,
            })}
          >
            {diceManager.state.label}
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
      <Collapse in={!!tooltipContent}>
        <Box
          pt="1rem"
          className={css({
            fontSize: "1.2rem",
            fontFamily: "monospace",
          })}
        >
          {tooltipContent}
        </Box>
      </Collapse>
    );
  }
};
