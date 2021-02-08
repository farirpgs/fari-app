type IDiceGroup = {
  criticalSuccess?: number;
  criticalFailure?: number;
  goodRoll?: number;
  badRoll?: number;
  numberOfDice: number;
  sides: Array<number>;
  formatDetailedResult: (detailedResult: Array<number>) => string;
};

export type IDiceRollType = "4dF" | "1dF" | "2d6" | "Coin" | "1d100";

const makeNormalDice = (sides: number) => {
  return new Array(sides).fill(0).map((el, i) => {
    return i + 1;
  });
};

const FateDie = [-1, -1, 0, 0, 1, 1];
const CoinToss = [-1, 1];
const SixSidedDie = makeNormalDice(6);
const HundredSideDie = makeNormalDice(100);

const formatDetailedResultFateDice = (detailedResult: Array<number>) => {
  const symbolMap: Record<string, string> = { "-1": "-", "0": "0", "1": "+" };
  return detailedResult
    .map((r) => {
      return symbolMap[r];
    })
    .join(" ")
    .trim();
};

export const DiceGroups: Record<IDiceRollType, IDiceGroup> = {
  "4dF": {
    criticalSuccess: 4,
    criticalFailure: -4,
    goodRoll: 3,
    badRoll: -3,
    numberOfDice: 4,
    sides: FateDie,
    formatDetailedResult: formatDetailedResultFateDice,
  },
  "1dF": {
    goodRoll: 1,
    badRoll: -1,
    numberOfDice: 1,
    sides: FateDie,
    formatDetailedResult: formatDetailedResultFateDice,
  },
  "Coin": {
    goodRoll: 1,
    badRoll: -1,
    numberOfDice: 1,
    sides: CoinToss,
    formatDetailedResult: (rolls: Array<number>) => {
      const [value] = rolls;
      if (value === 1) {
        return "Heads";
      }
      return "Tails";
    },
  },
  "2d6": {
    criticalSuccess: 12,
    criticalFailure: 2,
    goodRoll: 7,
    badRoll: 6,
    numberOfDice: 2,
    sides: SixSidedDie,
    formatDetailedResult: (detailedResult: Array<number>) => {
      return detailedResult.join(" + ").trim();
    },
  },
  "1d100": {
    numberOfDice: 1,
    sides: HundredSideDie,
    formatDetailedResult: (rolls: Array<number>) => {
      const [value] = rolls;
      return value?.toString();
    },
  },
};

export type IRollDiceOptions = {
  bonus?: number;
  bonusLabel?: string;
};

export type IDiceRoll = {
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
