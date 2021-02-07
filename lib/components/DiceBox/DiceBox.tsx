import { css, cx } from "@emotion/css";
import Box from "@material-ui/core/Box";
import ButtonBase from "@material-ui/core/ButtonBase";
import Collapse from "@material-ui/core/Collapse";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import React, { useContext } from "react";
import { DiceContext } from "../../contexts/DiceContext/DiceContext";
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
  const [diceMenuAnchorElement, setDiceMenuAnchorElement] = React.useState<
    EventTarget & HTMLButtonElement
  >();
  const diceManager = useContext(DiceContext);

  const handleDiceTypeMenuClose = () => {
    setDiceMenuAnchorElement(undefined);
  };

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

  const type = diceRollsManager.state.type;
  const tooltipContent =
    diceRollsManager.state.shouldDisplay && !diceMenuAnchorElement ? (
      <Box textAlign="center">
        {diceRollsManager.state.rollDetails && (
          <Box>
            <Box
              display="inline"
              fontFamily={type === "1dF" || type === "4dF" ? "fate" : "inherit"}
            >
              {diceRollsManager.state.rollDetails}
            </Box>
            <Box display="inline"> = {diceRollsManager.state.total}</Box>
          </Box>
        )}
        {diceRollsManager.state.rollBonus && (
          <Box>{diceRollsManager.state.rollBonus}</Box>
        )}
      </Box>
    ) : (
      ""
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
          disabled={props.disabled || diceRollsManager.state.rolling}
          onClick={(e) => {
            e.stopPropagation();
            handleButtonBoxClick();
          }}
          onContextMenu={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setDiceMenuAnchorElement(e.currentTarget);
          }}
        >
          <Typography
            component="span"
            data-cy="dice"
            data-cy-value={diceRollsManager.state.label}
            data-cy-rolling={diceRollsManager.state.rolling}
            className={cx(diceStyle, {
              [diceRollingAnimationStyle]: diceRollsManager.state.rolling,
            })}
          >
            {diceRollsManager.state.label}
          </Typography>
        </ButtonBase>
        <Menu
          keepMounted
          open={!!diceMenuAnchorElement}
          anchorEl={diceMenuAnchorElement}
          onClose={handleDiceTypeMenuClose}
        >
          <MenuItem
            onClick={() => {
              diceManager.actions.setDiceType("4dF");
              handleDiceTypeMenuClose();
            }}
          >
            4dF
          </MenuItem>
          <MenuItem
            onClick={() => {
              diceManager.actions.setDiceType("2d6");
              handleDiceTypeMenuClose();
            }}
          >
            2d6
          </MenuItem>
          <MenuItem
            onClick={() => {
              diceManager.actions.setDiceType("coin-toss");
              handleDiceTypeMenuClose();
            }}
          >
            Coin toss
          </MenuItem>
          <MenuItem
            onClick={() => {
              diceManager.actions.setDiceType("1dF");
              handleDiceTypeMenuClose();
            }}
          >
            1dF
          </MenuItem>
        </Menu>
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
