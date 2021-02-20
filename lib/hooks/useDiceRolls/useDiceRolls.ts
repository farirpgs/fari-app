import useTheme from "@material-ui/core/styles/useTheme";
import { useEffect, useRef, useState } from "react";
import { Confetti } from "../../domains/confetti/Confetti";
import { Dice, IDiceRollWithBonus } from "../../domains/dice/Dice";

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

  const finalResultRolls = finalResult?.commandResults ?? [];
  const finalResultBonus = finalResult?.bonus ?? 0;
  const finalResultBonusLabel = finalResult?.bonusLabel ?? "";
  const finalResultTotal = formatDiceNumber(finalResult, finalResultBonus);

  const finalResultHidden = rolling || !finalResult;

  useEffect(
    function handleSetResultColor() {
      const commandGroup = Dice.findMatchingCommandGroupWithDiceResult(
        latestPlayerRoll
      );

      let newColor = "inherit";
      if (rolling) {
        newColor = "inherit";
      } else if (
        commandGroup?.goodRoll &&
        latestPlayerRoll?.total >= commandGroup?.goodRoll
      ) {
        newColor = theme.palette.success.main;
      } else if (
        commandGroup?.badRoll &&
        latestPlayerRoll?.total <= commandGroup?.badRoll
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
    const commandGroup = Dice.findMatchingCommandGroupWithDiceResult(
      latestPlayerRoll
    );
    options?.onRolling?.(false);
    setRolling(false);
    setFinalResult(latestPlayerRoll);
    options?.onFinalResult?.(latestPlayerRoll);
    if (
      commandGroup?.criticalSuccess !== undefined &&
      latestPlayerRoll?.total === commandGroup?.criticalSuccess
    ) {
      Confetti.fireConfetti();
    } else if (
      commandGroup?.criticalFailure !== undefined &&
      latestPlayerRoll?.total === commandGroup?.criticalFailure
    ) {
      Confetti.fireCannon();
    }
  }

  return {
    state: {
      finalResultTotal,
      finalResultRolls,
      finalResultHidden,
      finalResultBonus,
      finalResultBonusLabel,
      rolling,
      hasRolledOnce,
      color,
    },
  };
}

export function formatDiceNumber(
  result: IDiceRollWithBonus | undefined,
  bonus: number = 0
): string {
  const containsFateDice = result?.commandResults.some((r) => r.type === "1dF");
  const total = result?.total ?? 0;
  const totalWithBonus = total + bonus;

  if (containsFateDice && totalWithBonus > 0) {
    return `+${totalWithBonus}`;
  }

  return totalWithBonus.toString();
}
