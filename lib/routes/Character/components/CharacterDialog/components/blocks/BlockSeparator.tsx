import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import React from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { ISeparatorBlock } from "../../../../../../domains/character/types";
import { IBlockComponentProps } from "../../types/IBlockComponentProps";

export function BlockSeparator(props: IBlockComponentProps<ISeparatorBlock>) {
  const isLabelVisible =
    props.advanced || !!previewContentEditable({ value: props.block.label });

  return (
    <>
      <Box>
        <Grid container spacing={1} justify="space-between" wrap="nowrap">
          <Grid item xs>
            {isLabelVisible && (
              <Box>
                <FateLabel display="inline">
                  <ContentEditable
                    readonly={!props.advanced}
                    border={props.advanced}
                    data-cy={`${props.dataCy}.label`}
                    value={props.block.label}
                    onChange={(value) => {
                      props.onLabelChange(value);
                    }}
                  />
                </FateLabel>
              </Box>
            )}
            <Box>
              <Divider />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
BlockSeparator.displayName = "BlockSeparator";
