import isEqual from "lodash/isEqual";
import startCase from "lodash/startCase";
import { Icons } from "../Icons/Icons";

export type IDiceCommandGroup = {
  id: IDiceCommandGroupId;
  label: string;
  icon: React.ElementType;
  value: Array<IDiceCommandNames>;
  goodRoll?: number;
  badRoll?: number;
  criticalSuccess?: number;
  criticalFailure?: number;
};

export type IDiceCommandNames =
  | "1dF"
  | "1d4"
  | "1d6"
  | "1d8"
  | "1d10"
  | "1d12"
  | "1d20"
  | "1d100"
  | "narrative-white"
  | "narrative-green"
  | "narrative-purple"
  | "narrative-yellow"
  | "narrative-red"
  | "narrative-blue"
  | "narrative-black"
  | "coin"
  | "card";

export type IDiceCommandGroupId = IDiceCommandNames | "4dF" | "2d6";

export const AllDiceCommandGroups: Record<
  IDiceCommandGroupId,
  IDiceCommandGroup
> = {
  "4dF": {
    id: "4dF",
    label: "4dF",
    icon: Icons.FateDice,
    value: ["1dF", "1dF", "1dF", "1dF"],
    goodRoll: 3,
    badRoll: -3,
    criticalSuccess: 4,
    criticalFailure: -4,
  },
  "1dF": {
    id: "1dF",
    label: "1dF",
    icon: Icons.OneDie,
    value: ["1dF"],
  },
  "1d4": {
    id: "1d4",
    label: "1d4",
    icon: Icons.Dice4,
    value: ["1d4"],
  },
  "1d6": {
    id: "1d6",
    label: "1d6",
    icon: Icons.Dice6,
    value: ["1d6"],
  },
  "1d8": {
    id: "1d8",
    label: "1d8",
    icon: Icons.Dice8,
    value: ["1d8"],
  },
  "1d10": {
    id: "1d10",
    label: "1d10",
    icon: Icons.Dice10,
    value: ["1d10"],
  },
  "1d12": {
    id: "1d12",
    label: "1d12",
    icon: Icons.Dice12,
    value: ["1d12"],
  },
  "1d20": {
    id: "1d20",
    label: "1d20",
    icon: Icons.Dice20,
    value: ["1d20"],
    goodRoll: 17,
    badRoll: 3,
    criticalSuccess: 20,
    criticalFailure: 1,
  },
  "narrative-white": {
    id: "narrative-white",
    label: "White",
    icon: Icons.BalanceIcon,
    value: ["narrative-white"],
  },
  "narrative-green": {
    id: "narrative-green",
    label: "Green",
    icon: Icons.BalanceIcon,
    value: ["narrative-green"],
  },
  "narrative-purple": {
    id: "narrative-purple",
    label: "Purple",
    icon: Icons.BalanceIcon,
    value: ["narrative-purple"],
  },
  "narrative-yellow": {
    id: "narrative-yellow",
    label: "Yellow",
    icon: Icons.BalanceIcon,
    value: ["narrative-yellow"],
  },
  "narrative-red": {
    id: "narrative-red",
    label: "Red",
    icon: Icons.BalanceIcon,
    value: ["narrative-red"],
  },
  "narrative-blue": {
    id: "narrative-blue",
    label: "Blue",
    icon: Icons.BalanceIcon,
    value: ["narrative-blue"],
  },
  "narrative-black": {
    id: "narrative-black",
    label: "Black",
    icon: Icons.BalanceIcon,
    value: ["narrative-black"],
  },
  "1d100": {
    id: "1d100",
    label: "1d100",
    icon: Icons.Dice100,
    value: ["1d100"],
  },
  "coin": {
    id: "coin",
    label: "Coin Toss",
    icon: Icons.Coin,
    value: ["coin"],
  },
  "card": {
    id: "card",
    label: "Card",
    icon: Icons.Card,
    value: ["card"],
  },
  "2d6": {
    id: "2d6",
    label: "2d6",
    icon: Icons.RollDiceIcon,
    value: ["1d6", "1d6"],
    goodRoll: 7,
    badRoll: 6,
    criticalSuccess: 12,
    criticalFailure: 2,
  },
};

