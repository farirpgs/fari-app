import { Box, Divider, Grid, Link, useTheme } from "@mui/material";
import React, { useContext } from "react";
import { ContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { ISeparatorBlock } from "../../../../../../domains/character/types";
import { useEvent } from "../../../../../../hooks/useEvent/useEvent";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { MiniThemeContext } from "../../MiniThemeContext";
import { IBlockHandlers } from "../../types/IBlockComponentProps";
import { ThemedLabel } from "../ThemedLabel";

export const BlockSeparator = React.memo(
  (
    props: {
      label: string | undefined;
      hideDivider: boolean | undefined;
      hasLabel: boolean | undefined;
      advanced: boolean;
      readonly: boolean | undefined;
      dataCy?: string;
    } & IBlockHandlers<ISeparatorBlock>,
  ) => {
    const dividerHeight = "3px";
    const dividerMargin = ".5rem 0";
    const miniTheme = useContext(MiniThemeContext);

    if (props.hideDivider) {
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
                      sx={{
                        height: dividerHeight,
                        margin: dividerMargin,
                        backgroundColor: miniTheme.textPrimary,
                      }}
                    />
                  </Grid>
                  {props.hasLabel && (
                    <>
                      <Grid item>{"//"}</Grid>
                      <Grid item>
                        <ThemedLabel
                          sx={{
                            textAlign: "center",
                            minWidth: "3rem",
                            fontSize: "1.1rem",
                            display: "flex",
                          }}
                        >
                          <ContentEditable
                            readonly={!props.advanced}
                            border={props.advanced}
                            dataCy={`${props.dataCy}.label`}
                            value={props.label || ""}
                            onChange={props.onLabelChange}
                          />
                        </ThemedLabel>
                      </Grid>
                      <Grid item>{"//"}</Grid>
                    </>
                  )}
                  {props.hasLabel && (
                    <Grid item xs>
                      <Divider
                        sx={{
                          height: dividerHeight,
                          margin: dividerMargin,
                          backgroundColor: miniTheme.textPrimary,
                        }}
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
  },
);
BlockSeparator.displayName = "BlockSeparator";

export const BlockSeparatorActions = React.memo(
  (
    props: {
      hasLabel: boolean | undefined;
      hideDivider: boolean | undefined;
      advanced: boolean;
      readonly: boolean | undefined;
      dataCy?: string;
    } & IBlockHandlers<ISeparatorBlock>,
  ) => {
    const theme = useTheme();
    const { t } = useTranslate();

    const handleShowHideDivider = useEvent(() => {
      props.onMetaChange((prev) => ({
        ...prev,
        hideDivider: !prev.hideDivider,
      }));
    });

    const handleAddRemoveLabel = useEvent(() => {
      props.onMetaChange((prev) => ({
        ...prev,
        hasLabel: !prev.hasLabel,
      }));
    });

    return (
      <>
        <Grid item>
          <Box />
          <Link
            component="button"
            variant="caption"
            sx={{
              color: theme.palette.primary.main,
            }}
            onClick={handleShowHideDivider}
            underline="hover"
          >
            {props.hideDivider
              ? t("character-dialog.control.show-divider")
              : t("character-dialog.control.hide-divider")}
          </Link>
        </Grid>
        {!props.hideDivider && (
          <Grid item>
            <Link
              component="button"
              variant="caption"
              sx={{
                color: theme.palette.primary.main,
              }}
              onClick={handleAddRemoveLabel}
              underline="hover"
            >
              {props.hasLabel
                ? t("character-dialog.control.remove-label")
                : t("character-dialog.control.add-label")}
            </Link>
          </Grid>
        )}
      </>
    );
  },
);
BlockSeparatorActions.displayName = "BlockSeparatorActions";
