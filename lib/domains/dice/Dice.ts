import React from "react";
import { Icons } from "../Icons/Icons";
import { Id } from "../Id/Id";

export type IDiceCommandId =
  | "1dF"
  | "1d4"
  | "1d6"
  | "1d8"
  | "1d10"
  | "1d12"
  | "1d20"
  | "1d100"
  | "coin"
  | "4dF"
  | "2d6"
  | "card";

export const DiceOptions: Record<
  IDiceCommandId,
  {
    label: string;
    possibleResults?: Array<string>;
    icon: React.ElementType;
    roll(): { value: string; details?: string };
  }
> = {
  "1dF": {
    label: "1dF",
    icon: Icons.OneDie,
    roll() {
      const fateDie = [-1, -1, 0, 0, 1, 1];
      const result = fateDie[getRandomDiceSide(fateDie.length)];
      const symbolMap: Record<string, string> = {
        "-1": "-",
        "0": "0",
        "1": "+",
      };
      return { value: symbolMap[result] };
    },
    possibleResults: ["-", "0", "+"],
  },
  "1d4": {
    label: "1d4",
    icon: Icons.Dice4,
    roll() {
      const die = makeNormalDie(4);
      return { value: die[getRandomDiceSide(die.length)].toString() };
    },
    possibleResults: makeNormalDie(4).map((el) => el.toString()),
  },
  "1d6": {
    label: "1d6",
    icon: Icons.Dice6,
    roll() {
      const die = makeNormalDie(6);
      return { value: die[getRandomDiceSide(die.length)].toString() };
    },
    possibleResults: makeNormalDie(6).map((el) => el.toString()),
  },
  "1d8": {
    label: "1d8",
    icon: Icons.Dice8,
    roll() {
      const die = makeNormalDie(8);
      return { value: die[getRandomDiceSide(die.length)].toString() };
    },
    possibleResults: makeNormalDie(8).map((el) => el.toString()),
  },
  "1d10": {
    label: "1d10",
    icon: Icons.Dice10,
    roll() {
      const die = makeNormalDie(10);
      return { value: die[getRandomDiceSide(die.length)].toString() };
    },
    possibleResults: makeNormalDie(10).map((el) => el.toString()),
  },
  "1d12": {
    label: "1d12",
    icon: Icons.Dice12,
    roll() {
      const die = makeNormalDie(12);
      return { value: die[getRandomDiceSide(die.length)].toString() };
    },
    possibleResults: makeNormalDie(12).map((el) => el.toString()),
  },
  "1d20": {
    label: "1d20",
    icon: Icons.Dice20,
    roll() {
      const die = makeNormalDie(20);
      return { value: die[getRandomDiceSide(die.length)].toString() };
    },
    possibleResults: makeNormalDie(20).map((el) => el.toString()),
  },
  "1d100": {
    label: "1d100",
    icon: Icons.Dice100,
    roll() {
      const die = makeNormalDie(100);
      return { value: die[getRandomDiceSide(die.length)].toString() };
    },
    possibleResults: makeNormalDie(100).map((el) => el.toString()),
  },
  "coin": {
    label: "Coin Toss",
    icon: Icons.Coin,
    roll() {
      const coin = ["H", "T"];
      return { value: coin[getRandomDiceSide(coin.length)] };
    },
    possibleResults: ["H", "T"],
  },
  "card": {
    label: "Card",
    icon: Icons.Card,
    roll() {
      const cards = makeCards();
      return { value: cards[getRandomDiceSide(cards.length)] };
    },
  },
  "2d6": {
    label: "2d6",
    icon: Icons.RollDiceIcon,
    roll() {
      const die = makeNormalDie(6);
      const first = die[getRandomDiceSide(die.length)];
      const second = die[getRandomDiceSide(die.length)];
      const result = first + second;
      return { value: result.toString(), details: `${first} + ${second}` };
    },
    possibleResults: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  },
  "4dF": {
    label: "4dF",
    icon: Icons.FateDice,
    roll() {
      const die = [-1, -1, 0, 0, 1, 1];

      const results = [
        die[getRandomDiceSide(die.length)],
        die[getRandomDiceSide(die.length)],
        die[getRandomDiceSide(die.length)],
        die[getRandomDiceSide(die.length)],
      ];
      const details = `${results
        .map((result) => {
          return result;
        })
        .join(" ")}`;
      return { value: results.reduce((a, b) => a + b, 0).toString(), details };
    },
    possibleResults: ["-4", "-3", "-2", "-1", "0", "1", "2", "3", "4"],
  },
};

export type IRollablePool = {
  label?: string;
  modifier?: number;
  commandIds: Array<IDiceCommandId>;
};

export type IDicePoolResult = {
  id: string;
  label?: string;
  modifier?: number;
  commandResults: Array<ICommandResult>;
};

export type ICommandResult = {
  id: string;
  command: IDiceCommandId;
  value: string;
  details: string | undefined;
};

export const Dice = {
  roll(command: IDiceCommandId): ICommandResult {
    const result = DiceOptions[command].roll();
    return {
      command: command,
      value: result.value,
      details: result.details,
      id: Id.generate(),
    };
  },
  rollPool(pool: IRollablePool): IDicePoolResult {
    return {
      id: Id.generate(),
      label: pool.label,
      modifier: pool.modifier,
      commandResults: pool.commandIds.map<ICommandResult>((command) => {
        return Dice.roll(command);
      }),
    };
  },
  rollPools(pools: Array<IRollablePool>): Array<IDicePoolResult> {
    return pools.map<IDicePoolResult>((rollGroup) => {
      return Dice.rollPool(rollGroup);
    });
  },
};

export const CommandResult = {
  getTotal(commandResultList: Array<ICommandResult>) {
    return commandResultList.reduce((acc, result) => {
      const value = parseInt(`${result.value}`);
      return acc + value;
    }, 0);
  },
  getHighest(commandResultList: Array<ICommandResult>) {
    return commandResultList.reduce((acc, result) => {
      const value = parseInt(`${result.value}`);

      return Math.max(acc, value);
    }, -9999);
  },
  getLowest(commandResultList: Array<ICommandResult>) {
    return commandResultList.reduce((acc, result) => {
      const value = parseInt(`${result.value}`);

      return Math.min(acc, value);
    }, 9999);
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
    cards.push(`A${suit}`);
    cards.push(`2${suit}`);
    cards.push(`3${suit}`);
    cards.push(`4${suit}`);
    cards.push(`5${suit}`);
    cards.push(`6${suit}`);
    cards.push(`7${suit}`);
    cards.push(`8${suit}`);
    cards.push(`9${suit}`);
    cards.push(`10${suit}`);
    cards.push(`J${suit}`);
    cards.push(`Q${suit}`);
    cards.push(`K${suit}`);
  }

  cards.push("Joker");
  cards.push("Joker");

  return cards;
}
