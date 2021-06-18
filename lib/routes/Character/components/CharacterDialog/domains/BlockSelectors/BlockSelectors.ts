import { previewContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import {
  BlockType,
  IBlock,
  IDicePoolBlock,
  ISkillBlock,
} from "../../../../../../domains/character/types";
import {
  IDiceCommandOption,
  RollType,
} from "../../../../../../domains/dice/Dice";
import { DiceCommandGroup } from "../DiceCommandGroup/DiceCommandGroup";

export const BlockSelectors = {
  getDiceCommandOptionsFromBlock(
    block: IBlock & (IDicePoolBlock | ISkillBlock)
  ): Array<IDiceCommandOption> {
    const commandGroups =
      block.meta.commands?.map((commandGroupId) => {
        return DiceCommandGroup.getCommandGroupById(commandGroupId);
      }) ?? [];

    const commandOptionList: Array<IDiceCommandOption> = commandGroups.map(
      (commandGroup): IDiceCommandOption => {
        return {
          type: RollType.DiceCommand,
          commandGroupId: commandGroup.id,
          label: previewContentEditable({ value: block.label }),
        };
      }
    );

    if (block.type === BlockType.Skill && !block.meta.hideModifier) {
      commandOptionList.push({
        label: previewContentEditable({ value: block.label }),
        type: RollType.Modifier,
        modifier: parseInt(block.value) || 0,
      });
    }

    return commandOptionList;
  },
};
