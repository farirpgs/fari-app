import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import useTheme from "@material-ui/core/styles/useTheme";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import {
  IDropDownBlock,
  ITextBlock,
} from "../../../../../../domains/character/types";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";
import { BlockToggleMeta } from "../BlockToggleMeta";

export function BlockDropDown(
  props: IBlockComponentProps<IDropDownBlock> & {}
) {
  const isLabelVisible =
    !!previewContentEditable({ value: props.block.label }) || props.advanced;
  const isSlotTrackerVisible =
    props.block.meta?.checked === true || props.block.meta?.checked === false;

  return (
    <>
      <Box>
        <Grid container spacing={1} justify="space-between" wrap="nowrap">
          <Grid item xs>
            {isLabelVisible && (
              <Box>
                <FateLabel display="inline">
                  <ContentEditable
                    readonly={props.readonly}
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
              <Typography>
                <Select
                  data-cy={`${props.dataCy}.value`}
                  value={props.block.value}
                  onChange={(name, value) => {
                    if (value) {
                      props.onValueChange(value.toString());
                    }
                  }}
                >
                  {!!props.block.meta?.possibleValues &&
                    props.block.meta?.possibleValues.map((possibleValue) => {
                      return (
                        <MenuItem key={possibleValue} value={possibleValue}>
                          {possibleValue}
                        </MenuItem>
                      );
                    })}
                </Select>
              </Typography>
            </Box>
          </Grid>
          {isSlotTrackerVisible && (
            <Grid item className={css({ marginLeft: "auto" })}>
              <BlockToggleMeta
                readonly={props.readonly}
                dataCy={props.dataCy}
                block={props.block}
                onMetaChange={props.onMetaChange}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}
BlockDropDown.displayName = "BlockDropDown";

export function BlockDropDownActions(
  props: IBlockActionComponentProps<ITextBlock>
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

BlockDropDownActions.displayName = "BlockDropDownActions";
