import React, { useContext, useState } from "react";
import {
  IDiceRollType,
  IDiceRollWithBonus,
  IRollDiceOptions,
  rollDice,
} from "../../domains/dice/Dice";

export const DiceContext = React.createContext<ReturnType<typeof useDice>>(
  undefined as any
);

export function useDice() {
  const [diceType, setDiceType] = useState<IDiceRollType>("4dF");

  return { state: { diceType }, actions: { setDiceType } };
}

export function useRollDice() {
  const diceManager = useContext(DiceContext);

  function roll(options: IRollDiceOptions = {}): IDiceRollWithBonus {
    const result = rollDice(diceManager.state.diceType);

    return { ...result, bonus: options.bonus, bonusLabel: options.bonusLabel };
  }

  return roll;
}
