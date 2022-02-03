import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import React from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { IInfoTextBlock } from "../../../../../../domains/character/types";
import { IBlockComponentProps } from "../../types/IBlockComponentProps";

export function BlockInfoText(
  props: IBlockComponentProps<IInfoTextBlock> & {}
) {
  const isLabelVisible =
    !!previewContentEditable({ value: props.block.label }) || props.advanced;

  return (
    <>
      <Box>
        {isLabelVisible && (
          <Box>
            <FateLabel display="inline">
              <ContentEditable
                readonly={props.readonly || !props.advanced}
                border={props.advanced}
                data-cy={`${props.dataCy}.label`}
                value={props.block.label || ""}
                onChange={(value) => {
                  props.onLabelChange(value);
                }}
              />
            </FateLabel>
          </Box>
        )}
        <Box>
          <FormHelperText>
            <ContentEditable
              readonly={props.readonly || !props.advanced}
              border={props.advanced}
              data-cy={`${props.dataCy}.value`}
              value={props.block.value}
              onChange={(value) => {
                props.onValueChange(value);
              }}
            />
          </FormHelperText>
        </Box>
      </Box>
    </>
  );
}
BlockInfoText.displayName = "BlockInfoText";
