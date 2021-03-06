import { css } from "@emotion/css";
import Checkbox from "@material-ui/core/Checkbox";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import React from "react";
import {
  IBlock,
  ISection,
  ISkillBlock,
  ITextBlock,
} from "../../../../../domains/character/types";

export function BlockToggleMeta(props: {
  readonly: boolean | undefined;
  pageIndex: number;
  sectionIndex: number;
  section: ISection;
  block: IBlock & (ITextBlock | ISkillBlock);
  blockIndex: number;
  onMetaChange(meta: any): void;
}) {
  return (
    <Checkbox
      data-cy={`character-dialog.${props.section.label}.${props.block.label}.box.${props.blockIndex}.checked`}
      color="primary"
      size="small"
      icon={<RadioButtonUncheckedIcon />}
      checkedIcon={<CheckCircleIcon />}
      checked={props.block.meta.checked}
      className={css({
        padding: "0",
      })}
      onChange={(event) => {
        if (props.readonly) {
          return;
        }
        props.onMetaChange({
          ...props.block.meta,
          checked: !props.block.meta.checked,
        } as ITextBlock["meta"]);
      }}
    />
  );
}
BlockToggleMeta.displayName = "BlockToggleMeta";
