type IDiceGroup = {
  criticalSuccess?: number;
  criticalFailure?: number;
  goodRoll: number;
  badRoll: number;
  numberOfDice: number;
  sides: Array<number>;
};

export type IDiceRollType = "4dF" | "1dF" | "2d6" | "coin-toss";

export const DiceGroups: Record<IDiceRollType, IDiceGroup> = {
  "4dF": {
    criticalSuccess: 4,
    criticalFailure: -4,
    goodRoll: 3,
    badRoll: -3,
    numberOfDice: 4,
    sides: [-1, -1, 0, 0, 1, 1],
  },
  "1dF": {
    goodRoll: 1,
    badRoll: -1,
    numberOfDice: 1,
    sides: [-1, -1, 0, 0, 1, 1],
  },
  "coin-toss": {
    goodRoll: 1,
    badRoll: -1,
    numberOfDice: 1,
    sides: [-1, 1],
  },
  "2d6": {
    criticalSuccess: 12,
    criticalFailure: 2,
    goodRoll: 7,
    badRoll: 6,
    numberOfDice: 2,
    sides: [1, 2, 3, 4, 5, 6],
  },
};

export type IRollDiceOptions = {
  bonus?: number;
  bonusLabel?: string;
};

type IDiceRoll = {
  total: number;
  rolls: Array<number>;
  type: IDiceRollType;
};

export type IDiceRollWithBonus = IDiceRoll & {
  bonus?: number;
  bonusLabel?: string;
};

export function rollDice(type: IDiceRollType): IDiceRoll {
  const diceGroup = DiceGroups[type];
  const times = diceGroup.numberOfDice;
  const sides = diceGroup.sides;

  let total = 0;
  const rolls = [];

  for (let i = 0; i < times; i++) {
    const side = getRandomDiceSide(sides.length);
    const result = sides[side];
    rolls.push(result);
    total += result;
  }

  return { total, rolls, type };
}

function getRandomDiceSide(numberOfSides: number): number {
  return Math.trunc(Math.random() * numberOfSides);
}
