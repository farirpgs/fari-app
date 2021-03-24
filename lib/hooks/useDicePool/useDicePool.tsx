import { useState } from "react";
import { BlockType } from "../../domains/character/types";
import { Dice } from "../../domains/dice/Dice";
import {
  IDicePool,
  IDicePoolElement,
} from "../../routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";

export function useDicePool() {
  const [pool, setPool] = useState<IDicePool>([]);

  function addOrRemovePoolElement(element: IDicePoolElement) {
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
  }

  function getPoolResult() {
    const listResults = pool.some((e) => e.blockType === BlockType.DicePool);

    const commands = pool.flatMap((element) => element.commandOptionList);

    const result = Dice.rollCommandOptionList(commands, { listResults });

    clearPool();
    return result;
  }

  return {
    state: { pool },
    actions: {
      clearPool,
      addOrRemovePoolElement,
      getPoolResult,
    },
  };
}
