import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import React, { useContext } from "react";
import { ContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { ISeparatorBlock } from "../../../../../../domains/character/types";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { MiniThemeContext } from "../../MiniThemeContext";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";
import { ThemedLabel } from "../ThemedLabel";

export function BlockSeparator(props: IBlockComponentProps<ISeparatorBlock>) {
  const dividerHeight = "3px";
  const dividerMargin = ".5rem 0";
  const miniTheme = useContext(MiniThemeContext);

  if (props.block.meta.hideDivider) {
    return null;
  }
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
                      backgroundColor: miniTheme.textPrimary,
                    })}
                  />
                </Grid>
                {props.block.meta?.hasLabel && (
                  <>
                    <Grid item>{"//"}</Grid>
                    <Grid item>
                      <ThemedLabel
                        className={css({
                          textAlign: "center",
                          minWidth: "3rem",
                          fontSize: "1.1rem",
                          display: "flex",
                        })}
                      >
                        <ContentEditable
                          readonly={!props.advanced}
                          border={props.advanced}
                          dataCy={`${props.dataCy}.label`}
                          value={props.block.label || ""}
                          onChange={(value) => {
                            props.onLabelChange(value);
                          }}
                        />
                      </ThemedLabel>
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
                        backgroundColor: miniTheme.textPrimary,
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
              hideDivider: !props.block.meta.hideDivider,
            });
          }}
          underline="hover"
        >
          {props.block.meta.hideDivider
            ? t("character-dialog.control.show-divider")
            : t("character-dialog.control.hide-divider")}
        </Link>
      </Grid>
      {!props.block.meta.hideDivider && (
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
      )}
    </>
  );
}
BlockSeparatorActions.displayName = "BlockSeparatorActions";
