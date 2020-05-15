import { useTheme } from "@material-ui/core";
import confetti from "canvas-confetti";
import { useEffect, useRef, useState } from "react";
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
            fireConfetti(true);
          } else if (!rolling && realRoll?.total <= -3) {
            fireConfetti(false);
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

function fireConfetti(good: boolean) {
  try {
    const colors = good ? undefined : ["#bb0000"];
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: colors,
    });
    fire(0.2, {
      spread: 60,
      colors: colors,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      colors: colors,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      colors: colors,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: colors,
    });
  } catch (error) {
    console.error(error);
  }
}

function fire(
  particleRatio: number,
  options: {
    colors: Array<string>;
    spread: number;
    startVelocity?: number;
    decay?: number;
  }
) {
  /**
   * https://www.kirilv.com/canvas-confetti/
   */
  confetti({
    origin: { y: 0.7 },
    particleCount: Math.floor(200 * particleRatio),
    ...options,
  });
}
