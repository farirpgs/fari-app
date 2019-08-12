import Button from "@material-ui/core/Button";
import React from "react";
import { useNumber } from "../../hooks/useNumber";
import { Dice } from "./Dice";
export const DungeonWorldDices = props => {
  const firstD6 = useNumber(6);
  const secondD6 = useNumber(6);
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={async () => {
          firstD6.roll();
          secondD6.roll();
        }}
      >
        Roll
      </Button>

      <div className="row">
        <div className="col-xs-1">
          <Dice size={1}>{firstD6.value}</Dice>
        </div>
        <div className="col-xs-1">
          <Dice size={1}>{secondD6.value}</Dice>
        </div>
      </div>
    </div>
  );
};
