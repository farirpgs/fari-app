import React, { useEffect, useMemo, useState } from "react";
import {
  CommmandSetOptions,
  Dice,
  IDiceCommandSetId,
  IDiceCommandSetOption,
  IRollDiceOptions,
  IRollGroup,
} from "../../domains/dice/Dice";
import {
  IDicePool,
  IDicePoolElement,
} from "../../routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";
export type IDiceManager = ReturnType<typeof useDice>;

export const DiceContext = React.createContext<IDiceManager>(undefined as any);

export function useDice(props: {
  defaultCommands: Array<IDiceCommandSetId> | null;
  defaultOptions: IRollDiceOptions;
  onCommandSetsChange(commandSets: Array<IDiceCommandSetOption>): void;
}) {
  const [options, setOptions] = useState<IRollDiceOptions>(
    props.defaultOptions
  );

  const [pool, setPool] = useState<IDicePool>([]);
  const [playerId, setPlayerId] = useState<string>();

  const [commandSets, setCommandSets] = useState<Array<IDiceCommandSetOption>>(
    () => {
      const defaultSet = props.defaultCommands?.map(
        (c) => CommmandSetOptions[c]
      ) ?? [CommmandSetOptions["4dF"]];
      return defaultSet;
    }
  );
  const [commandSetsBeforePool, setCommandSetsBeforePool] = useState<
    Array<IDiceCommandSetOption>
  >([]);

  useEffect(() => {
    props.onCommandSetsChange(commandSets);
  }, [commandSets]);

  const poolCommandSets = useMemo(() => {
    const poolRollGroups = pool.flatMap((dicePoolElement) => {
      return dicePoolElement.rollGroup.commandSets;
    });
    const poolRollCommandGroupOptions: Array<IDiceCommandSetOption> =
      poolRollGroups
        .map((commandOption) => {
          return CommmandSetOptions[commandOption.id];
        })
        .filter(
          (commandGroupId): commandGroupId is IDiceCommandSetOption =>
            !!commandGroupId
        );

    return poolRollCommandGroupOptions;
  }, [pool]);
  const allCommandSets = [...commandSets, ...poolCommandSets];

  function reset() {
    setCommandSets([]);
  }
  function clear() {
    clearPool();
  }

  function roll(
    rollGroups: Array<IRollGroup>,
    optionsForRoll: IRollDiceOptions = options
  ) {
    setOptions(optionsForRoll);
    const result = Dice.rollGroups(rollGroups, optionsForRoll);
    return result;
  }

  function rollCommandGroups(optionsForRoll: IRollDiceOptions = options) {
    const rollGroups: Array<IRollGroup> = [
      {
        commandSets: commandSets.map((commandGroup) => {
          return {
            id: commandGroup.id,
          };
        }),
      },
    ];
    return roll(rollGroups, optionsForRoll);
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
    setCommandSetsBeforePool(commandSets);
    setCommandSets([]);
  }

  function getPoolResult() {
    const currentRollGroups: Array<IRollGroup> =
      commandSets.length > 0
        ? [
            {
              commandSets: commandSets.map((commandGroup) => {
                return {
                  id: commandGroup.id,
                };
              }),
            },
          ]
        : [];

    const rollGroupsFromPool = pool.flatMap((element) => element.rollGroup);
    const commandSetsToRoll = [...currentRollGroups, ...rollGroupsFromPool];
    const result = roll(commandSetsToRoll, options);
    const latestPlayerId = playerId;

    clearPool();
    return { result, playerId: latestPlayerId };
  }

  function clearPool() {
    setPool([]);
    setCommandSets(commandSetsBeforePool);
    setCommandSetsBeforePool([]);
    setPlayerId(undefined);
  }

  return {
    state: {
      options: options,
      commandGroups: allCommandSets,
      pool,
    },
    actions: {
      roll,
      rollCommandGroups,
      reset,
      setOptions: setOptions,
      setCommandSets: setCommandSets,
      addOrRemovePoolElement,
      getPoolResult,
      setPlayerId,
      clear,
    },
    computed: {
      hasSelectedCommands: allCommandSets.length > 0,
      hasPool: pool.length > 0,
    },
  };
}
