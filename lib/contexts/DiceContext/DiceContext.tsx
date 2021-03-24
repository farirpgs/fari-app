import React, { useContext, useState } from "react";
import {
  Dice,
  IDiceCommandNames,
  IDiceRollResult,
  IRollDiceOptions,
} from "../../domains/dice/Dice";

export type IDiceManager = ReturnType<typeof useDice>;

export const DiceContext = React.createContext<IDiceManager>(undefined as any);

const DefaultCommands: Array<IDiceCommandNames> = ["1dF", "1dF", "1dF", "1dF"];
// const DefaultCommands: Array<IDiceCommandNames> = [
//   "1d4",
//   "1d6",
//   "1d8",
//   "1d10",
//   "1d12",
//   "1d20",
//   "1d4",
//   "1d6",
//   "1d8",
//   "1d10",
//   "1d12",
//   "1d20",
// ];

export function useDice() {
  const [selectedCommands, setSelectedCommands] = useState<
    Array<IDiceCommandNames>
  >(DefaultCommands);

  const reset = () => {
    setSelectedCommands(["1dF", "1dF", "1dF", "1dF"]);
  };

  return {
    state: { selectedCommands: selectedCommands },
    actions: { setSelectedCommands: setSelectedCommands, reset },
  };
}

export function useRollDiceFromContext() {
  const diceManager = useContext(DiceContext);

  function roll(options: IRollDiceOptions): IDiceRollResult {
    const result = Dice.rollCommandNameList(
      diceManager.state.selectedCommands,
      options
    );
    return result;
  }

  return roll;
}
