import { IDiceRoll } from "./IDiceRoll";

const fudgeDie = [-1, -1, 0, 0, 1, 1];

export const Dice = {
  roll4DF(): IDiceRoll {
    const result = rollDie(fudgeDie, 4);
    return result;
  },
};

function rollDie(die: Array<number>, times: number): IDiceRoll {
  let total = 0;
  const rolls = [];
  for (let i = 0; i < times; i++) {
    const side = getRandomDieSide(die.length);
    const result = die[side];
    rolls.push(result);
    total += result;
  }

  return { total, rolls };
}

function getRandomDieSide(numberOfSides: number): number {
  return Math.trunc(Math.random() * numberOfSides);
}
