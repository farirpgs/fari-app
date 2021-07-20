import { css } from "@emotion/css";
import Checkbox from "@material-ui/core/Checkbox";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import React from "react";
import {
  IBlock,
  INumericBlock,
  ISkillBlock,
  ITextBlock,
} from "../../../../../domains/character/types";

export function BlockToggleMeta<
  TBlock extends IBlock & (ITextBlock | INumericBlock | ISkillBlock)
>(props: {
  readonly: boolean | undefined;
  dataCy: string;
  block: TBlock;
  onMetaChange(meta: TBlock["meta"]): void;
}) {
  return (
    <Checkbox
      data-cy={`${props.dataCy}.toggle`}
      color="primary"
      size="small"
      icon={<RadioButtonUncheckedIcon />}
      checkedIcon={<CheckCircleIcon />}
      checked={props.block.meta.checked}
      disabled={props.readonly}
      className={css({
        padding: "0",
      })}
      onChange={() => {
        props.onMetaChange({
          ...props.block.meta,
          checked: !props.block.meta.checked,
        });
      }}
    />
  );
}
BlockToggleMeta.displayName = "BlockToggleMeta";
