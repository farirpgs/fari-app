import { css, cx } from "@emotion/css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { Delays } from "../../../../../../constants/Delays";
import { ISlotTrackerBlock } from "../../../../../../domains/character/types";
import { Id } from "../../../../../../domains/Id/Id";
import { useLazyState } from "../../../../../../hooks/useLazyState/useLazyState";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";

export function BlockSlotTracker(
  props: IBlockComponentProps<ISlotTrackerBlock>
) {
  const { t } = useTranslate();
  const [hover, setHover] = useState(false);
  const [blockValue, setBlockValue] = useLazyState({
    value: props.block.value,
    delay: Delays.field,
    onChange: (newValue) => {
      props.onValueChange(newValue);
    },
  });

  function handleAddBox() {
    setBlockValue((draft) => {
      const lastIndex = draft.length - 1;
      const lastLabel = draft[lastIndex]?.label;
      const parsedLabel = parseInt(lastLabel);
      const nextLabel = Number.isInteger(parsedLabel)
        ? (draft.length + 1).toString()
        : "";

      return [
        ...draft,
        {
          label: nextLabel,
          checked: false,
        },
      ];
    });
  }

  function handleRemoveBox() {
    setBlockValue((draft) => {
      return draft.filter((box, boxIndex, boxes) => {
        return boxIndex !== boxes.length - 1;
      });
    });
  }

  function handleToggleBox(boxIndexToToggle: number) {
    setBlockValue((draft) => {
      return draft.map((box, boxIndex) => {
        if (boxIndex === boxIndexToToggle) {
          return {
            ...box,
            checked: !box.checked,
          };
        }
        return box;
      });
    });
  }

  function handleSetBoxLabel(boxIndexToRename: number, label: string) {
    setBlockValue((draft) => {
      return draft.map((box, boxIndex) => {
        if (boxIndex === boxIndexToRename) {
          return {
            ...box,
            label: label,
          };
        }
        return box;
      });
    });
  }

  const isLabelVisible =
    !!previewContentEditable({ value: props.block.label }) || props.advanced;

  return (
    <>
      <Box
        onPointerEnter={() => {
          setHover(true);
        }}
        onPointerLeave={() => {
          setHover(false);
        }}
      >
        {(!props.readonly || isLabelVisible) && (
          <Box>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              wrap="nowrap"
              spacing={1}
            >
              {!props.readonly && (
                <Fade in={hover}>
                  <Grid item>
                    <Tooltip
                      title={
                        props.block.meta.asClock
                          ? t("character-dialog.control.remove-segment")
                          : t("character-dialog.control.remove-box")
                      }
                    >
                      <IconButton
                        size="small"
                        color="inherit"
                        data-cy={`${props.dataCy}.remove-box`}
                        onClick={() => {
                          handleRemoveBox();
                        }}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Fade>
              )}
              {isLabelVisible && (
                <Grid item className={css({ minWidth: "4rem" })}>
                  <FateLabel
                    display="inline"
                    align={props.readonly ? "inherit" : "center"}
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
              )}
              {!props.readonly && (
                <Fade in={hover}>
                  <Grid item>
                    <Tooltip
                      title={
                        props.block.meta.asClock
                          ? t("character-dialog.control.add-segment")
                          : t("character-dialog.control.add-box")
                      }
                    >
                      <IconButton
                        color="inherit"
                        data-cy={`${props.dataCy}.add-box`}
                        size="small"
                        onClick={() => {
                          handleAddBox();
                        }}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Fade>
              )}
            </Grid>
          </Box>
        )}

        {props.block.meta.asClock ? renderAsClock() : renderAsTrack()}
      </Box>
    </>
  );

  function renderAsClock() {
    const slices = blockValue.map((box) => {
      return !!box.checked;
    });

    return (
      <Grid container justifyContent="center">
        <Grid item>
          <Clock
            slices={slices}
            disabled={props.readonly}
            onClick={(slideIndex) => {
              handleToggleBox(slideIndex);
            }}
            className={css({
              width: "8rem",
            })}
          />
        </Grid>
      </Grid>
    );
  }

  function renderAsTrack() {
    return (
      <Grid container justifyContent="center" spacing={1}>
        {blockValue.map((box, boxIndex) => {
          const isBoxLabelVisible =
            !!previewContentEditable({ value: box.label }) || props.advanced;

          return (
            <Grid item key={boxIndex}>
              <Box
                className={css({
                  display: "flex",
                  justifyContent: "center",
                })}
              >
                <Checkbox
                  data-cy={`${props.dataCy}.box.${boxIndex}.value`}
                  icon={<CircleOutlinedIcon htmlColor="currentColor" />}
                  checkedIcon={<CircleIcon htmlColor="currentColor" />}
                  checked={box.checked}
                  disabled={props.readonly}
                  color="default"
                  className={css({
                    color: "inherit",
                    padding: "0",
                  })}
                  onChange={() => {
                    handleToggleBox(boxIndex);
                  }}
                />
              </Box>
              {isBoxLabelVisible && (
                <Box>
                  <FateLabel className={css({ textAlign: "center" })}>
                    <ContentEditable
                      data-cy={`${props.dataCy}.box.${boxIndex}.label`}
                      readonly={props.readonly}
                      border={!props.readonly}
                      value={box.label}
                      // because of useLazyState above
                      noDelay
                      onChange={(value) => {
                        handleSetBoxLabel(boxIndex, value);
                      }}
                    />
                  </FateLabel>
                </Box>
              )}
            </Grid>
          );
        })}
      </Grid>
    );
  }
}
BlockSlotTracker.displayName = "BlockSlotTracker";

