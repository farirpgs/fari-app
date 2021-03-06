import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import useTheme from "@material-ui/core/styles/useTheme";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { ITextBlock } from "../../../../../../domains/character/types";
import { IBlockComponentProps } from "../../types/IBlockComponentProps";
import { BlockToggleMeta } from "../BlockToggleMeta";

export function BlockText(props: IBlockComponentProps<ITextBlock> & {}) {
  const theme = useTheme();
  const isLabelVisible =
    !!previewContentEditable({ value: props.block.label }) || props.advanced;
  const isSlotTrackerVisible = props.block.meta?.checked !== undefined;

  return (
    <>
      {isLabelVisible && (
        <Box>
          <Grid container spacing={1} justify="space-between" wrap="nowrap">
            <Grid item xs>
              <FateLabel display="inline">
                <ContentEditable
                  readonly={!props.advanced}
                  border={props.advanced}
                  data-cy={`character-dialog.${props.section.label}.${props.block.label}.label`}
                  value={props.block.label}
                  onChange={(value) => {
                    props.onLabelChange(value);
                  }}
                />
              </FateLabel>
            </Grid>
            {isSlotTrackerVisible && (
              <Grid item>
                <BlockToggleMeta
                  readonly={props.readonly}
                  pageIndex={props.pageIndex}
                  sectionIndex={props.sectionIndex}
                  section={props.section}
                  block={props.block}
                  blockIndex={props.blockIndex}
                  onMetaChange={props.onMetaChange}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      )}
      <Box>
        <Typography>
          <ContentEditable
            border
            data-cy={`character-dialog.${props.section.label}.${props.block.label}.value`}
            readonly={props.readonly}
            value={props.block.value}
            onChange={(value) => {
              props.onValueChange(value);
            }}
          />
        </Typography>
      </Box>
    </>
  );
}
BlockText.displayName = "BlockText";
