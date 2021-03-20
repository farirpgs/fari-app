import React, { useContext, useState } from "react";
import {
  Dice,
  IDiceCommandNames,
  IDiceRollWithBonus,
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

export function useRollDice() {
  const diceManager = useContext(DiceContext);

  function roll(options: IRollDiceOptions): IDiceRollWithBonus {
    const result = Dice.rollCommands(diceManager.state.selectedCommands);

    return {
      ...result,
      bonus: options.bonus,
      bonusLabel: options.bonusLabel,
      pool: options.pool,
    };
  }

  return roll;
}

export function useRollDiceWithCommands() {
  function roll(
    options: IRollDiceOptions,
    commands: Array<IDiceCommandNames>
  ): IDiceRollWithBonus {
    const result = Dice.rollCommands(commands);

    return {
      ...result,
      bonus: options.bonus,
      bonusLabel: options.bonusLabel,
      pool: options.pool,
    };
  }

  return roll;
}
