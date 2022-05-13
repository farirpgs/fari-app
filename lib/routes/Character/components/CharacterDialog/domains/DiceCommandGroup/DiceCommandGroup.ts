import {
  IBlock,
  IDicePoolBlock,
  ISkillBlock,
} from "../../../../../../domains/character/types";
import { Dice } from "../../../../../../domains/dice/Dice";

export const DiceCommandGroup = {
  getCommandSetOptionsFromBlock(
    block: IBlock & (IDicePoolBlock | ISkillBlock)
  ) {
    const result =
      block.meta?.commands?.map((commandId) => {
        return Dice.getSetOptions(commandId);
      }) ?? [];

    return result;
  },
};
