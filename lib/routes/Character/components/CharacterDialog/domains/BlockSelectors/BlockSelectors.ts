import { previewContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { BlockType } from "../../../../../../domains/character/types";
import {
  IDiceCommandId,
  IRollablePool,
} from "../../../../../../domains/dice/Dice";

export const BlockSelectors = {
  getPoolFromBlock(props: {
    type: BlockType;
    hideModifier: boolean | undefined;
    label: string | undefined;
    value: string | undefined;
    commands: Array<IDiceCommandId> | undefined;
  }): IRollablePool {
    let modifier: number | undefined;
    if (props.type === BlockType.Skill && !props.hideModifier) {
      modifier = parseInt(props.value || "") || 0;
    }
    return {
      label: previewContentEditable({ value: props.label }),
      modifier: modifier,
      commandIds: props.commands ?? [],
    };
  },
};
