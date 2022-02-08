import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import React from "react";
import { ContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { IInfoTextBlock } from "../../../../../../domains/character/types";
import { IBlockComponentProps } from "../../types/IBlockComponentProps";

export function BlockInfoText(
  props: IBlockComponentProps<IInfoTextBlock> & {}
) {
  return (
    <>
      <Box>
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
