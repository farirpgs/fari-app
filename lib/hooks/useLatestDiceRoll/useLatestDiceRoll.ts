import { darken, useTheme } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { Confetti } from "../../domains/confetti/Confetti";
import { Dice, IDiceRollResult } from "../../domains/dice/Dice";

const rollingDelay = 1000;

function usePrevious<T>(value: T) {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useLatestDiceRoll(
  playerRolls: Array<IDiceRollResult>,
  options?: {
    disableConfettis: boolean;
    onRolling?(rolling: boolean): void;
    onFinalResult?: (realRoll: IDiceRollResult) => void;
  }
) {
  const theme = useTheme();

  const previousRolls = usePrevious(playerRolls);
  const [latestPlayerRoll] = playerRolls;
  const [finalResult, setFinalResult] = useState<IDiceRollResult | undefined>(
    undefined
  );
  const [rolling, setRolling] = useState(false);
  const [color, setColor] = useState(theme.palette.background.paper);

  const hasRolledOnce = finalResult !== undefined;

  const finalRollGroups = finalResult?.rollGroups ?? [];
  const finalResultTotal = formatDiceNumber(finalResult);

  const finalResultHidden = rolling || !finalResult;

  useEffect(
    function handleSetResultColor() {
      const commandGroup =
        Dice.findCommandGroupOptionsMatchForResult(latestPlayerRoll);

      if (!latestPlayerRoll || rolling) {
        setColor(theme.palette.background.paper);
      } else if (
        commandGroup?.goodRoll &&
        latestPlayerRoll?.totalWithoutModifiers >= commandGroup?.goodRoll &&
        !latestPlayerRoll.options.listResults
      ) {
        setColor(darken(theme.palette.success.main, 0.2));
      } else if (
        commandGroup?.badRoll &&
        latestPlayerRoll?.totalWithoutModifiers <= commandGroup?.badRoll &&
        !latestPlayerRoll.options.listResults
      ) {
        setColor(darken(theme.palette.error.main, 0.2));
      } else {
        setColor(theme.palette.primary.main);
      }
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
          setRolling(false);
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
    const commandGroup =
      Dice.findCommandGroupOptionsMatchForResult(latestPlayerRoll);
    options?.onRolling?.(false);
    setRolling(false);
    setFinalResult(latestPlayerRoll);
    options?.onFinalResult?.(latestPlayerRoll);
    const isPool = latestPlayerRoll?.options?.listResults;

    if (options?.disableConfettis || isPool) {
      return;
    }
    if (
      commandGroup?.criticalSuccess !== undefined &&
      latestPlayerRoll?.totalWithoutModifiers === commandGroup?.criticalSuccess
    ) {
      Confetti.fireConfetti();
    } else if (
      commandGroup?.criticalFailure !== undefined &&
      latestPlayerRoll?.totalWithoutModifiers === commandGroup?.criticalFailure
    ) {
      Confetti.fireCannon();
    }
  }

  return {
    state: {
      finalResult,
      finalResultTotal,
      finalResultRolls: finalRollGroups,
      finalResultHidden,
      rolling,
      hasRolledOnce,
      color,
    },
  };
}

export function formatDiceNumber(result: IDiceRollResult | undefined): string {
  const containsFateDice = result?.rollGroups
    .flatMap((rg) => rg.commandSets)
    .flatMap((cr) => cr.commands)
    .some((r) => r.name === "1dF");

  const total = result?.total ?? 0;

  if (containsFateDice && total > 0) {
    return `+${total}`;
  }

  return total.toString();
}
