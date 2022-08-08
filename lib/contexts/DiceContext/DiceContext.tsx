import React, { useState } from "react";
import { BlockType } from "../../domains/character/types";
import { IRollablePool } from "../../domains/dice/Dice";
export type IDiceManager = ReturnType<typeof useDice>;

export const DiceContext = React.createContext<IDiceManager>(undefined as any);

export type IBlockWithRollablePool = {
  blockId: string;
  blockType: BlockType;
  label: string;
  pool: IRollablePool;
};

export function useDice(props: {
  // defaultCommands: Array<IDiceCommandSetId> | null;
  // defaultOptions: IRollDiceOptions;
  // onOptionsChange(options: IRollDiceOptions): void;
  // onCommandSetsChange(commandSets: Array<IDiceCommandSetOption>): void;
}) {
  // const [options, setOptions] = useState<IRollDiceOptions>(
  //   props.defaultOptions
  // );
  const [blockWithPools, setBlockWithPools] = useState<
    Array<IBlockWithRollablePool>
  >([]);
  const selectedCommandIds = blockWithPools
    .flatMap((e) => {
      return e.pool;
    })
    .flatMap((e) => e.commandIds);
  const pools = blockWithPools.map((e) => e.pool);

  // const [playerId, setPlayerId] = useState<string>();
  // const [commandSets, setCommandSets] = useState<Array<IDiceCommandSetOption>>(
  //   () => {
  //     const defaultSet = props.defaultCommands?.map(
  //       (c) => CommmandSetOptions[c]
  //     ) ?? [CommmandSetOptions["1d6"]];
  //     return defaultSet;
  //   }
  // );
  // const [commandSetsBeforePool, setCommandSetsBeforePool] = useState<
  //   Array<IDiceCommandSetOption>
  // >([]);
  // useEffect(() => {
  //   props.onCommandSetsChange(commandSets);
  // }, [commandSets]);
  // useEffect(() => {
  //   props.onOptionsChange(options);
  // }, [options]);
  // const poolCommandSets = useMemo(() => {
  //   const poolRollGroups = pool.flatMap((dicePoolElement) => {
  //     return dicePoolElement.rollGroup.commandSets;
  //   });
  //   const poolRollCommandGroupOptions: Array<IDiceCommandSetOption> =
  //     poolRollGroups
  //       .map((commandOption) => {
  //         return CommmandSetOptions[commandOption.id];
  //       })
  //       .filter(
  //         (commandGroupId): commandGroupId is IDiceCommandSetOption =>
  //           !!commandGroupId
  //       );
  //   return poolRollCommandGroupOptions;
  // }, [pool]);
  // const allCommandSets = [...commandSets, ...poolCommandSets];
  // function reset() {
  //   setCommandSets([]);
  // }
  // function clear() {
  //   clearPool();
  // }
  // function roll(
  //   rollGroups: Array<IRollGroup>,
  //   optionsForRoll: IRollDiceOptions = options
  // ) {
  //   setOptions(optionsForRoll);
  //   const result = Dice.rollGroups(rollGroups, optionsForRoll);
  //   return result;
  // }
  // function rollCommandGroups(optionsForRoll: IRollDiceOptions = options) {
  //   const rollGroups: Array<IRollGroup> = [
  //     {
  //       commandSets: commandSets.map((commandGroup) => {
  //         return {
  //           id: commandGroup.id,
  //         };
  //       }),
  //     },
  //   ];
  //   return roll(rollGroups, optionsForRoll);
  // }
  function addOrRemovePoolElement(element: IBlockWithRollablePool) {
    setBlockWithPools((draft) => {
      const ids = draft.map((element) => element.blockId);
      const exists = ids.includes(element.blockId);
      if (exists) {
        return draft.filter((e) => e.blockId !== element.blockId);
      }
      return [...draft, element];
    });
  }
  // function preparePool() {
  //   setCommandSetsBeforePool(commandSets);
  //   setCommandSets([]);
  // }
  // function getPoolResult() {
  //   const currentRollGroups: Array<IRollGroup> =
  //     commandSets.length > 0
  //       ? [
  //           {
  //             commandSets: commandSets.map((commandGroup) => {
  //               return {
  //                 id: commandGroup.id,
  //               };
  //             }),
  //           },
  //         ]
  //       : [];
  //   const rollGroupsFromPool = pool.flatMap((element) => element.rollGroup);
  //   const commandSetsToRoll = [...currentRollGroups, ...rollGroupsFromPool];
  //   const result = roll(commandSetsToRoll, options);
  //   const latestPlayerId = playerId;
  //   clearPool();
  //   return { result, playerId: latestPlayerId };
  // }
  function clearPool() {
    setBlockWithPools([]);
    // setCommandSets(commandSetsBeforePool);
    // setCommandSetsBeforePool([]);
    // setPlayerId(undefined);
  }

  return {
    state: { blockWithPools: blockWithPools, selectedCommandIds, pools },
    actions: {
      addOrRemovePoolElement,
      clearPool,
    },
  };
  // return {
  //   state: {
  //     options: options,
  //     commandGroups: allCommandSets,
  //     pool,
  //   },
  //   actions: {
  //     roll,
  //     rollCommandGroups,
  //     reset,
  //     setOptions: setOptions,
  //     setCommandSets: setCommandSets,
  //     addOrRemovePoolElement,
  //     getPoolResult,
  //     setPlayerId,
  //     clear,
  //   },
  //   computed: {
  //     hasSelectedCommands: allCommandSets.length > 0,
  //     hasPool: pool.length > 0,
  //   },
  // };
}
