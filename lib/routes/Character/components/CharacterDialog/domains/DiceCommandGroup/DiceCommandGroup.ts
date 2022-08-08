import {
  IBlock,
  IDicePoolBlock,
  ISkillBlock,
} from "../../../../../../domains/character/types";

export const DiceCommandGroup = {
  getCommandSetById(commandId: IDicePoolBlock) {},
  getCommandSetOptionsFromBlock(
    block: IBlock & (IDicePoolBlock | ISkillBlock)
  ) {
    // const result =
    //   block.meta?.commands?.map((commandId) => {
    //     return this.getCommandSetById(commandId);
    //   }) ?? [];
    // return result;
  },
};
