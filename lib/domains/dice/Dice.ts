import isEqual from "lodash/isEqual";
import startCase from "lodash/startCase";
import { Icons } from "../Icons/Icons";

export type IDiceCommandSetOption = {
  id: IDiceCommandSetId;
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
  | "coin"
  | "card";

export type IDiceCommandSetId = IDiceCommandNames | "4dF" | "2d6";

export const CommmandSetOptions: Record<
  IDiceCommandSetId,
  IDiceCommandSetOption
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
  sides: Array<number | string>;
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
  highlight?: IRollDiceOptionsHighlight;
};
export type IRollDiceOptionsHighlight = {
  value: number;
  using: "highest" | "lowest";
};

export type IRollGroup = {
  label?: string;
  modifier?: number;
  commandSets: Array<IRollGroupCommandSet>;
};

type IRollGroupCommandSet = {
  id: IDiceCommandSetId;
  icon?: JSX.Element | string;
};

type ICommandResult = {
  name: IDiceCommandNames;
  value?: number | string | any;
};

type IRollGroupCommandSetResult = {
  id: IDiceCommandSetId;
  icon?: JSX.Element | string;
  commands: Array<ICommandResult>;
};

export type IRollGroupResult = {
  label?: string;
  modifier?: number;
  commandSets: Array<IRollGroupCommandSetResult>;
};

export type ISimplifiedDiceRoll = {
  label: string;
};

export type IDiceRollResult = {
  total: number;
  totalWithoutModifiers: number;
  rollGroups: Array<IRollGroupResult>;
  options: IRollDiceOptions;
};

export const Dice = {
  rollGroups(
    rollGroups: Array<IRollGroup>,
    options: IRollDiceOptions
  ): IDiceRollResult {
    let total = 0;
    let totalWithoutModifiers = 0;
    let containsSomethingElseThanNumberValues = false;
    const rollGroupsWithResult: Array<IRollGroupResult> =
      rollGroups.map<IRollGroupResult>((rollGroup) => {
        if (rollGroup.modifier) {
          total += rollGroup.modifier;
        }
        return {
          label: rollGroup.label,
          modifier: rollGroup.modifier,
          commandSets: rollGroup.commandSets.map<IRollGroupCommandSetResult>(
            (commandGroup) => {
              const commandGroupOptions = CommmandSetOptions[commandGroup.id];
              const commandNames = commandGroupOptions.value;
              return {
                id: commandGroup.id,
                icon: commandGroup.icon,
                commands: commandNames.map<ICommandResult>((commandName) => {
                  const diceOption = DiceCommandOptions[commandName];
                  const sides = diceOption.sides;
                  const side = getRandomDiceSide(sides.length);
                  const result = sides[side];

                  if (typeof result === "number") {
                    total += result;
                    totalWithoutModifiers += result;
                  } else {
                    containsSomethingElseThanNumberValues = true;
                  }

                  return {
                    name: commandName,
                    value: result,
                  };
                }),
              };
            }
          ),
        };
      });

    return {
      total,
      totalWithoutModifiers,
      rollGroups: rollGroupsWithResult,
      options: {
        ...options,
        listResults: containsSomethingElseThanNumberValues
          ? true
          : options.listResults,
      },
    };
  },

  findCommandGroupOptionsMatchForResult(result: IDiceRollResult | undefined) {
    const flatCommandNames = result?.rollGroups
      .flatMap((rollGroup) => rollGroup)
      .flatMap((rollGroup) => rollGroup.commandSets)
      .flatMap((commandSet) => commandSet.commands)
      .flatMap((command) => command.name)
      .filter((c) => !!c) as Array<IDiceCommandNames>;

    return this.findCommandGroupOptionsForCommandNames(flatCommandNames);
  },

  findCommandGroupOptionsForCommandNames(
    commands: IDiceCommandNames[] | undefined
  ) {
    const commandGroup = Object.keys(CommmandSetOptions).find((id) => {
      const group = CommmandSetOptions[id as IDiceCommandSetId];
      return isEqual(group.value, commands);
    });

    return CommmandSetOptions[commandGroup as IDiceCommandSetId];
  },

  simplifyRolls(rollGroupResult: Array<IRollGroupResult>) {
    const result = rollGroupResult.map((rollGroup) => {
      const commandIdAndCount: Record<string, number> = {};
      rollGroup.commandSets.forEach((commandSet) => {
        commandSet.commands.forEach((command) => {
          if (commandIdAndCount[command.name] === undefined) {
            commandIdAndCount[command.name] = 0;
          }

          commandIdAndCount[command.name] = commandIdAndCount[command.name] + 1;
        });
      });

      const simplifiedRolls: Array<string> = Object.keys(commandIdAndCount).map(
        (key) => {
          const command = key as IDiceCommandNames;
          const count = commandIdAndCount[command];

          const isCountableDiceCommand =
            command.startsWith("1d") || command.startsWith("4d");
          if (isCountableDiceCommand) {
            const [, /* 1d */ dice] = command.split("d");
            const typeLabel = `${count}d${dice}`;
            return typeLabel;
          }
          return startCase(command);
        }
      );

      return {
        label: rollGroup.label,
        simplifiedRolls,
      };
    });

    return result;
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
