import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import useTheme from "@material-ui/core/styles/useTheme";
import React from "react";
import { ContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { INumericBlock } from "../../../../../../domains/character/types";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";
import { BlockToggleMeta } from "../BlockToggleMeta";
import { CircleTextField } from "./BlockSkill";

export function BlockNumeric(props: IBlockComponentProps<INumericBlock> & {}) {
  const isSlotTrackerVisible =
    props.block.meta?.checked === true || props.block.meta?.checked === false;

  return (
    <>
      <Box>
        <Grid
          container
          spacing={1}
          justify="space-between"
          wrap="nowrap"
          alignItems="center"
        >
          <Grid item>
            <CircleTextField
              data-cy={`character-dialog.${props.section.label}.${props.block.label}.value`}
              value={props.block.value}
              readonly={props.readonly}
              onChange={(newValue) => {
                props.onValueChange(newValue);
              }}
            />
          </Grid>
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
    </>
  );
}

export function BlockNumericActions(
  props: IBlockActionComponentProps<INumericBlock>
) {
  const theme = useTheme();
  const { t } = useTranslate();
  return (
    <>
      <Grid item>
        <Link
          component="button"
          variant="caption"
          className={css({
            color: theme.palette.primary.main,
          })}
          onClick={() => {
            props.onMetaChange({
              ...props.block.meta,
              checked:
                props.block.meta.checked === undefined ? false : undefined,
            });
          }}
        >
          {props.block.meta.checked === undefined
            ? t("character-dialog.control.add-toggle")
            : t("character-dialog.control.remove-toggle")}
        </Link>
      </Grid>
    </>
  );
}