const FateDie = [-1, -1, 0, 0, 1, 1];
const CoinToss = ["Heads", "Tails"];
const FourSidedDie = makeNormalDie(4);
const SixSidedDie = makeNormalDie(6);
const HeightSidedDie = makeNormalDie(8);
const TenSidedDie = makeNormalDie(10);
const TwelveSidedDie = makeNormalDie(12);
const TwentySidedDie = makeNormalDie(20);
const HundredSidedDie = makeNormalDie(100);
const DeckOfCards = makeCards();

type IDiceCommandOptions = {
  sides: Array<any>;
  formatDetailedResult: (value: number | string) => string;
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
  "narrative-white": {
    sides: [],
    formatDetailedResult: formatNormalDie,
  },
  "narrative-green": {
    sides: [{}],
    formatDetailedResult: formatNormalDie,
  },
  "narrative-purple": {
    sides: [],
    formatDetailedResult: formatNormalDie,
  },
  "narrative-yellow": {
    sides: [],
    formatDetailedResult: formatNormalDie,
  },
  "narrative-red": {
    sides: [],
    formatDetailedResult: formatNormalDie,
  },
  "narrative-blue": {
    sides: [],
    formatDetailedResult: formatNormalDie,
  },
  "narrative-black": {
    sides: [],
    formatDetailedResult: formatNormalDie,
  },
  "card": {
    sides: DeckOfCards,
    formatDetailedResult: formatNormalDie,
  },
  "coin": {
    sides: CoinToss,
    formatDetailedResult: formatNormalDie,
  },
};

export type IRollDiceOptions = {
  listResults: boolean;
};

export enum RollType {
  DiceCommand = "DiceCommand",
  Modifier = "Modifier",
}

export type IDiceCommandOption =
  | {
      type: RollType.DiceCommand;
      commandGroupId: IDiceCommandGroupId;
      label?: string;
    }
  | {
      type: RollType.Modifier;
      label: string;
      modifier: number;
    };

export type IDiceCommandResult =
  | {
      type: RollType.DiceCommand;
      commandGroupId: IDiceCommandGroupId;
      commandName: IDiceCommandNames;
      value: number | string;
      label?: string;
    }
  | {
      type: RollType.Modifier;
      label: string;
      value: number;
    };

export type ISimplifiedDiceRoll = {
  label: string;
  value: number;
};

export type IDiceRollResult = {
  total: number;
  totalWithoutModifiers: number;
  commandResult: Array<IDiceCommandResult>;
  options: IRollDiceOptions;
};

