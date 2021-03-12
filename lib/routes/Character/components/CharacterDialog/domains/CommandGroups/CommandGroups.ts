import {
  IBlock,
  IDicePoolBlock,
  ISkillBlock,
} from "../../../../../../domains/character/types";
import {
  AllDiceCommandGroups,
  IDiceCommandGroup,
  IDiceCommandGroupId,
} from "../../../../../../domains/dice/Dice";

export const CommandGroups = {
  getCommandGroupByValue(commandId: IDiceCommandGroupId) {
    const result = AllDiceCommandGroups.find(
      (c) => c.id === commandId
    ) as IDiceCommandGroup;
    return result;
  },
  getCommandGroupFromBlock(block: IBlock & (IDicePoolBlock | ISkillBlock)) {
    const result =
      block.meta?.commands?.map((commandId) => {
        return this.getCommandGroupByValue(commandId);
      }) ?? [];

    return result;
  },
  getCommandNamesFromBlock(block: IBlock & (IDicePoolBlock | ISkillBlock)) {
    const result =
      block.meta.commands?.flatMap((c) => {
        const group = AllDiceCommandGroups.find((g) => {
          return g.id === c;
        }) as IDiceCommandGroup;
        return group?.value;
      }) ?? [];

    return result;
  },
};
