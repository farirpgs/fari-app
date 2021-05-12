import useTheme from "@material-ui/core/styles/useTheme";
import { useEffect, useRef, useState } from "react";
import { Confetti } from "../../domains/confetti/Confetti";
import { Dice, IDiceRollResult, RollType } from "../../domains/dice/Dice";

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
  const [color, setColor] = useState("inherit");

  const hasRolledOnce = finalResult !== undefined;

  const finalResultRolls = finalResult?.commandResult ?? [];

  const finalResultLabel = finalResultRolls
    .map((r) => (r.type === RollType.Modifier ? r.label : undefined))
    .join("/");

  const finalResultTotal = formatDiceNumber(finalResult);

  const finalResultHidden = rolling || !finalResult;

  useEffect(
    function handleSetResultColor() {
      const commandGroup = Dice.findMatchingCommandGroupWithDiceResult(
        latestPlayerRoll
      );

      let newColor = "inherit";

      const isPool = latestPlayerRoll?.options?.listResults;

      if (rolling || isPool) {
        newColor = "inherit";
      } else if (
        commandGroup?.goodRoll &&
        latestPlayerRoll?.totalWithoutModifiers >= commandGroup?.goodRoll
      ) {
        newColor = theme.palette.success.main;
      } else if (
        commandGroup?.badRoll &&
        latestPlayerRoll?.totalWithoutModifiers <= commandGroup?.badRoll
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
      finalResultRolls,
      finalResultHidden,
      finalResultLabel,
      rolling,
      hasRolledOnce,
      color,
    },
  };
}

export function formatDiceNumber(result: IDiceRollResult | undefined): string {
  const containsFateDice = result?.commandResult.some(
    (r) => r.type === RollType.DiceCommand && r.commandName === "1dF"
  );

  const total = result?.total ?? 0;

  if (containsFateDice && total > 0) {
    return `+${total}`;
  }

  return total.toString();
}
