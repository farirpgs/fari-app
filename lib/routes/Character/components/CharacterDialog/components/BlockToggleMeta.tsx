import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { Checkbox } from "@mui/material";
import React from "react";
import {
  IBlock,
  IDicePoolBlock,
  INumericBlock,
  ISkillBlock,
  ITextBlock,
} from "../../../../../domains/character/types";

export function BlockToggleMeta<
  TBlock extends IBlock &
    (ITextBlock | INumericBlock | ISkillBlock | IDicePoolBlock),
>(props: {
  readonly: boolean | undefined;
  dataCy: string | undefined;
  checked: boolean | undefined;
  onMetaChange(producer: (prev: TBlock["meta"]) => TBlock["meta"]): void;
}) {
  return (
    <Checkbox
      data-cy={`${props.dataCy}.toggle`}
      size="small"
      icon={<CircleOutlinedIcon htmlColor="currentColor" />}
      checkedIcon={<CircleIcon htmlColor="currentColor" />}
      checked={props.checked}
      color="default"
      disabled={props.readonly}
      sx={{
        color: "inherit",
        padding: "0",
      }}
      onChange={() => {
        props.onMetaChange((prev) => {
          return {
            ...prev,
            checked: !prev.checked,
          };
        });
      }}
    />
  );
}
BlockToggleMeta.displayName = "BlockToggleMeta";
