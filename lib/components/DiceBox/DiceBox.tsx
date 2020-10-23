import { Box, ButtonBase, Tooltip, Typography } from "@material-ui/core";
import useTheme from "@material-ui/core/styles/useTheme";
import { css, cx } from "emotion";
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
  onClick: () => void;
};

export const DiceBox: React.FC<IProps> = (props) => {
  const theme = useTheme();
  const diceTextColors = useTextColors(theme.palette.background.paper);
  const diceManager = useFudgeDice(props.rolls);

  function onClick() {
    if (diceManager.state.rolling) {
      return;
    }
    props.onClick();
  }

  const diceStyle = css({
    fontSize: props.fontSize,
    fontFamily: Font.monospace,
    lineHeight: Font.lineHeight(5),
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

  return (
    <Tooltip
      title={
        diceManager.state.tooltipTitle && (
          <Box textAlign="center">
            {diceManager.state.tooltipTitle && (
              <Box>{diceManager.state.tooltipTitle}</Box>
            )}
            {diceManager.state.tooltipDescription && (
              <Box>{diceManager.state.tooltipDescription}</Box>
            )}
          </Box>
        )
      }
      classes={{
        tooltip: css({
          fontSize: "1.2rem",
          fontFamily: "monospace",
        }),
      }}
    >
      <span>
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
            className={cx(diceStyle, {
              [diceRollingAnimationStyle]: diceManager.state.rolling,
            })}
          >
            {diceManager.state.label}
          </Typography>
        </ButtonBase>
      </span>
    </Tooltip>
  );
};
