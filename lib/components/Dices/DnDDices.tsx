import Button from "@material-ui/core/Button";
import React from "react";
import { useNumber } from "../../hooks/useNumber";
import { Dice } from "./Dice";
export const DnDDices = props => {
  const d4 = useNumber(4);
  const d6 = useNumber(6);
  const d8 = useNumber(8);
  const d10 = useNumber(10);
  const d12 = useNumber(12);
  const d20 = useNumber(20);
  return (
    <div>
      <div className="row ">
        <div className="col-xs-4 col-sm-3">{renderDice("Roll D4", d4)}</div>
        <div className="col-xs-4 col-sm-3">{renderDice("Roll D6", d6)}</div>
        <div className="col-xs-4 col-sm-3">{renderDice("Roll D8", d8)}</div>
        <div className="col-xs-4 col-sm-3">{renderDice("Roll D10", d10)}</div>
        <div className="col-xs-4 col-sm-3">{renderDice("Roll D12", d12)}</div>
        <div className="col-xs-4 col-sm-3">{renderDice("Roll D20", d20)}</div>
      </div>
    </div>
  );

  function renderDice(
    label: string,
    dice: { value: any; isRolling?: boolean; roll: any }
  ) {
    return (
      <div className="row center-xs">
        <div className="col-xs-12">
          <Button
            variant="contained"
            color="primary"
            disabled={dice.isRolling}
            onClick={async () => {
              dice.roll();
            }}
          >
            {label}
          </Button>
        </div>
        <div className="col-xs-12">
          <Dice size={1}>{dice.value}</Dice>
        </div>
      </div>
    );
  }
};
