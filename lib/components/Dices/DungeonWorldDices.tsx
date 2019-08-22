import Button from "@material-ui/core/Button";
import React from "react";
import { useNumber } from "../../hooks/useNumber";
import { Dice } from "./Dice";

export const DungeonWorldDices = props => {
  const firstD6 = useNumber(6);
  const secondD6 = useNumber(6);
  return (
    <div>
      <div className="row center-xs">
        <div className="col-xs-12">
          <Button
            variant="contained"
            color="primary"
            disabled={firstD6.isRolling}
            onClick={async () => {
              firstD6.roll();
              secondD6.roll();
            }}
          >
            Roll
          </Button>
        </div>
      </div>

      <div className="row center-xs">
        <div className="col-xs col-sm-3">
          <Dice size={1}>{firstD6.value}</Dice>
        </div>
        <div className="col-xs col-sm-3">
          <Dice size={1}>{secondD6.value}</Dice>
        </div>
      </div>
    </div>
  );
};
