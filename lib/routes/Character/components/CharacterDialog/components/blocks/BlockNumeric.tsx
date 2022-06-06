import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { ContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { INumericBlock } from "../../../../../../domains/character/types";
import { useEvent } from "../../../../../../hooks/useEvent/useEvent";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { IBlockHandlers } from "../../types/IBlockComponentProps";
import { BlockToggleMeta } from "../BlockToggleMeta";
import { CircleTextField } from "../CircleTextField";
import { ThemedLabel } from "../ThemedLabel";

export const BlockNumeric = React.memo(
  (
    props: {
      label: string | undefined;
      value: string | undefined;
      checked: boolean | undefined;
      advanced: boolean;
      readonly: boolean | undefined;
      dataCy?: string;
    } & IBlockHandlers<INumericBlock>
  ) => {
    const isSlotTrackerVisible =
      props.checked === true || props.checked === false;

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
                dataCy={`${props.dataCy}.value`}
                value={props.value}
                readonly={props.readonly}
                onChange={props.onValueChange}
              />
            </Grid>
            <Grid item xs>
              <ThemedLabel>
                <ContentEditable
                  readonly={props.readonly}
                  border={props.advanced}
                  dataCy={`${props.dataCy}.label`}
                  value={props.label || ""}
                  onChange={props.onLabelChange}
                />
              </ThemedLabel>
            </Grid>
            {isSlotTrackerVisible && (
              <Grid item>
                <BlockToggleMeta
                  dataCy={props.dataCy}
                  readonly={props.readonly}
                  checked={props.checked}
                  onMetaChange={props.onMetaChange}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </>
    );
  }
);

export const BlockNumericActions = React.memo(
  (
    props: {
      value: string | undefined;
      label: string | undefined;
      checked: boolean | undefined;
    } & IBlockHandlers<INumericBlock>
  ) => {
    const theme = useTheme();
    const { t } = useTranslate();

    const handleAddRemoveToggle = useEvent(() => {
      props.onMetaChange((prev) => ({
        ...prev,
        checked: prev.checked === undefined ? false : undefined,
      }));
    });

    return (
      <>
        <Grid item>
          <Link
            component="button"
            variant="caption"
            className={css({
              color: theme.palette.primary.main,
            })}
            onClick={handleAddRemoveToggle}
            underline="hover"
          >
            {props.checked === undefined
              ? t("character-dialog.control.add-toggle")
              : t("character-dialog.control.remove-toggle")}
          </Link>
        </Grid>
      </>
    );
  }
);
