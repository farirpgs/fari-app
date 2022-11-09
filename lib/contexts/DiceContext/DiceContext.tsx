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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useDice(props: {}) {
  const [blockWithPools, setBlockWithPools] = useState<
    Array<IBlockWithRollablePool>
  >([]);
  const selectedCommandIds = blockWithPools
    .flatMap((e) => {
      return e.pool;
    })
    .flatMap((e) => e.commandIds);
  const pools = blockWithPools.map((e) => e.pool);

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

  function clearPool() {
    setBlockWithPools([]);
  }

  return {
    state: { blockWithPools: blockWithPools, selectedCommandIds, pools },
    actions: {
      addOrRemovePoolElement,
      clearPool,
    },
  };
}
