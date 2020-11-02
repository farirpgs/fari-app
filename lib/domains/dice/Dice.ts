import { IDiceRoll } from "./IDiceRoll";

const fudgeDie = [-1, -1, 0, 0, 1, 1];

export type IRollDiceOptions = {
  bonus?: number;
  bonusLabel?: string;
};

export const Dice = {
  roll4DF(options: IRollDiceOptions): IDiceRoll {
    const result = rollDice(fudgeDie, 4);
    return { ...result, bonus: options.bonus, bonusLabel: options.bonusLabel };
  },
};

function rollDice(die: Array<number>, times: number): IDiceRoll {
  let total = 0;
  const rolls = [];
  for (let i = 0; i < times; i++) {
    const side = getRandomDiceSide(die.length);
    const result = die[side];
    rolls.push(result);
    total += result;
  }

  return { total, rolls };
}

function getRandomDiceSide(numberOfSides: number): number {
  return Math.trunc(Math.random() * numberOfSides);
}
