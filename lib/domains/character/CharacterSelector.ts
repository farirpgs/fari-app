import { BlockType, IBlock, ICharacter, IPointCounterBlock } from "./types";

type IMainPointerBlock = (IBlock & IPointCounterBlock) | undefined;

export const CharacterSelector = {
  getCharacterMainPointerBlock(
    character: ICharacter | undefined
  ): IMainPointerBlock {
    const match = character?.pages
      .flatMap((p) => [...p.sections.left, ...p.sections.right])
      .flatMap((s) => s.blocks)
      .find((block) => {
        return (
          block.type === BlockType.PointCounter && block.meta.isMainPointCounter
        );
      }) as IMainPointerBlock;

    return match;
  },
};
