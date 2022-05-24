import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useContext, useEffect } from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { ITextBlock } from "../../../../../../domains/character/types";
import { useEvent } from "../../../../../../hooks/useEvent/useEvent";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { MiniThemeContext } from "../../MiniThemeContext";
import { IBlockHandlers } from "../../types/IBlockComponentProps";
import { BlockToggleMeta } from "../BlockToggleMeta";
import { ThemedLabel } from "../ThemedLabel";

export const BlockText = React.memo(function (
  props: {
    label: string | undefined;
    value: string | undefined;
    checked: boolean | undefined;
    advanced: boolean;
    readonly: boolean | undefined;
    dataCy?: string;
  } & IBlockHandlers<ITextBlock>
) {
  const isSlotTrackerVisible =
    props.checked === true || props.checked === false;
  console.log("BlockText: RENDER");

  useEffect(() => {
    console.log("BlockText mount");
    return () => {
      console.log("BlockText unmount");
    };
  }, []);

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
            <BlockTextLabel
              label={props.label}
              advanced={props.advanced}
              readonly={props.readonly}
              dataCy={props.dataCy}
              onChange={props.onLabelChange}
            />
            <BlockTextValue
              value={props.value}
              readonly={props.readonly}
              dataCy={props.dataCy}
              onChange={props.onValueChange}
            />
          </Grid>
          {isSlotTrackerVisible && (
            <Grid item className={css({ marginLeft: "auto" })}>
              <BlockToggleMeta
                readonly={props.readonly}
                dataCy={props.dataCy}
                checked={props.checked}
                onMetaChange={props.onMetaChange}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
});
BlockText.displayName = "BlockText";

function BlockTextLabel(props: {
  label: string | undefined;
  advanced: boolean;
  readonly: boolean | undefined;
  dataCy: string | undefined;
  onChange(value: string): void;
}) {
  const isLabelVisible =
    props.label !== undefined &&
    (!!previewContentEditable({ value: props.label }) || props.advanced);

  const miniTheme = useContext(MiniThemeContext);

  if (!isLabelVisible) {
    return null;
  }

  return (
    <Box>
      <ThemedLabel>
        <ContentEditable
          readonly={props.readonly || !props.advanced}
          border={props.advanced}
          borderColor={miniTheme.borderColor}
          data-cy={`${props.dataCy}.label`}
          value={props.label || ""}
          onChange={props.onChange}
        />
      </ThemedLabel>
    </Box>
  );
}

function BlockTextValue(props: {
  value: string | undefined;
  dataCy: string | undefined;
  readonly: boolean | undefined;
  onChange(value: string): void;
}) {
  const isFieldVisible = props.value !== undefined;
  const miniTheme = useContext(MiniThemeContext);

  if (!isFieldVisible) {
    return null;
  }
  return (
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
          data-cy={`${props.dataCy}.value`}
          readonly={props.readonly}
          value={props.value ?? ""}
          onChange={props.onChange}
        />
      </Typography>
    </Box>
  );
}

export const BlockTextActions = React.memo(
  (
    props: {
      value: string | undefined;
      label: string | undefined;
      checked: boolean | undefined;
    } & IBlockHandlers<ITextBlock>
  ) => {
    const theme = useTheme();
    const { t } = useTranslate();

    const handleAddRemoveToggle = useEvent(() => {
      props.onMetaChange((prev) => ({
        ...prev,
        checked: prev.checked === undefined ? false : undefined,
      }));
    });

    const handleAddRemoveField = useEvent(() => {
      const value = props.value;
      if (value === undefined) {
        props.onValueChange("");
      } else {
        props.onValueChange(undefined);
      }
    });

    const handleAddRemoveLabel = useEvent(() => {
      const label = props.label;
      if (label === undefined) {
        props.onLabelChange("");
      } else {
        props.onLabelChange(undefined);
      }
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
        <Grid item>
          <Link
            component="button"
            variant="caption"
            className={css({
              color: theme.palette.primary.main,
            })}
            onClick={handleAddRemoveField}
            underline="hover"
          >
            {props.value === undefined
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
            onClick={handleAddRemoveLabel}
            underline="hover"
          >
            {props.label === undefined
              ? t("character-dialog.control.add-label")
              : t("character-dialog.control.remove-label")}
          </Link>
        </Grid>
      </>
    );
  }
);
BlockTextActions.displayName = "BlockTextActions";
