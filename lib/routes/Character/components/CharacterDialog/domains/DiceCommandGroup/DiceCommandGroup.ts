import {
  IBlock,
  IDicePoolBlock,
  ISkillBlock,
} from "../../../../../../domains/character/types";
import {
  AllDiceCommandGroups,
  IDiceCommandGroupId,
} from "../../../../../../domains/dice/Dice";

export const DiceCommandGroup = {
  getCommandGroupById(commandId: IDiceCommandGroupId) {
    const result = AllDiceCommandGroups[commandId];
    return result;
  },
  getCommandGroupFromBlock(block: IBlock & (IDicePoolBlock | ISkillBlock)) {
    const result =
      block.meta?.commands?.map((commandId) => {
        return this.getCommandGroupById(commandId);
      }) ?? [];

    return result;
  },
};
