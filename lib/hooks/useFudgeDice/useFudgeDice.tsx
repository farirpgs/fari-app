import { useTheme } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import { Dice } from "../../domains/dice/Dice";

export function useFudgeDice(rolls: Array<number>) {
  const theme = useTheme();
  const [roll, setRoll] = useState(undefined);
  const intervalId = useRef(undefined);
  const refreshCount = useRef(0);
  const finishedRolling = intervalId.current === undefined;
  const color = getColor();
  const [realRoll] = rolls;

  useEffect(() => {
    if (realRoll !== undefined) {
      intervalId.current = setInterval(() => {
        if (refreshCount.current !== 50) {
          const fakeRoll = Dice.rollFudgeDice();
          refreshCount.current++;
          setRoll(fakeRoll);
        } else {
          clearInterval(intervalId.current);
          intervalId.current = undefined;
          refreshCount.current = 0;
          setRoll(realRoll);
        }
      }, 25);
    }
    return () => {
      clearInterval(intervalId.current);
      intervalId.current = undefined;
    };
  }, [rolls.length]);

  function getColor() {
    if (!finishedRolling) {
      return "inherit";
    }
    if (roll >= 3) {
      return theme.palette.success.main;
    }
    if (roll <= -3) {
      return theme.palette.error.main;
    }
    return "inherit";
  }

  return {
    state: {
      roll,
      color,
      finishedRolling,
    },
  };
}
