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

  return (
    <>
      <SpeedDial
        ariaLabel="Dice"
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
          tooltipTitle="Select"
          icon={<Typography>{"4Df"}</Typography>}
          onClick={() => handleSetDiceType("4dF")}
        />
        <SpeedDialAction
          tooltipTitle="Select"
          icon={<Typography>{"1dF"}</Typography>}
          onClick={() => handleSetDiceType("1dF")}
        />
        <SpeedDialAction
          tooltipTitle="Select"
          icon={<Typography>{"Coin"}</Typography>}
          onClick={() => handleSetDiceType("Coin")}
        />
        <SpeedDialAction
          tooltipTitle="Select"
          icon={<Typography>{"1d%"}</Typography>}
          onClick={() => handleSetDiceType("1d100")}
        />
        <SpeedDialAction
          tooltipTitle="Select"
          icon={<Typography>{"2d6"}</Typography>}
          onClick={() => handleSetDiceType("2d6")}
        />
      </SpeedDial>
    </>
  );
};
