import { BlockType, IBlock, ICharacter, IPointCounterBlock } from "./types";

type IMainPointerBlock = (IBlock & IPointCounterBlock) | undefined;

export const CharacterSelector = {
  getCharacterMainPointerBlock(
    character: ICharacter | undefined
  ): IMainPointerBlock {
    const blocks =
      character?.pages
        .flatMap((p) => p.rows)
        .flatMap((r) => r.columns)
        .flatMap((c) => c.sections)
        .flatMap((s) => s.blocks) ?? [];

    const match = blocks.find((block) => {
      return (
        block.type === BlockType.PointCounter && block.meta.isMainPointCounter
      );
    }) as IMainPointerBlock;

    return match;
  },
};
