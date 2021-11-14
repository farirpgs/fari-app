import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { default as React } from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { Delays } from "../../../../../../constants/Delays";
import { IPointCounterBlock } from "../../../../../../domains/character/types";
import { Font } from "../../../../../../domains/font/Font";
import { useLazyState } from "../../../../../../hooks/useLazyState/useLazyState";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";
import { CircleTextField } from "../CircleTextField";

export function usePointCounter(props: {
  points: string;
  maxPoints: string | undefined;
  onPointsChange(newValue: string): void;
  onMaxPointsChange(newValue: string): void;
}) {
  const [internalPoints, setInternalPoints] = useLazyState({
    value: props.points,
    onChange: props.onPointsChange,
    delay: Delays.field,
  });
  const [internalMaxPoints, setInternalMaxPoints] = useLazyState({
    value: props.maxPoints,
    onChange: props.onMaxPointsChange,
    delay: Delays.field,
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

  function incrementMax() {
    const intValue = parseInt(internalMaxPoints ?? "") || 0;
    setInternalMaxPoints((intValue + 1).toString());
  }

  function decrementMax() {
    const intValue = parseInt(internalMaxPoints ?? "") || 0;
    if (intValue - 1 === 0) {
      setInternalMaxPoints("0");
    }
    setInternalMaxPoints((intValue - 1).toString());
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
      incrementMax,
      decrementMax,
      refresh,
    },
  };
}

export function BlockPointCounter(
  props: IBlockComponentProps<IPointCounterBlock>
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
            <Grid
              container
              justifyContent={"space-between"}
              wrap="nowrap"
              spacing={1}
            >
              <Grid item className={css({ flex: "1 1 auto" })}>
                <FateLabel
                  display="inline"
                  align="center"
                  className={css({
                    width: "100%",
                    display: "inline-block",
                  })}
                >
                  <ContentEditable
                    data-cy={`${props.dataCy}.label`}
                    readonly={props.readonly || !props.advanced}
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
          justifyContent="center"
          wrap="nowrap"
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <CircleTextField
              data-cy={`${props.dataCy}.value`}
              highlight={props.block.meta.isMainPointCounter}
              value={pointsManager.state.points}
              onChange={(newValue) => {
                pointsManager.actions.setPoints(newValue);
              }}
              onIncrement={() => {
                pointsManager.actions.increment();
              }}
              onDecrement={() => {
                pointsManager.actions.decrement();
              }}
            />
          </Grid>
          {props.block.meta.max !== undefined && (
            <>
              <Grid item>
                <Typography
                  className={css({
                    fontSize: "2rem",
                    color: theme.palette.text.secondary,
                    lineHeight: Font.lineHeight(2),
                  })}
                >
                  {"/"}
                </Typography>
              </Grid>
              <Grid item>
                <CircleTextField
                  data-cy={`${props.dataCy}.max`}
                  highlight={props.block.meta.isMainPointCounter}
                  value={pointsManager.state.maxPoints ?? ""}
                  onChange={(newMax) => {
                    pointsManager.actions.setMaxPoints(newMax);
                  }}
                  onIncrement={() => {
                    pointsManager.actions.incrementMax();
                  }}
                  onDecrement={() => {
                    pointsManager.actions.decrementMax();
                  }}
                />
              </Grid>
            </>
          )}
        </Grid>
        {canRefresh && (
          <Grid container justifyContent="center">
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
                underline="hover"
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
  props: IBlockActionComponentProps<IPointCounterBlock> & {
    onMainPointCounterChange?(): void;
  }
) {
  const theme = useTheme();
  const { t } = useTranslate();
  return (
    <>
      {props.onMainPointCounterChange && (
        <Grid item>
          <Link
            component="button"
            variant="caption"
            className={css({
              color: theme.palette.primary.main,
            })}
            onClick={() => {
              props.onMainPointCounterChange?.();
            }}
            underline="hover"
          >
            {props.block.meta.isMainPointCounter
              ? t("character-dialog.control.unset-main-counter")
              : t("character-dialog.control.set-main-counter")}
          </Link>
        </Grid>
      )}
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
          underline="hover"
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
