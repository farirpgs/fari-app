import { css } from "@emotion/css";
import Checkbox from "@material-ui/core/Checkbox";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import React from "react";
import {
  IBlock,
  INumericBlock,
  ISection,
  ISkillBlock,
  ITextBlock,
} from "../../../../../domains/character/types";

export function BlockToggleMeta<
  TBlock extends IBlock & (ITextBlock | INumericBlock | ISkillBlock)
>(props: {
  readonly: boolean | undefined;
  pageIndex: number;
  sectionIndex: number;
  section: ISection;
  block: TBlock;
  blockIndex: number;
  onMetaChange(meta: TBlock["meta"]): void;
}) {
  return (
    <Checkbox
      data-cy={`character-dialog.${props.section.label}.${props.block.label}.box.${props.blockIndex}.checked`}
      color="primary"
      size="small"
      icon={<RadioButtonUncheckedIcon />}
      checkedIcon={<CheckCircleIcon />}
      checked={props.block.meta.checked}
      disabled={props.readonly}
      className={css({
        padding: "0",
      })}
      onChange={(event) => {
        props.onMetaChange({
          ...props.block.meta,
          checked: !props.block.meta.checked,
        });
      }}
    />
  );
}
BlockToggleMeta.displayName = "BlockToggleMeta";
