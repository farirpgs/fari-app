import React, { useEffect, useMemo, useState } from "react";
import {
  AllDiceCommandGroups,
  Dice,
  IDiceCommandGroup,
  IDiceCommandGroupId,
  IDiceCommandOption,
  IRollDiceOptions,
  RollType,
} from "../../domains/dice/Dice";
import {
  IDicePool,
  IDicePoolElement,
} from "../../routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";
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
  const [options, setOptions] = useState<IRollDiceOptions>({
    listResults: false,
  });

  const [pool, setPool] = useState<IDicePool>([]);
  const [playerId, setPlayerId] = useState<string>();
  const [commandGroups, setCommandGroups] = useState<Array<IDiceCommandGroup>>(
    []
  );
  const poolCommandGroups = useMemo(() => {
    const poolCommandOptionList = pool.flatMap((dicePoolElement) => {
      return dicePoolElement.commandOptionList;
    });
    const poolCommandGroups: Array<IDiceCommandGroup> = poolCommandOptionList
      .map((commandOption) => {
        if (commandOption.type === RollType.DiceCommand) {
          return AllDiceCommandGroups[commandOption.commandGroupId];
        }
      })
      .filter(
        (commandGroupId): commandGroupId is IDiceCommandGroup =>
          !!commandGroupId
      );

    return poolCommandGroups;
  }, [pool]);
  const allCommandGroups = [...commandGroups, ...poolCommandGroups];

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

  function reset() {
    setLatestCommandOptions(DefaultDiceCommandOptions);
  }
  function clear() {
    setLatestCommandOptions([]);
    clearPool();
  }

  function roll(
    newDiceCommandOptions: Array<IDiceCommandOption>,
    optionsForRoll: IRollDiceOptions = options
  ) {
    setLatestCommandOptions(newDiceCommandOptions);
    setOptions(optionsForRoll);
    const result = Dice.rollCommandOptionList(
      newDiceCommandOptions,
      optionsForRoll
    );
    return result;
  }

  function rollCommandGroups(optionsForRoll: IRollDiceOptions = options) {
    const commandOptions: Array<IDiceCommandOption> = commandGroups.map(
      (commandGroup) => {
        return {
          type: RollType.DiceCommand,
          commandGroupId: commandGroup.id,
        };
      }
    );

    return roll(commandOptions, optionsForRoll);
  }

  /**
   * Reroll the latest commands
   * @param options if empty, uses the latest options
   */
  function reroll(optionsForRoll: IRollDiceOptions = options) {
    const result = Dice.rollCommandOptionList(
      latestCommandOptions,
      optionsForRoll
    );
    return result;
  }

  function addOrRemovePoolElement(element: IDicePoolElement) {
    const isFirstPoolElement = pool.length === 0;
    if (isFirstPoolElement) {
      setCommandGroups([]);
    }

    setPool((draft) => {
      const ids = draft.map((element) => element.blockId);
      const exists = ids.includes(element.blockId);

      if (exists) {
        return draft.filter((e) => e.blockId !== element.blockId);
      }
      return [...draft, element];
    });
  }

  function clearPool() {
    setPool([]);
    setPlayerId(undefined);
  }

  function getPoolResult() {
    const optionsFromCommandGroups: Array<IDiceCommandOption> = commandGroups.map(
      (commandGroup) => {
        return {
          type: RollType.DiceCommand,
          commandGroupId: commandGroup.id,
        };
      }
    );

    const optionsFromPool = pool.flatMap(
      (element) => element.commandOptionList
    );
    const allOptions = [...optionsFromPool, ...optionsFromCommandGroups];

    const result = roll(allOptions, options);
    const latestPlayerId = playerId;

    clearPool();
    return { result, playerId: latestPlayerId };
  }

  return {
    state: {
      commandNames: latestCommandGroupIds,
      options: options,
      commandGroups: allCommandGroups,
      pool,
    },
    actions: {
      roll,
      rollCommandGroups,
      reroll,
      reset,
      setOptions: setOptions,
      setCommandGroups,
      addOrRemovePoolElement,
      getPoolResult,
      setPlayerId,
      clear,
    },
    computed: {
      hasSelectedCommands: allCommandGroups.length > 0,
      hasPool: pool.length > 0,
    },
  };
}
