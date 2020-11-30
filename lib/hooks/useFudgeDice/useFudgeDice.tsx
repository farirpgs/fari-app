import useTheme from "@material-ui/core/styles/useTheme";
import { useEffect, useRef, useState } from "react";
import { Confetti } from "../../domains/confetti/Confetti";
import { IDiceRoll } from "../../domains/dice/IDiceRoll";

const diceMap: Record<string, string> = {
  "-1": "[-]",
  "0": "[ ]",
  "1": "[+]",
} as const;

const rollingDelay = 1000;

function usePrevious<T>(value: T) {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useFudgeDice(
  rolls: Array<IDiceRoll>,
  options?: {
    onRolling?(rolling: boolean): void;
    onFinalResult?: (realRoll: IDiceRoll) => void;
  }
) {
  const previousRolls = usePrevious(rolls);
  const [realRoll] = rolls;

  const theme = useTheme();
  const [roll, setRoll] = useState<IDiceRoll | undefined>(undefined);
  const [rolling, setRolling] = useState(false);
  const [color, setColor] = useState("inherit");
  const hasRolledOnce = roll !== undefined;

  const bonus = roll?.bonus ?? 0;
  const bonusLabel = roll?.bonusLabel ?? "";
  const total = roll?.total ?? 0;

  const rollsForSignes = roll?.rolls ?? [];
  const rollSigns = rollsForSignes
    .map((r) => {
      return diceMap[r];
    })
    .join(" ");

  const shouldDisplay = rolling || !roll;
  const hasBonus = !!roll?.bonusLabel;

  const label = shouldDisplay ? "" : formatDiceNumber(total + bonus);
  const tooltipTitle = shouldDisplay ? "" : `${rollSigns} (${total})` ?? "";
  const tooltipDescription =
    rolling || !hasBonus ? "" : `${bonusLabel} (${formatDiceNumber(bonus)})`;

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
    options?.onRolling?.(true);
    setRolling(true);
    setRoll(undefined);
  }

  function setFinalResult() {
    options?.onRolling?.(false);
    setRolling(false);
    setRoll(realRoll);
    options?.onFinalResult?.(realRoll);

    if (realRoll?.total === 4) {
      Confetti.fireConfetti();
    } else if (realRoll?.total === -4) {
      Confetti.fireCannon();
    }
  }

  useEffect(() => {
    let timeout: NodeJS.Timer | undefined = undefined;
    const isFirstLoad = previousRolls?.length === rolls.length;

    if (isFirstLoad) {
      setFinalResult();
      return;
    }
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
      tooltipTitle: tooltipTitle,
      tooltipDescription: tooltipDescription,
      rolling,
      hasRolledOnce,
      color,
    },
  };
}

export function formatDiceNumber(n: number): string {
  if (n > 0) {
    return `+${n}`;
  }
  return n.toString();
}
