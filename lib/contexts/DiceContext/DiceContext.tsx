import React, { useState } from "react";
import {
  Dice,
  IDiceCommandNames,
  IDiceCommandOption,
  IRollDiceOptions,
  RollType,
} from "../../domains/dice/Dice";

export type IDiceManager = ReturnType<typeof useDice>;

export const DiceContext = React.createContext<IDiceManager>(undefined as any);

const DefaultDiceCommandOptionList: Array<IDiceCommandOption> = [
  {
    type: RollType.DiceCommand,
    command: "1dF",
  },
  {
    type: RollType.DiceCommand,
    command: "1dF",
  },
  {
    type: RollType.DiceCommand,
    command: "1dF",
  },
  {
    type: RollType.DiceCommand,
    command: "1dF",
  },
];

export function useDice() {
  const [latestCommandOptionList, setLatestCommandOptionList] = useState<
    Array<IDiceCommandOption>
  >(DefaultDiceCommandOptionList);
  const [latestOptions, setLatestOptions] = useState<IRollDiceOptions>({
    listResults: false,
  });

  const latestCommandsNames: Array<IDiceCommandNames> = latestCommandOptionList
    .map((c) => (c.type === RollType.DiceCommand ? c.command : undefined))
    .filter((c) => !!c) as Array<IDiceCommandNames>;

  const reset = () => {
    setLatestCommandOptionList(DefaultDiceCommandOptionList);
  };

  function rollByCommandNames(
    newCommandsNames: Array<IDiceCommandNames>,
    options: IRollDiceOptions
  ) {
    const newCommands: Array<IDiceCommandOption> = newCommandsNames.map(
      (command) => ({ type: RollType.DiceCommand, command: command })
    );

    return roll(newCommands, options);
  }

  function roll(
    newCommands: Array<IDiceCommandOption>,
    options: IRollDiceOptions
  ) {
    setLatestCommandOptionList(newCommands);
    setLatestOptions(options);
    const result = Dice.rollCommandOptionList(newCommands, options);
    return result;
  }

  /**
   * Reroll the latest commands
   * @param options if empty, uses the latest options
   */
  function reroll(options?: IRollDiceOptions) {
    const optionsToUse = options ?? latestOptions;
    const result = Dice.rollCommandOptionList(
      latestCommandOptionList,
      optionsToUse
    );
    return result;
  }

  return {
    state: {
      commandOptionList: latestCommandOptionList,
      commandNames: latestCommandsNames,
      options: latestOptions,
    },
    actions: {
      roll,
      rollByCommandNames,
      reroll,
      reset,
      setOptions: setLatestOptions,
    },
  };
}
