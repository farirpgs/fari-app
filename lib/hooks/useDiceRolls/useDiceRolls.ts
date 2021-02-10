import useTheme from "@material-ui/core/styles/useTheme";
import { useEffect, useRef, useState } from "react";
import { Confetti } from "../../domains/confetti/Confetti";
import {
  DiceGroups,
  IDiceRollType,
  IDiceRollWithBonus,
} from "../../domains/dice/Dice";

const rollingDelay = 1000;

function usePrevious<T>(value: T) {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useDiceRolls(
  playerRolls: Array<IDiceRollWithBonus>,
  options?: {
    onRolling?(rolling: boolean): void;
    onFinalResult?: (realRoll: IDiceRollWithBonus) => void;
  }
) {
  const theme = useTheme();

  const previousRolls = usePrevious(playerRolls);
  const [latestPlayerRoll] = playerRolls;
  const [finalResult, setFinalResult] = useState<
    IDiceRollWithBonus | undefined
  >(undefined);
  const [rolling, setRolling] = useState(false);
  const [color, setColor] = useState("inherit");

  const hasRolledOnce = finalResult !== undefined;

  const finalResultRolls = finalResult?.rolls ?? [];
  const finalResultTotal = finalResult?.total ?? 0;
  const finalResultBonus = finalResult?.bonus ?? 0;
  const finalResultBonusLabel = finalResult?.bonusLabel ?? "";

  const finalResultType = finalResult?.type;
  const finalResultDiceGroup = DiceGroups[latestPlayerRoll?.type];

  const finalResultFormatted = formatDiceNumber(
    finalResultTotal + finalResultBonus,
    finalResultType
  );

  const finalResultSpread = finalResultDiceGroup?.formatDetailedResult(
    finalResultRolls
  );
  const finalResultExplanation = finalResultBonus
    ? `${finalResultType} + ${finalResultBonus} (${finalResultBonusLabel})`
    : finalResultType;

  const finalResultHidden = rolling || !finalResult;

  useEffect(
    function handleSetResultColor() {
      const diceGroup = DiceGroups[latestPlayerRoll?.type];
      let newColor = "inherit";
      if (rolling) {
        newColor = "inherit";
      } else if (
        diceGroup?.goodRoll &&
        latestPlayerRoll?.total >= diceGroup?.goodRoll
      ) {
        newColor = theme.palette.success.main;
      } else if (
        diceGroup?.badRoll &&
        latestPlayerRoll?.total <= diceGroup?.badRoll
      ) {
        newColor = theme.palette.error.main;
      }
      setColor(newColor);
    },
    [rolling, latestPlayerRoll]
  );

  useEffect(
    function handlePlayerRolled() {
      let timeout: NodeJS.Timer | undefined = undefined;
      const isFirstLoad = previousRolls?.length === playerRolls.length;

      if (isFirstLoad) {
        handleSetFinalResult();
        return;
      }
      if (latestPlayerRoll !== undefined) {
        handleIsRolling();
        timeout = setTimeout(() => {
          handleSetFinalResult();
        }, rollingDelay);
      }
      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    },
    [playerRolls.length]
  );

  function handleIsRolling() {
    options?.onRolling?.(true);
    setRolling(true);
    setFinalResult(undefined);
  }

  function handleSetFinalResult() {
    const diceGroup = DiceGroups[latestPlayerRoll?.type];
    options?.onRolling?.(false);
    setRolling(false);
    setFinalResult(latestPlayerRoll);
    options?.onFinalResult?.(latestPlayerRoll);
    if (
      diceGroup?.criticalSuccess !== undefined &&
      latestPlayerRoll?.total === diceGroup?.criticalSuccess
    ) {
      Confetti.fireConfetti();
    } else if (
      diceGroup?.criticalFailure !== undefined &&
      latestPlayerRoll?.total === diceGroup?.criticalFailure
    ) {
      Confetti.fireCannon();
    }
  }

  return {
    state: {
      display: {
        formatted: finalResultFormatted,
        spreaded: finalResultSpread,
        explanation: finalResultExplanation,
        type: finalResultType,
      },
      finalResultHidden,
      finalResultBonus,
      finalResultBonusLabel,
      type: finalResultType,
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
