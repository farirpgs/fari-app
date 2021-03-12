import { useState } from "react";
import { useRollDiceWithCommands } from "../../contexts/DiceContext/DiceContext";
import {
  IDicePool,
  IDicePoolElement,
} from "../../routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";

export function useDicePool() {
  const rollWithCommands = useRollDiceWithCommands();
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
    const labels = pool.map((element) => element.label).join(" / ");
    const commands = pool.flatMap((element) => element.commands);
    const result = rollWithCommands(
      { pool: true, bonus: undefined, bonusLabel: labels },
      commands
    );
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
