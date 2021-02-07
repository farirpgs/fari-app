import useTheme from "@material-ui/core/styles/useTheme";
import { useContext, useEffect, useRef, useState } from "react";
import { DiceContext } from "../../contexts/DiceContext/DiceContext";
import { Confetti } from "../../domains/confetti/Confetti";
import {
  DiceGroups,
  IDiceRollType,
  IDiceRollWithBonus,
} from "../../domains/dice/Dice";

const diceMap: Record<IDiceRollType, Record<string, string>> = {
  "4dF": {
    "-1": "-",
    "0": "0",
    "1": "+",
  },
  "1dF": {
    "-1": "-",
    "0": "0",
    "1": "+",
  },
  "2d6": {},
  "coin-toss": {},
};

const rollingDelay = 1000;

function usePrevious<T>(value: T) {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useDiceRolls(
  rolls: Array<IDiceRollWithBonus>,
  options?: {
    onRolling?(rolling: boolean): void;
    onFinalResult?: (realRoll: IDiceRollWithBonus) => void;
  }
) {
  const previousRolls = usePrevious(rolls);
  const [realRoll] = rolls;
  const diceManager = useContext(DiceContext);

  const theme = useTheme();
  const [result, setResult] = useState<IDiceRollWithBonus | undefined>(
    undefined
  );
  const [rolling, setRolling] = useState(false);
  const [color, setColor] = useState("inherit");
  const hasRolledOnce = result !== undefined;

  const bonus = result?.bonus ?? 0;
  const bonusLabel = result?.bonusLabel ?? "";
  const total = result?.total ?? 0;

  const currentRolls = result?.rolls ?? [];
  const type = result?.type;
  const currentRollsWithSigns = currentRolls
    .map((r) => {
      return diceMap[type ?? ("" as IDiceRollType)][r] ?? `${r} `;
    })
    .join(type === "1dF" || type === "4dF" ? " " : " + ")
    .trim();

  const shouldDisplay = !rolling && !!result;

  const diceGroup = DiceGroups[realRoll?.type];
  const label = shouldDisplay
    ? formatDiceNumber(total + bonus, realRoll?.type)
    : "";
  const rollDetails =
    shouldDisplay && diceGroup.numberOfDice > 1 ? currentRollsWithSigns : "";
  const rollBonus = bonusLabel
    ? `${bonusLabel} (${formatDiceNumber(bonus, realRoll?.type)})`
    : "";

  useEffect(() => {
    const diceGroup = DiceGroups[realRoll?.type];
    let newColor = "inherit";
    if (rolling) {
      newColor = "inherit";
    } else if (realRoll?.total >= diceGroup?.goodRoll) {
      newColor = theme.palette.success.main;
    } else if (realRoll?.total <= diceGroup?.badRoll) {
      newColor = theme.palette.error.main;
    }
    setColor(newColor);
  }, [rolling, realRoll]);

  function setRollingState() {
    options?.onRolling?.(true);
    setRolling(true);
    setResult(undefined);
  }

  function setFinalResult() {
    const diceGroup = DiceGroups[realRoll?.type];
    options?.onRolling?.(false);
    setRolling(false);
    setResult(realRoll);
    options?.onFinalResult?.(realRoll);
    if (
      diceGroup?.criticalSuccess !== undefined &&
      realRoll?.total === diceGroup?.criticalSuccess
    ) {
      Confetti.fireConfetti();
    } else if (
      diceGroup?.criticalFailure !== undefined &&
      realRoll?.total === diceGroup?.criticalFailure
    ) {
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
      shouldDisplay,
      total: total,
      rollDetails: rollDetails,
      rollBonus: rollBonus,
      type: type,
      rolling,
      hasRolledOnce,
      color,
    },
  };
}

export function formatDiceNumber(
  n: number,
  type: IDiceRollType = "4dF"
): string {
  if (type !== "1dF" && type !== "4dF") {
    return n.toString();
  }
  if (n > 0) {
    return `+${n}`;
  }
  return n.toString();
}
