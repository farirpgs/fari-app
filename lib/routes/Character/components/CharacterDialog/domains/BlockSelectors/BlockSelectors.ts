import { previewContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { BlockType } from "../../../../../../domains/character/types";
import {
  IDiceCommandSetId,
  IRollGroup,
} from "../../../../../../domains/dice/Dice";

export const BlockSelectors = {
  getRollGroupFromBlock(props: {
    type: BlockType;
    hideModifier: boolean | undefined;
    label: string | undefined;
    value: string | undefined;
    commands: Array<IDiceCommandSetId> | undefined;
  }): IRollGroup {
    let modifier: number | undefined;
    if (props.type === BlockType.Skill && !props.hideModifier) {
      modifier = parseInt(props.value || "") || 0;
    }
    return {
      label: previewContentEditable({ value: props.label }),
      modifier: modifier,
      commandSets:
        props.commands?.map((commandGroupId) => ({
          id: commandGroupId,
        })) ?? [],
    };
  },
};
