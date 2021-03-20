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
import { useLazyState } from "../../../../../../hooks/useLazyState/useLazyState";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";
import { CircleTextField } from "./BlockSkill";

export function usePointCounter(props: {
  points: string;
  maxPoints: string | undefined;
  onPointsChange(newValue: string): void;
  onMaxPointsChange(newValue: string): void;
}) {
  const [internalPoints, setInternalPoints] = useLazyState({
    value: props.points,
    onChange: props.onPointsChange,
    delay: 1000,
  });
  const [internalMaxPoints, setInternalMaxPoints] = useLazyState({
    value: props.maxPoints,
    onChange: props.onMaxPointsChange,
    delay: 1000,
  });

  function increment() {
    const intValue = parseInt(internalPoints) || 0;
    setInternalPoints((intValue + 1).toString());
  }

  function decrement() {
    const intValue = parseInt(internalPoints) || 0;
    if (intValue - 1 === 0) {
      setInternalPoints("0");
    }
    setInternalPoints((intValue - 1).toString());
  }

  function setPoints(newValue: string) {
    const intValue = parseInt(newValue) || 0;
    setInternalPoints(intValue.toString());
  }

  function setMaxPoints(newMax: string) {
    const intValue = parseInt(newMax) || 0;
    setInternalMaxPoints(intValue.toString());
  }

  function refresh() {
    setInternalPoints(internalMaxPoints ?? "1");
  }

  return {
    state: { points: internalPoints, maxPoints: internalMaxPoints },
    actions: {
      setPoints,
      setMaxPoints,
      increment,
      decrement,
      refresh,
    },
  };
}

export function BlockPointCounter(
  props: IBlockComponentProps<IPointCounterBlock> & {}
) {
  const { t } = useTranslate();

  const theme = useTheme();
  const isLabelVisible =
    !!previewContentEditable({ value: props.block.label }) || props.advanced;

  const pointsManager = usePointCounter({
    points: props.block.value,
    maxPoints: props.block.meta.max,
    onPointsChange(newValue) {
      props.onValueChange(newValue);
    },
    onMaxPointsChange(newMax) {
      props.onMetaChange({
        ...props.block.meta,
        max: newMax,
      });
    },
  });
  const canRefresh =
    props.block.meta.max !== undefined && !props.readonly && !props.advanced;
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
                    readonly={!props.advanced}
                    border={props.advanced}
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
                  pointsManager.actions.decrement();
                }}
              >
                <RemoveCircleOutlineOutlinedIcon />
              </IconButton>
            </Grid>
          )}
          <Grid item>
            <CircleTextField
              data-cy={`character-dialog.${props.section.label}.${props.block.label}.value`}
              value={pointsManager.state.points}
              onChange={(newValue) => {
                pointsManager.actions.setPoints(newValue);
              }}
            />
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
                <CircleTextField
                  data-cy={`character-dialog.${props.section.label}.${props.block.label}.max`}
                  value={pointsManager.state.maxPoints ?? ""}
                  onChange={(newMax) => {
                    pointsManager.actions.setMaxPoints(newMax);
                  }}
                />
              </Grid>
            </>
          )}
          {!props.readonly && (
            <Grid item>
              <IconButton
                onClick={() => {
                  pointsManager.actions.increment();
                }}
              >
                <AddCircleOutlineOutlinedIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
        {canRefresh && (
          <Grid container justify="center">
            <Grid item>
              <Link
                component="button"
                variant="caption"
                className={css({
                  color: theme.palette.primary.main,
                })}
                onClick={() => {
                  pointsManager.actions.refresh();
                }}
              >
                {t("character-dialog.control.refresh")}
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
              isMainPointCounter: !props.block.meta.isMainPointCounter,
            });
          }}
        >
          {props.block.meta.isMainPointCounter
            ? t("character-dialog.control.unset-main-counter")
            : t("character-dialog.control.set-main-counter")}
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
          {props.block.meta.max === undefined
            ? t("character-dialog.control.add-max")
            : t("character-dialog.control.remove-max")}
        </Link>
      </Grid>
    </>
  );
}

BlockPointCounterActions.displayName = "BlockPointCounterActions";
