import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { ContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { INumericBlock } from "../../../../../../domains/character/types";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";
import { BlockToggleMeta } from "../BlockToggleMeta";
import { CircleTextField } from "../CircleTextField";
import { ThemedLabel } from "../ThemedLabel";

export function BlockNumeric(props: IBlockComponentProps<INumericBlock> & {}) {
  const isSlotTrackerVisible =
    props.block.meta?.checked === true || props.block.meta?.checked === false;

  return (
    <>
      <Box>
        <Grid
          container
          spacing={1}
          justifyContent="space-between"
          wrap="nowrap"
          alignItems="center"
        >
          <Grid item>
            <CircleTextField
              data-cy={`${props.dataCy}.value`}
              value={props.block.value}
              readonly={props.readonly}
              onChange={(newValue) => {
                props.onValueChange(newValue);
              }}
            />
          </Grid>
          <Grid item xs>
            <ThemedLabel>
              <ContentEditable
                readonly={props.readonly}
                border={props.advanced}
                dataCy={`${props.dataCy}.label`}
                value={props.block.label || ""}
                onChange={(value) => {
                  props.onLabelChange(value);
                }}
              />
            </ThemedLabel>
          </Grid>
          {isSlotTrackerVisible && (
            <Grid item>
              <BlockToggleMeta
                dataCy={props.dataCy}
                readonly={props.readonly}
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
          underline="hover"
        >
          {props.block.meta.checked === undefined
            ? t("character-dialog.control.add-toggle")
            : t("character-dialog.control.remove-toggle")}
        </Link>
      </Grid>
    </>
  );
}
