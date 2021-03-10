import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import useTheme from "@material-ui/core/styles/useTheme";
import Typography from "@material-ui/core/Typography";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import React from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { IPointCounterBlock } from "../../../../../../domains/character/types";
import { Font } from "../../../../../../domains/font/Font";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";
import { CharacterCircleBox } from "../CharacterCircleBox";

export function BlockPointCounter(
  props: IBlockComponentProps<IPointCounterBlock> & {}
) {
  const theme = useTheme();
  const isLabelVisible =
    !!previewContentEditable({ value: props.block.label }) || props.editing;

  return (
    <>
      <Box>
        {isLabelVisible && (
          <Box>
            <Grid container justify={"space-between"} wrap="nowrap" spacing={1}>
              <Grid item className={css({ flex: "1 1 auto" })}>
                <FateLabel
                  display="inline"
                  className={css({
                    width: "100%",
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    paddingBottom: ".5rem",
                    display: "inline-block",
                  })}
                  align={"center"}
                >
                  <ContentEditable
                    data-cy={`character-dialog.${props.section.label}.${props.block.label}.label`}
                    readonly={!props.editing}
                    border={props.editing}
                    value={props.block.label}
                    onChange={(value) => {
                      props.onLabelChange(value);
                    }}
                  />
                </FateLabel>
              </Grid>
            </Grid>
          </Box>
        )}

        <Grid
          container
          justify="center"
          alignItems="center"
          spacing={2}
          wrap="nowrap"
        >
          {!props.readonly && (
            <Grid item>
              <IconButton
                onClick={() => {
                  const intValue = parseInt(props.block.value) || 0;
                  if (intValue - 1 === 0) {
                    props.onValueChange("0");
                  }
                  props.onValueChange((intValue - 1).toString());
                }}
              >
                <RemoveCircleOutlineOutlinedIcon />
              </IconButton>
            </Grid>
          )}
          <Grid item>
            <CharacterCircleBox fontSize="1.2rem" minWidth="4rem">
              <ContentEditable
                data-cy={`character-dialog.${props.section.label}.${props.block.label}.value`}
                value={props.block.value}
                border
                readonly={props.readonly}
                onChange={(value, e) => {
                  const intValue = parseInt(value) || 0;
                  props.onValueChange(intValue.toString());
                }}
              />
            </CharacterCircleBox>
          </Grid>
          {props.block.meta.max !== undefined && (
            <>
              <Grid item>
                <Typography
                  className={css({
                    fontSize: "2rem",
                    color: "#bdbdbd",
                    lineHeight: Font.lineHeight(2),
                  })}
                >
                  {"/"}
                </Typography>
              </Grid>
              <Grid item>
                <CharacterCircleBox fontSize="1.2rem" minWidth="4rem">
                  <ContentEditable
                    data-cy={`character-dialog.${props.section.label}.${props.block.label}.value`}
                    value={props.block.meta.max ?? ""}
                    border
                    readonly={props.readonly}
                    onChange={(max, e) => {
                      const intValue = parseInt(max) || 0;
                      props.onMetaChange({
                        ...props.block.meta,
                        max: intValue.toString(),
                      });
                    }}
                  />
                </CharacterCircleBox>
              </Grid>
            </>
          )}
          {!props.readonly && (
            <Grid item>
              <IconButton
                onClick={() => {
                  const intValue = parseInt(props.block.value) || 0;
                  props.onValueChange((intValue + 1).toString());
                }}
              >
                <AddCircleOutlineOutlinedIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
        {props.block.meta.max !== undefined && !props.readonly && (
          <Grid container justify="center">
            <Grid item>
              <Link
                component="button"
                variant="caption"
                className={css({
                  color: theme.palette.primary.main,
                })}
                onClick={() => {
                  props.onValueChange(props.block.meta.max ?? "1");
                }}
              >
                {"Refresh"}
              </Link>
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
}
BlockPointCounter.displayName = "BlockPointCounter";

export function BlockPointCounterActions(
  props: IBlockActionComponentProps<IPointCounterBlock>
) {
  const theme = useTheme();
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
              isMainPointCounter: !props.block.meta.isMainPointCounter,
            });
          }}
        >
          {props.block.meta.isMainPointCounter ? "Unstar" : "Star"}
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
            props.onMetaChange({
              ...props.block.meta,
              max: props.block.meta.max === undefined ? "1" : undefined,
            });
          }}
        >
          {props.block.meta.max === undefined ? "With Max" : "Without Max"}
        </Link>
      </Grid>
    </>
  );
}

BlockPointCounterActions.displayName = "BlockPointCounterActions";