export function BlockSlotTrackerActions(
  props: IBlockActionComponentProps<ISlotTrackerBlock>
) {
  const theme = useTheme();
  const { t } = useTranslate();
  return (
    <>
      <Grid item>
        <Link
          component="button"
          variant="caption"
          underline="hover"
          className={css({
            color: theme.palette.primary.main,
          })}
          onClick={() => {
            props.onMetaChange({
              ...props.block.meta,
              asClock: !props.block.meta.asClock,
            });
          }}
        >
          {props.block.meta.asClock
            ? t("character-dialog.control.as-track")
            : t("character-dialog.control.as-clock")}
        </Link>
      </Grid>
    </>
  );
}

function Clock(props: {
  className?: string;
  slices: Array<boolean>;
  disabled?: boolean;
  onClick: (sliceIndex: number) => void;
}) {
  const theme = useTheme();
  const uuid = useState(() => Id.generate())[0];
  const circleCx = 55;
  const circleCy = 55;
  const circleR = 50;
  const filledColor = true
    ? `url(#fari-slot-tracker-clock-pattern-${uuid})`
    : "theme.palette.text.primary";
  const checkedSliceStyle = css({
    fill: filledColor,
    cursor: props.disabled ? "inherit" : "pointer",
    transition: theme.transitions.create(["fill"], { duration: "0.2s" }),
  });
  const sliceStyle = css({
    cursor: props.disabled ? "inherit" : "pointer",
    transition: theme.transitions.create(["fill"], { duration: "0.2s" }),
  });

  if (props.slices.length <= 0) {
    return null;
  }

  return (
    <svg
      viewBox="0 0 110 110"
      id="pie"
      className={cx(
        css({
          color: "inherit",
          fill: "transparent",
        }),
        props.className
      )}
    >
      <defs>
        <pattern
          id={`fari-slot-tracker-clock-pattern-${uuid}`}
          x="0"
          y="0"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="5"
            y2="5"
            stroke={theme.palette.text.primary}
            strokeWidth="1"
          />
        </pattern>
      </defs>

      {props.slices.length === 1 && (
        <circle
          cx={circleCx}
          cy={circleCy}
          r={circleR}
          fill={props.slices[0] ? filledColor : "transparent"}
          stroke={theme.palette.text.primary}
          strokeWidth="4px"
          className={sliceStyle}
          onClick={() => {
            if (props.disabled) {
              return;
            }
            props.onClick(0);
          }}
        />
      )}
      {props.slices.length > 1 &&
        props.slices.map((value, i) => {
          const checked = props.slices[i];
          const fromAngle = (i * 360) / props.slices.length;
          const toAngle = ((i + 1) * 360) / props.slices.length;
          const numberToAlignTopRight = 270; // Because otherwise the clock starts on middle right

          const fromCoordX =
            circleCx +
            circleR *
              Math.cos(((fromAngle + numberToAlignTopRight) * Math.PI) / 180);
          const fromCoordY =
            circleCy +
            circleR *
              Math.sin(((fromAngle + numberToAlignTopRight) * Math.PI) / 180);
          const toCoordX =
            circleCx +
            circleR *
              Math.cos(((toAngle + numberToAlignTopRight) * Math.PI) / 180);
          const toCoordY =
            circleCy +
            circleR *
              Math.sin(((toAngle + numberToAlignTopRight) * Math.PI) / 180);

          const d = `M${circleCx},${circleCy} L${fromCoordX},${fromCoordY} A${circleR},${circleR} 0 0,1 ${toCoordX},${toCoordY}z`;

          return (
            <path
              d={d}
              key={i}
              className={checked ? checkedSliceStyle : sliceStyle}
              stroke={theme.palette.text.primary}
              strokeWidth="4px"
              onClick={() => {
                if (props.disabled) {
                  return;
                }
                props.onClick(i);
              }}
            />
          );
        })}
    </svg>
  );
}
