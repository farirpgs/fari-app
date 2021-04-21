import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import {
  DiceContext,
  useDice,
} from "../../../contexts/DiceContext/DiceContext";
import { BlockType } from "../../../domains/character/types";
import { RollType } from "../../../domains/dice/Dice";
import { IDicePoolElement } from "../../../routes/Character/components/CharacterDialog/components/blocks/BlockDicePool";
import { useDicePool } from "../useDicePool";

describe("useDicePool", () => {
  it("should ", () => {
    const { result } = renderHook(
      () => {
        return useDicePool();
      },
      {
        wrapper: (props) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const diceManager = useDice();
          return (
            <DiceContext.Provider value={diceManager}>
              {props.children}
            </DiceContext.Provider>
          );
        },
      }
    );

    expect(result.current.state.pool).toEqual([]);

    const aBlockElement: IDicePoolElement = {
      blockId: "1",
      blockType: BlockType.DicePool,
      commandOptionList: [
        { type: RollType.DiceCommand, commandGroupId: "1dF" },
      ],
      label: "Block 1",
    };
    const anotherBlockElement: IDicePoolElement = {
      ...aBlockElement,
      blockId: "2",
    };

    // add
    act(() => {
      result.current.actions.addOrRemovePoolElement(aBlockElement);
      result.current.actions.addOrRemovePoolElement(anotherBlockElement);
    });

    expect(result.current.state.pool).toEqual([
      aBlockElement,
      anotherBlockElement,
    ]);

    // remove 1
    act(() => {
      result.current.actions.addOrRemovePoolElement(aBlockElement);
    });
    expect(result.current.state.pool).toEqual([anotherBlockElement]);

    act(() => {
      const { result: poolResult } = result.current.actions.getPoolResult();

      expect(poolResult).toEqual({
        commandResult: [
          {
            commandGroupId: "1dF",
            commandName: "1dF",
            type: "DiceCommand",
            value: expect.anything(),
          },
        ],
        options: { listResults: true },
        total: expect.anything(),
        totalWithoutModifiers: expect.anything(),
      });
    });
  });
});
