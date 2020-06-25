import { useTheme } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Confetti } from "../../domains/confetti/Confetti";
import { IDiceRoll } from "../../domains/dice/IDiceRoll";

const diceMap: Record<string, string> = {
  "-1": "-",
  "0": "o",
  "1": "+",
} as const;

const rollingDelay = 1000;

export function useFudgeDice(rolls: Array<IDiceRoll>) {
  const [realRoll] = rolls;

  const theme = useTheme();
  const [roll, setRoll] = useState<IDiceRoll | undefined>(undefined);
  const [rolling, setRolling] = useState(false);
  const [color, setColor] = useState("inherit");
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

  function setRollingState() {
    setRolling(true);
    setRoll(undefined);
  }

  function setFinalResult() {
    setRolling(false);
    setRoll(realRoll);
    if (realRoll?.total === 4) {
      Confetti.fireConfetti();
    } else if (realRoll?.total === -4) {
      Confetti.fireCannon();
    }
  }

  useEffect(() => {
    let timeout: NodeJS.Timer | undefined = undefined;
    if (realRoll !== undefined) {
      setRollingState();
      timeout = setTimeout(() => {
        setFinalResult();
      }, rollingDelay);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
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
