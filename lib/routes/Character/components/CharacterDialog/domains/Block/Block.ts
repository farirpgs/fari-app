import {
  IBlock,
  IDicePoolBlock,
  ISkillBlock,
} from "../../../../../../domains/character/types";
import {
  IDiceCommandOption,
  RollType,
} from "../../../../../../domains/dice/Dice";
import { CommandGroups } from "../CommandGroups/CommandGroups";

export const Block = {
  getCommandOptionList(
    block: IBlock & (IDicePoolBlock | ISkillBlock)
  ): Array<IDiceCommandOption> {
    const commands =
      block.meta.commands?.flatMap((commandGroupId) => {
        return CommandGroups.getCommandGroupByValue(commandGroupId).value;
      }) ?? [];

    const commandOptionList: Array<IDiceCommandOption> = commands.map(
      (command) => {
        return {
          label: block.label,
          type: RollType.DiceCommand,
          command: command,
        };
      }
    );
    commandOptionList.push({
      label: block.label,
      type: RollType.Modifier,
      modifier: parseInt(block.value) || 0,
    });
    return commandOptionList;
  },
};
