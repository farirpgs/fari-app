import React, { useEffect, useMemo, useState } from "react";
import {
  Dice,
  IDiceCommandGroup,
  IDiceCommandGroupId,
  IDiceCommandOption,
  IRollDiceOptions,
  RollType,
} from "../../domains/dice/Dice";
import { DiceCommandGroup } from "../../routes/Character/components/CharacterDialog/domains/DiceCommandGroup/DiceCommandGroup";

export type IDiceManager = ReturnType<typeof useDice>;

export const DiceContext = React.createContext<IDiceManager>(undefined as any);

export const DefaultDiceCommandOptions: Array<IDiceCommandOption> = [
  {
    type: RollType.DiceCommand,
    commandGroupId: "4dF",
  },
];

export function useDice() {
  const [latestCommandOptions, setLatestCommandOptions] = useState<
    Array<IDiceCommandOption>
  >(DefaultDiceCommandOptions);
  const [latestOptions, setLatestOptions] = useState<IRollDiceOptions>({
    listResults: false,
  });
  const [commandGroups, setCommandGroups] = useState<Array<IDiceCommandGroup>>(
    []
  );

  const latestCommandGroupIds: Array<IDiceCommandGroupId> = useMemo(() => {
    const result = latestCommandOptions
      .map((c) =>
        c.type === RollType.DiceCommand ? c.commandGroupId : undefined
      )
      .filter((c) => !!c) as Array<IDiceCommandGroupId>;
    return result;
  }, [latestCommandOptions]);

  useEffect(() => {
    const newCommandGroups = latestCommandGroupIds.map((commandGroupId) =>
      DiceCommandGroup.getCommandGroupById(commandGroupId)
    );
    setCommandGroups(newCommandGroups);
  }, [latestCommandGroupIds]);

  const reset = () => {
    setLatestCommandOptions(DefaultDiceCommandOptions);
  };

  function roll(
    newCommands: Array<IDiceCommandOption>,
    options: IRollDiceOptions = latestOptions
  ) {
    setLatestCommandOptions(newCommands);
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
      latestCommandOptions,
      optionsToUse
    );
    return result;
  }

  return {
    state: {
      // commandOptionList: latestCommandOptionList,
      commandNames: latestCommandGroupIds,
      options: latestOptions,
      commandGroups,
    },
    actions: {
      roll,
      reroll,
      reset,
      setOptions: setLatestOptions,
      setCommandGroups,
    },
  };
}
