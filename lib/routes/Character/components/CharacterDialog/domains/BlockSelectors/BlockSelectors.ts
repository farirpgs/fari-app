import { previewContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import {
  BlockType,
  IBlock,
  IDicePoolBlock,
  ISkillBlock,
} from "../../../../../../domains/character/types";
import { IRollGroup } from "../../../../../../domains/dice/Dice";

export const BlockSelectors = {
  getRollGroupFromBlock(
    block: IBlock & (IDicePoolBlock | ISkillBlock)
  ): IRollGroup {
    let modifier: number | undefined;
    if (block.type === BlockType.Skill && !block.meta.hideModifier) {
      modifier = parseInt(block.value) || 0;
    }
    return {
      label: previewContentEditable({ value: block.label }),
      modifier: modifier,
      commandSets:
        block.meta.commands?.map((commandGroupId) => ({
          id: commandGroupId,
        })) ?? [],
    };
  },
};
