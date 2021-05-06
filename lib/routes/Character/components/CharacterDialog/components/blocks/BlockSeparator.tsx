import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import useTheme from "@material-ui/core/styles/useTheme";
import React from "react";
import { Link } from "react-router-dom";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { ISeparatorBlock } from "../../../../../../domains/character/types";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";

export function BlockSeparator(props: IBlockComponentProps<ISeparatorBlock>) {
  const isLabelVisible =
    props.block.meta?.hasLabel &&
    (props.advanced || !!previewContentEditable({ value: props.block.label }));

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

export function BlockSeparatorActions(
  props: IBlockActionComponentProps<ISeparatorBlock>
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
              hasLabel: !props.block.meta.hasLabel,
            });
          }}
        >
          {props.block.meta.hasLabel
            ? t("character-dialog.control.remove-label")
            : t("character-dialog.control.add-label")}
        </Link>
      </Grid>
    </>
  );
}
BlockSeparatorActions.displayName = "BlockSeparatorActions";
