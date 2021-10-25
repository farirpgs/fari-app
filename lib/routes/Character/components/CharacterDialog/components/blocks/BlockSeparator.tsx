import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { ContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { ISeparatorBlock } from "../../../../../../domains/character/types";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";

export function BlockSeparator(props: IBlockComponentProps<ISeparatorBlock>) {
  const theme = useTheme();
  const dividerHeight = "3px";
  const dividerMargin = ".5rem 0";

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
            <Box>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs>
                  <Divider
                    className={css({
                      height: dividerHeight,
                      margin: dividerMargin,
                      backgroundColor: theme.palette.text.secondary,
                    })}
                  />
                </Grid>
                {props.block.meta?.hasLabel && (
                  <>
                    <Grid item>{"//"}</Grid>
                    <Grid item>
                      <FateLabel
                        align="center"
                        className={css({
                          minWidth: "3rem",
                          fontSize: "1.1rem",
                          display: "flex",
                        })}
                      >
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
                    </Grid>
                    <Grid item>{"//"}</Grid>
                  </>
                )}
                {props.block.meta?.hasLabel && (
                  <Grid item xs>
                    <Divider
                      className={css({
                        height: dividerHeight,
                        margin: dividerMargin,
                        backgroundColor: theme.palette.text.secondary,
                      })}
                    />
                  </Grid>
                )}
              </Grid>
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
          underline="hover"
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
