import React, { useMemo, useState } from "react";
import {
  AllDiceCommandGroups,
  Dice,
  IDiceCommandGroup,
  IDiceCommandOption,
  IRollDiceOptions,
  RollType,
} from "../../domains/dice/Dice";
import {
  IDicePool,
  IDicePoolElement,
} from "../../routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";

export type IDiceManager = ReturnType<typeof useDice>;

export const DiceContext = React.createContext<IDiceManager>(undefined as any);

export const DefaultDiceCommandOptions: Array<IDiceCommandOption> = [
  {
    type: RollType.DiceCommand,
    commandGroupId: "4dF",
  },
];

export function useDice() {
  const [options, setOptions] = useState<IRollDiceOptions>({
    listResults: false,
  });

  const [pool, setPool] = useState<IDicePool>([]);
  const [playerId, setPlayerId] = useState<string>();
  const [commandGroups, setCommandGroups] = useState<Array<IDiceCommandGroup>>([
    AllDiceCommandGroups["4dF"],
  ]);
  const [commandGroupsBeforePool, setCommandGroupsBeforePool] = useState<
    Array<IDiceCommandGroup>
  >([]);
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

  function reset() {
    setCommandGroups([]);
  }
  function clear() {
    clearPool();
  }

  function roll(
    newDiceCommandOptions: Array<IDiceCommandOption>,
    optionsForRoll: IRollDiceOptions = options
  ) {
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

  function addOrRemovePoolElement(element: IDicePoolElement) {
    const isFirstPoolElement = pool.length === 0;
    if (isFirstPoolElement) {
      preparePool();
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

  function preparePool() {
    setCommandGroupsBeforePool(commandGroups);
    setCommandGroups([]);
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

  function clearPool() {
    setPool([]);
    setCommandGroups(commandGroupsBeforePool);
    setCommandGroupsBeforePool([]);
    setPlayerId(undefined);
  }

  return {
    state: {
      options: options,
      commandGroups: allCommandGroups,
      pool,
    },
    actions: {
      roll,
      rollCommandGroups,
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
