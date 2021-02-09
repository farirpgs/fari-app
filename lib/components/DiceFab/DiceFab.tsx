import { css } from "@emotion/css";
import Typography from "@material-ui/core/Typography";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import React, { useContext, useState } from "react";
import { DiceContext } from "../../contexts/DiceContext/DiceContext";
import { IDiceRoll, IDiceRollType, rollDice } from "../../domains/dice/Dice";
import { DiceGameIcon } from "../../domains/Icons/Icons";

export const DiceFab: React.FC<{ onSelect?(result: IDiceRoll): void }> = (
  props
) => {
  const [open, setOpen] = useState(false);
  const diceManager = useContext(DiceContext);

  const handleCloseFab = () => {
    setOpen(false);
  };
  const handleOpenFab = () => {
    setOpen(true);
  };

  const handleSetDiceType = (type: IDiceRollType) => {
    diceManager.actions.setDiceType(type);
    setOpen(false);
    const result = rollDice(type);
    props.onSelect?.(result);
  };

  const handleSpeedDialClick = () => {
    const result = rollDice(diceManager.state.diceType);
    props.onSelect?.(result);
  };

  return (
    <>
      <SpeedDial
        ariaLabel="Dice"
        onClick={(e) => {
          handleCloseFab();
          handleSpeedDialClick();
        }}
        className={css({
          right: "2rem",
          bottom: "2rem",
          position: "fixed",
        })}
        classes={{
          fab: css({
            width: "4rem",
            height: "4rem",
          }),
        }}
        open={open}
        icon={
          <DiceGameIcon
            className={css({
              width: "2.5rem",
              height: "2.5rem",
            })}
          />
        }
        onClose={handleCloseFab}
        onOpen={handleOpenFab}
      >
        <SpeedDialAction
          tooltipOpen
          tooltipTitle="Roll&nbsp;4dF"
          icon={<Typography>{"4dF"}</Typography>}
          onClick={() => handleSetDiceType("4dF")}
        />
        <SpeedDialAction
          tooltipOpen
          tooltipTitle="Roll&nbsp;1dF"
          icon={<Typography>{"1dF"}</Typography>}
          onClick={() => handleSetDiceType("1dF")}
        />
        <SpeedDialAction
          tooltipOpen
          tooltipTitle="Flip&nbsp;a&nbsp;Coin"
          icon={<Typography>{"Coin"}</Typography>}
          onClick={() => handleSetDiceType("Coin")}
        />
        <SpeedDialAction
          tooltipOpen
          tooltipTitle="Roll&nbsp;1d100"
          icon={<Typography>{"1d%"}</Typography>}
          onClick={() => handleSetDiceType("1d100")}
        />
        <SpeedDialAction
          tooltipOpen
          tooltipTitle="Roll&nbsp;2d6"
          icon={<Typography>{"2d6"}</Typography>}
          onClick={() => handleSetDiceType("2d6")}
        />
      </SpeedDial>
    </>
  );
};
