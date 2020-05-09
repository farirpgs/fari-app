import { useTheme } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import { Dice } from "../../domains/dice/Dice";

export function useFudgeDice(rolls: Array<number>) {
  const [realRoll] = rolls;

  const theme = useTheme();
  const [roll, setRoll] = useState<number>(undefined);
  const [rolling, setRolling] = useState(false);
  const [color, setColor] = useState("inherit");
  const refreshCount = useRef(0);
  const hasRolledOnce = roll !== undefined;

  useEffect(() => {
    let newColor = "inherit";
    if (rolling) {
      newColor = "inherit";
    } else if (realRoll >= 3) {
      newColor = theme.palette.success.main;
    } else if (realRoll <= -3) {
      newColor = theme.palette.error.main;
    }
    setColor(newColor);
  }, [rolling, realRoll]);

  useEffect(() => {
    let intervalId: NodeJS.Timer = undefined;
    if (realRoll !== undefined) {
      setRolling(true);
      intervalId = setInterval(() => {
        if (refreshCount.current !== 50) {
          const fakeRoll = Dice.rollFudgeDice();
          refreshCount.current++;
          setRoll(fakeRoll);
        } else {
          clearInterval(intervalId);
          setRolling(false);
          refreshCount.current = 0;
          setRoll(realRoll);
        }
      }, 25);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [rolls.length]);

  return {
    state: {
      roll,
      rolling,
      hasRolledOnce,
      color,
    },
  };
}
