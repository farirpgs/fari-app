import isEqual from "lodash/isEqual";
import { Icons } from "../Icons/Icons";

export type IDiceCommandGroup = {
  label: string;
  icon: React.ElementType;
  value: Array<IDiceCommandNames>;
  goodRoll?: number;
  badRoll?: number;
  criticalSuccess?: number;
  criticalFailure?: number;
};

export const FateDiceCommandGroups: Array<IDiceCommandGroup> = [
  {
    label: "4dF",
    icon: Icons.FateDice,
    value: ["1dF", "1dF", "1dF", "1dF"],
    goodRoll: 3,
    badRoll: -3,
    criticalSuccess: 4,
    criticalFailure: -4,
  },
  { label: "1dF", icon: Icons.OneDie, value: ["1dF"] },
];

export const d20DiceCommandGroups: Array<IDiceCommandGroup> = [
  { label: "1d4", icon: Icons.Dice4, value: ["1d4"] },
  { label: "1d6", icon: Icons.Dice6, value: ["1d6"] },
  { label: "1d8", icon: Icons.Dice8, value: ["1d8"] },
  { label: "1d10", icon: Icons.Dice10, value: ["1d10"] },
  { label: "1d12", icon: Icons.Dice12, value: ["1d12"] },
  {
    label: "1d20",
    icon: Icons.Dice20,
    value: ["1d20"],
    goodRoll: 17,
    badRoll: 3,
    criticalSuccess: 20,
    criticalFailure: 1,
  },
  { label: "1d100", icon: Icons.Dice100, value: ["1d100"] },
];

export const MiscDiceCommandGroups: Array<IDiceCommandGroup> = [
  { label: "Coin Toss", icon: Icons.Coin, value: ["Coin"] },
  {
    label: "2d6",
    icon: Icons.RollDiceIcon,
    value: ["1d6", "1d6"],
    goodRoll: 7,
    badRoll: 6,
    criticalSuccess: 12,
    criticalFailure: 2,
  },
];

export const AllDiceCommandGroups: Array<IDiceCommandGroup> = [
  ...FateDiceCommandGroups,
  ...d20DiceCommandGroups,
  ...MiscDiceCommandGroups,
];

const FateDie = [-1, -1, 0, 0, 1, 1];
const CoinToss = [-1, 1];
const FourSidedDie = makeNormalDie(4);
const SixSidedDie = makeNormalDie(6);
const HeightSidedDie = makeNormalDie(8);
const TenSidedDie = makeNormalDie(10);
const TwelveSidedDie = makeNormalDie(12);
const TwentySidedDie = makeNormalDie(20);
const HundredSidedDie = makeNormalDie(100);

export type IDiceCommandNames =
  | "1dF"
  | "1d4"
  | "1d6"
  | "1d8"
  | "1d10"
  | "1d12"
  | "1d20"
  | "1d100"
  | "Coin";

type IDiceCommandOptions = {
  sides: Array<number>;
  formatDetailedResult: (value: number) => string;
};

export const DiceCommandOptions: Record<
  IDiceCommandNames,
  IDiceCommandOptions
> = {
  "1dF": {
    sides: FateDie,
    formatDetailedResult: formatFateDie,
  },
  "1d4": {
    sides: FourSidedDie,
    formatDetailedResult: formatNormalDie,
  },
  "1d6": {
    sides: SixSidedDie,
    formatDetailedResult: formatNormalDie,
  },
  "1d8": {
    sides: HeightSidedDie,
    formatDetailedResult: formatNormalDie,
  },
  "1d10": {
    sides: TenSidedDie,
    formatDetailedResult: formatNormalDie,
  },
  "1d12": {
    sides: TwelveSidedDie,
    formatDetailedResult: formatNormalDie,
  },
  "1d20": {
    sides: TwentySidedDie,
    formatDetailedResult: formatNormalDie,
  },
  "1d100": {
    sides: HundredSidedDie,
    formatDetailedResult: formatNormalDie,
  },
  "Coin": {
    sides: CoinToss,
    formatDetailedResult: (value: number) => {
      if (value === 1) {
        return "Heads";
      }
      return "Tails";
    },
  },
};

export type IRollDiceOptions = {
  bonus?: number;
  bonusLabel?: string;
};

export type IDiceRoll = {
  type: IDiceCommandNames;
  value: number;
};

export type IDiceRollResult = {
  total: number;
  commandResults: Array<IDiceRoll>;
};

export type IDiceRollWithBonus = IDiceRollResult & {
  bonus?: number;
  bonusLabel?: string;
};

export function rollComplexDiceTypes(
  types: Array<IDiceCommandNames>
): IDiceRollResult {
  let total = 0;
  const rolls: Array<IDiceRoll> = [];

  types.forEach((t) => {
    const diceGroup = DiceCommandOptions[t];

    const sides = diceGroup.sides;
    const side = getRandomDiceSide(sides.length);
    const result = sides[side];

    rolls.push({
      type: t,
      value: result,
    });
    total += result;
  });

  return { total, commandResults: rolls };
}

export function findMatchingCommandGroupWithDiceResult(
  result: IDiceRollResult | undefined
) {
  const commands = result?.commandResults.flatMap((cr) => cr.type);
  return findMatchingCommandGroupWithDiceTypes(commands);
}

export function findMatchingCommandGroupWithDiceTypes(
  commands: IDiceCommandNames[] | undefined
) {
  const commandGroup = AllDiceCommandGroups.find((cg) =>
    isEqual(cg.value, commands)
  );
  return commandGroup;
}

function getRandomDiceSide(numberOfSides: number): number {
  return Math.trunc(Math.random() * numberOfSides);
}

function makeNormalDie(sides: number) {
  return new Array(sides).fill(0).map((el, i) => {
    return i + 1;
  });
}

function formatFateDie(value: number) {
  const symbolMap: Record<string, string> = { "-1": "-", "0": "0", "1": "+" };
  return symbolMap[value];
}

function formatNormalDie(value: number) {
  return value.toString();
}
