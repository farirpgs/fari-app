import { css } from "@emotion/css";
import Checkbox from "@material-ui/core/Checkbox";
import CircleIcon from "@material-ui/icons/Circle";
import CircleOutlinedIcon from "@material-ui/icons/CircleOutlined";
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
      size="small"
      icon={<CircleOutlinedIcon htmlColor="currentColor" />}
      checkedIcon={<CircleIcon htmlColor="currentColor" />}
      checked={props.block.meta.checked}
      color="default"
      disabled={props.readonly}
      className={css({
        color: "inherit",
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
