import { useTheme } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import { Confetti } from "../../domains/confetti/Confetti";
import { Dice } from "../../domains/dice/Dice";
import { IDiceRoll } from "../../domains/dice/IDiceRoll";

const diceMap = {
  "-1": "-",
  "0": "o",
  "1": "+",
};
export function useFudgeDice(rolls: Array<IDiceRoll>) {
  const [realRoll] = rolls;

  const theme = useTheme();
  const [roll, setRoll] = useState<IDiceRoll>(undefined);
  const [rolling, setRolling] = useState(false);
  const [color, setColor] = useState("inherit");
  const refreshCount = useRef(0);
  const hasRolledOnce = roll !== undefined;

  const label = roll?.total ?? "";
  const rollSigns = roll?.rolls
    .map((r) => {
      return diceMap[r];
    })
    .join(" ");
  const tooltip = rolling ? "" : rollSigns ?? "";

  useEffect(() => {
    let newColor = "inherit";
    if (rolling) {
      newColor = "inherit";
    } else if (realRoll?.total >= 3) {
      newColor = theme.palette.success.main;
    } else if (realRoll?.total <= -3) {
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
          const fakeRoll = Dice.roll4DF();
          refreshCount.current++;
          setRoll(fakeRoll);
        } else {
          clearInterval(intervalId);
          setRolling(false);
          refreshCount.current = 0;
          setRoll(realRoll);
          if (realRoll?.total >= 3) {
            Confetti.fireConfetti();
          } else if (!rolling && realRoll?.total <= -3) {
            Confetti.fireCannon();
          }
        }
      }, 25);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [rolls.length]);

  return {
    state: {
      label,
      tooltip,
      rolling,
      hasRolledOnce,
      color,
    },
  };
}
