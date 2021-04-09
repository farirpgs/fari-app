import isEqual from "lodash/isEqual";
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
  | "coin";

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
const CoinToss = [-1, 1];
const FourSidedDie = makeNormalDie(4);
const SixSidedDie = makeNormalDie(6);
const HeightSidedDie = makeNormalDie(8);
const TenSidedDie = makeNormalDie(10);
const TwelveSidedDie = makeNormalDie(12);
const TwentySidedDie = makeNormalDie(20);
const HundredSidedDie = makeNormalDie(100);

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
  "coin": {
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
  listResults: boolean;
};

export enum RollType {
  DiceCommand = "DiceCommand",
  Modifier = "Modifier",
  Label = "Label",
}

export type IDiceCommandOption =
  | {
      type: RollType.DiceCommand;
      commandGroupId: IDiceCommandGroupId;
    }
  | {
      type: RollType.Modifier;
      label: string;
      modifier: number;
    }
  | {
      type: RollType.Label;
      label: string;
    };

export type IDiceCommandResult =
  | {
      type: RollType.DiceCommand;
      commandGroupId: IDiceCommandGroupId;
      commandName: IDiceCommandNames;
      value: number;
    }
  | {
      type: RollType.Modifier;
      label: string;
      value: number;
    }
  | {
      type: RollType.Label;
      label: string;
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
    const rolls: Array<IDiceCommandResult> = [];

    commandOptions.forEach((commandOption) => {
      if (commandOption.type === RollType.DiceCommand) {
        const commandGroup = AllDiceCommandGroups[commandOption.commandGroupId];

        commandGroup.value.forEach((commandName) => {
          const diceOption = DiceCommandOptions[commandName];
          const sides = diceOption.sides;
          const side = getRandomDiceSide(sides.length);
          const result = sides[side];

          rolls.push({
            type: commandOption.type,
            commandGroupId: commandOption.commandGroupId,
            commandName: commandName,
            value: result,
          });
          total += result;
          totalWithoutModifiers += result;
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
      if (commandOption.type === RollType.Label) {
        rolls.push({
          type: commandOption.type,
          label: commandOption.label,
        });
      }
    });

    return {
      total,
      totalWithoutModifiers,
      commandResult: rolls,
      options: options,
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
      if (
        diceRoll.type === RollType.Modifier ||
        diceRoll.type === RollType.Label
      ) {
        return acc;
      }
      if (acc[diceRoll.commandGroupId] === undefined) {
        acc[diceRoll.commandGroupId] = { count: 0, result: 0 };
      }

      acc[diceRoll.commandGroupId].count =
        acc[diceRoll.commandGroupId].count + 1;
      acc[diceRoll.commandGroupId].result += diceRoll.value;

      return acc;
    }, {});

    const simplifiedRolls: Array<ISimplifiedDiceRoll> = Object.keys(
      commandResultsWithCounts
    ).map((key) => {
      const command = key as IDiceCommandNames;
      const result = commandResultsWithCounts[command].result;
      const count = commandResultsWithCounts[command].count;

      const isCountableDiceCommand = command.includes("d");
      if (isCountableDiceCommand) {
        const [, /* 1d */ dice] = command.split("d");
        const typeLabel = `${count}d${dice}`;
        return { label: typeLabel, value: result };
      }
      return { label: command, value: result };
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

function formatFateDie(value: number) {
  const symbolMap: Record<string, string> = { "-1": "-", "0": "0", "1": "+" };
  return symbolMap[value];
}

function formatNormalDie(value: number) {
  return value.toString();
}