export const Dice = {
  rollCommandOptionList(
    commandOptions: Array<IDiceCommandOption>,
    options: IRollDiceOptions
  ): IDiceRollResult {
    let total = 0;
    let totalWithoutModifiers = 0;
    let containsStringValue = false;
    const rolls: Array<IDiceCommandResult> = [];

    commandOptions.forEach((commandOption) => {
      if (commandOption.type === RollType.DiceCommand) {
        const commandGroup = AllDiceCommandGroups[commandOption.commandGroupId];

        commandGroup.value.forEach((commandName) => {
          const diceOption = DiceCommandOptions[commandName];
          const sides = diceOption.sides;
          const sideIndex = getRandomDiceSide(sides.length);
          const result = sides[sideIndex];

          rolls.push({
            type: commandOption.type,
            commandGroupId: commandOption.commandGroupId,
            commandName: commandName,
            label: commandOption.label,
            value: result,
          });

          if (typeof result === "number") {
            total += result;
            totalWithoutModifiers += result;
          } else {
            containsStringValue = true;
          }
        });
      }
      if (commandOption.type === RollType.Modifier) {
        rolls.push({
          type: commandOption.type,
          label: commandOption.label,
          value: commandOption.modifier,
        });
        total += commandOption.modifier;
      }
    });

    return {
      total,
      totalWithoutModifiers,
      commandResult: rolls,
      options: {
        listResults: containsStringValue ? true : options.listResults,
      },
    };
  },

  findMatchingCommandGroupWithDiceResult(result: IDiceRollResult | undefined) {
    const flatCommands = result?.commandResult
      .flatMap((cr) => {
        return cr.type === RollType.DiceCommand ? cr.commandName : undefined;
      })
      .filter((c) => !!c) as Array<IDiceCommandNames>;

    return this.findMatchingCommandGroupWithDiceTypes(flatCommands);
  },

  findMatchingCommandGroupWithDiceTypes(
    commands: IDiceCommandNames[] | undefined
  ) {
    const commandGroup = Object.keys(AllDiceCommandGroups).find((id) => {
      const group = AllDiceCommandGroups[id as IDiceCommandGroupId];
      return isEqual(group.value, commands);
    });

    return AllDiceCommandGroups[commandGroup as IDiceCommandGroupId];
  },

  simplifyRolls(rolls: Array<IDiceCommandResult>): Array<ISimplifiedDiceRoll> {
    const commandResultsWithCounts = rolls.reduce<
      Record<string, { result: number; count: number }>
    >((acc, diceRoll) => {
      if (diceRoll.type === RollType.Modifier) {
        return acc;
      }
      if (acc[diceRoll.commandGroupId] === undefined) {
        acc[diceRoll.commandGroupId] = { count: 0, result: 0 };
      }

      acc[diceRoll.commandGroupId].count =
        acc[diceRoll.commandGroupId].count + 1;

      if (typeof diceRoll.value === "number") {
        acc[diceRoll.commandGroupId].result += diceRoll.value;
      }

      return acc;
    }, {});

    const simplifiedRolls: Array<ISimplifiedDiceRoll> = Object.keys(
      commandResultsWithCounts
    ).map((key) => {
      const command = key as IDiceCommandNames;
      const result = commandResultsWithCounts[command].result;
      const count = commandResultsWithCounts[command].count;

      const isCountableDiceCommand =
        command.startsWith("1d") || command.startsWith("4d");
      if (isCountableDiceCommand) {
        const [, /* 1d */ dice] = command.split("d");
        const typeLabel = `${count}d${dice}`;
        return { label: typeLabel, value: result };
      }
      return { label: startCase(command), value: result };
    });

    for (const roll of rolls) {
      if (roll.type === RollType.Modifier) {
        simplifiedRolls.push({ label: roll.label, value: roll.value });
      }
    }

    return simplifiedRolls;
  },
};

function getRandomDiceSide(numberOfSides: number): number {
  return Math.trunc(Math.random() * numberOfSides);
}

function makeNormalDie(sides: number) {
  return new Array(sides).fill(0).map((el, i) => {
    return i + 1;
  });
}

function makeCards() {
  const cards = [];
  const suits = ["♣", "♦", "♥", "♠"];

  for (const suit of suits) {
    cards.push(`Ace ${suit}`);
    cards.push(`2 ${suit}`);
    cards.push(`3 ${suit}`);
    cards.push(`4 ${suit}`);
    cards.push(`5 ${suit}`);
    cards.push(`6 ${suit}`);
    cards.push(`7 ${suit}`);
    cards.push(`8 ${suit}`);
    cards.push(`9 ${suit}`);
    cards.push(`10 ${suit}`);
    cards.push(`Jack ${suit}`);
    cards.push(`Queen ${suit}`);
    cards.push(`King ${suit}`);
  }

  cards.push("Joker");
  cards.push("Joker");

  return cards;
}

function formatFateDie(value: number | string) {
  const symbolMap: Record<string, string> = { "-1": "-", "0": "0", "1": "+" };
  return symbolMap[value];
}

function formatNormalDie(value: number | string) {
  return value.toString();
}
