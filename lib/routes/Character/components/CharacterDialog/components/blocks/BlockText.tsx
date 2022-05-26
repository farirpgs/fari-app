import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useContext } from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { ITextBlock } from "../../../../../../domains/character/types";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { MiniThemeContext } from "../../MiniThemeContext";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";
import { BlockToggleMeta } from "../BlockToggleMeta";
import { ThemedLabel } from "../ThemedLabel";

export function BlockText(props: IBlockComponentProps<ITextBlock> & {}) {
  const isLabelVisible =
    props.block.label !== undefined &&
    (!!previewContentEditable({ value: props.block.label }) || props.advanced);
  const isSlotTrackerVisible =
    props.block.meta?.checked === true || props.block.meta?.checked === false;

  const isFieldVisible = props.block.value !== undefined;
  const miniTheme = useContext(MiniThemeContext);

  return (
    <>
      <Box>
        <Grid
          container
          spacing={1}
          justifyContent="space-between"
          wrap="nowrap"
        >
          <Grid item xs>
            {isLabelVisible && (
              <Box>
                <ThemedLabel>
                  <ContentEditable
                    readonly={props.readonly || !props.advanced}
                    border={props.advanced}
                    borderColor={miniTheme.borderColor}
                    dataCy={`${props.dataCy}.label`}
                    value={props.block.label || ""}
                    onChange={(value) => {
                      props.onLabelChange(value);
                    }}
                  />
                </ThemedLabel>
              </Box>
            )}
            {isFieldVisible && (
              <Box>
                <Typography
                  className={css({
                    fontFamily: miniTheme.textFontFamily,
                    fontSize: `${miniTheme.textFontSize}rem`,
                    fontWeight: miniTheme.textFontWeight,
                  })}
                >
                  <ContentEditable
                    border
                    borderColor={miniTheme.borderColor}
                    dataCy={`${props.dataCy}.value`}
                    readonly={props.readonly}
                    value={props.block.value ?? ""}
                    onChange={(value) => {
                      props.onValueChange(value);
                    }}
                  />
                </Typography>
              </Box>
            )}
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
BlockText.displayName = "BlockText";

export function BlockTextActions(
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
          underline="hover"
        >
          {props.block.meta.checked === undefined
            ? t("character-dialog.control.add-toggle")
            : t("character-dialog.control.remove-toggle")}
        </Link>
      </Grid>
      <Grid item>
        <Link
          component="button"
          variant="caption"
          className={css({
            color: theme.palette.primary.main,
          })}
          onClick={() => {
            const value = props.block.value;
            if (value === undefined) {
              props.onValueChange("");
            } else {
              props.onValueChange(undefined);
            }
          }}
          underline="hover"
        >
          {props.block.value === undefined
            ? t("character-dialog.control.add-field")
            : t("character-dialog.control.remove-field")}
        </Link>
      </Grid>
      <Grid item>
        <Link
          component="button"
          variant="caption"
          className={css({
            color: theme.palette.primary.main,
          })}
          onClick={() => {
            const label = props.block.label;
            if (label === undefined) {
              props.onLabelChange("");
            } else {
              props.onLabelChange(undefined);
            }
          }}
          underline="hover"
        >
          {props.block.label === undefined
            ? t("character-dialog.control.add-label")
            : t("character-dialog.control.remove-label")}
        </Link>
      </Grid>
    </>
  );
}

BlockTextActions.displayName = "BlockTextActions";
