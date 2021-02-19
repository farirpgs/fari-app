import React, { useContext, useState } from "react";
import {
  IDiceCommandNames,
  IDiceRollWithBonus,
  IRollDiceOptions,
  rollComplexDiceTypes,
} from "../../domains/dice/Dice";

export type IDiceManager = ReturnType<typeof useDice>;

export const DiceContext = React.createContext<IDiceManager>(undefined as any);

export function useDice() {
  const [diceTypes, setDiceTypes] = useState<Array<IDiceCommandNames>>([
    "1dF",
    "1dF",
    "1dF",
    "1dF",
  ]);

  const reset = () => {
    setDiceTypes(["1dF", "1dF", "1dF", "1dF"]);
  };

  return { state: { diceTypes }, actions: { setDiceTypes, reset } };
}

export function useRollDice() {
  const diceManager = useContext(DiceContext);

  function roll(options: IRollDiceOptions = {}): IDiceRollWithBonus {
    const result = rollComplexDiceTypes(diceManager.state.diceTypes);

    return { ...result, bonus: options.bonus, bonusLabel: options.bonusLabel };
  }

  return roll;
}
