import React, { useContext, useState } from "react";
import {
  Dice,
  IDiceCommandNames,
  IDiceRollWithBonus,
  IRollDiceOptions,
} from "../../domains/dice/Dice";

export type IDiceManager = ReturnType<typeof useDice>;

export const DiceContext = React.createContext<IDiceManager>(undefined as any);

export function useDice() {
  const [selectedCommands, setSelectedCommands] = useState<
    Array<IDiceCommandNames>
  >(["1dF", "1dF", "1dF", "1dF"]);

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

    return { ...result, bonus: options.bonus, bonusLabel: options.bonusLabel };
  }

  return roll;
}

export function useRollDiceWithCommands() {
  function roll(
    options: IRollDiceOptions,
    commands: Array<IDiceCommandNames>
  ): IDiceRollWithBonus {
    const result = Dice.rollCommands(commands);

    return { ...result, bonus: options.bonus, bonusLabel: options.bonusLabel };
  }

  return roll;
}
