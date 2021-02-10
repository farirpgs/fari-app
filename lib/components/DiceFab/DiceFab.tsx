import { css } from "@emotion/css";
import TouchAppIcon from "@material-ui/icons/TouchApp";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import React, { useContext, useState } from "react";
import { DiceContext } from "../../contexts/DiceContext/DiceContext";
import { IDiceRoll, IDiceRollType, rollDice } from "../../domains/dice/Dice";
import { Icons } from "../../domains/Icons/Icons";

type IProps = {
  onSelect?(result: IDiceRoll): void;
};

export const DiceFab: React.FC<IProps> = (props) => {
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
          <Icons.RollDiceICon
            className={css({
              width: "3rem",
              height: "3rem",
            })}
          />
        }
        onClose={handleCloseFab}
        onOpen={handleOpenFab}
      >
        <SpeedDialAction
          tooltipOpen
          tooltipTitle="Roll&nbsp;4dF"
          icon={<TouchAppIcon />}
          onClick={(e) => {
            e.stopPropagation();
            handleSetDiceType("4dF");
          }}
        />
        <SpeedDialAction
          tooltipOpen
          tooltipTitle="Roll&nbsp;1dF"
          icon={<TouchAppIcon />}
          onClick={(e) => {
            e.stopPropagation();
            handleSetDiceType("1dF");
          }}
        />
        <SpeedDialAction
          tooltipOpen
          tooltipTitle="Flip&nbsp;a&nbsp;Coin"
          icon={<TouchAppIcon />}
          onClick={(e) => {
            e.stopPropagation();
            handleSetDiceType("Coin");
          }}
        />
        <SpeedDialAction
          tooltipOpen
          tooltipTitle="Roll&nbsp;1d100"
          icon={<TouchAppIcon />}
          onClick={(e) => {
            e.stopPropagation();
            handleSetDiceType("1d100");
          }}
        />
        <SpeedDialAction
          tooltipOpen
          tooltipTitle="Roll&nbsp;2d6"
          icon={<TouchAppIcon />}
          onClick={(e) => {
            e.stopPropagation();
            handleSetDiceType("2d6");
          }}
        />
      </SpeedDial>
    </>
  );
};
