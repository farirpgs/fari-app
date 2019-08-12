import Button from "@material-ui/core/Button";
import React, { useState } from "react";
import { Dice } from "./Dice";

const FudgeTypes = {
  0: "",
  1: "+",
  2: "-"
};

function useFudge() {
  const [value, setValue] = useState("");
  const rollAnimationCount = 50;
  function roll(count = 0) {
    const number = Math.floor((Math.random() * 100) % 3);
    setValue(FudgeTypes[number]);
    if (count !== rollAnimationCount) {
      setTimeout(() => {
        roll(count + 1);
      }, 25);
    }
  }
  function reset() {
    setValue("");
  }
  return {
    value,
    reset,
    roll
  };
}

export const FudgeDices = props => {
  const fudge1 = useFudge();
  const fudge2 = useFudge();
  const fudge3 = useFudge();
  const fudge4 = useFudge();

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={async () => {
          fudge1.roll();
          fudge2.roll();
          fudge3.roll();
          fudge4.roll();
        }}
      >
        Roll
      </Button>

      <div className="row">
        <div className="col-xs-1">
          <Dice size={1}>{fudge1.value}</Dice>
        </div>
        <div className="col-xs-1">
          <Dice size={1}>{fudge2.value}</Dice>
        </div>
        <div className="col-xs-1">
          <Dice size={1}>{fudge3.value}</Dice>
        </div>
        <div className="col-xs-1">
          <Dice size={1}>{fudge4.value}</Dice>
        </div>
      </div>
    </div>
  );
};
