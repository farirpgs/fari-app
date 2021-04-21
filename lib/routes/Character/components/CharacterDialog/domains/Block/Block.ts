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

export const Block = {
  getCommandOptionList(
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
        };
      }
    );

    if (block.type === BlockType.Skill && !block.meta.hideModifier) {
      commandOptionList.push({
        label: block.label,
        type: RollType.Modifier,
        modifier: parseInt(block.value) || 0,
      });
    }
    if (block.type === BlockType.DicePool) {
      commandOptionList.push({
        label: block.label,
        type: RollType.Label,
      });
    }
    return commandOptionList;
  },
};
