import {
  Box,
  Divider,
  Fade,
  Grid,
  IconButton,
  Popover,
  useTheme,
} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import ClearAllTwoToneIcon from "@material-ui/icons/ClearAllTwoTone";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import FaceTwoToneIcon from "@material-ui/icons/FaceTwoTone";
import FullscreenExitTwoToneIcon from "@material-ui/icons/FullscreenExitTwoTone";
import FullscreenTwoToneIcon from "@material-ui/icons/FullscreenTwoTone";
import GestureTwoToneIcon from "@material-ui/icons/GestureTwoTone";
import PaletteTwoToneIcon from "@material-ui/icons/PaletteTwoTone";
import PanToolTwoToneIcon from "@material-ui/icons/PanToolTwoTone";
import RadioButtonUncheckedTwoToneIcon from "@material-ui/icons/RadioButtonUncheckedTwoTone";
import UndoTwoToneIcon from "@material-ui/icons/UndoTwoTone";
import { css } from "emotion";
import React, { useRef, useState } from "react";
import { TwitterPicker } from "react-color";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { AspectRatio } from "./AspectRatio";
import { pickerColors } from "./domains/pickerColors";
import { DrawObject } from "./DrawObject";
import { DrawingTool, IDrawAreaObjects, useDrawing } from "./hooks/useDrawing";
interface IProps {
  objects?: IDrawAreaObjects;
  readonly?: boolean;
  fullScreen?: boolean;
  onFullScreenChange?: (fullScreen: boolean) => void;
  onChange?(lines: IDrawAreaObjects): void;
  controls: "bottom" | "top";
}

export const DrawObjects: React.FC<IProps> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const textColors = useTextColors(theme.palette.background.paper);
  const [
    drawingToolBeforeColorPicker,
    setDrawingToolBeforeColorPicker,
  ] = useState<DrawingTool | undefined>(undefined);
  const $paletteButton = useRef<HTMLButtonElement | null>(null);

  const drawingManager = useDrawing({
    objects: props.objects,
    readonly: props.readonly,
    onChange: props.onChange,
  });

  function resetDrawingTool() {
    if (drawingToolBeforeColorPicker) {
      drawingManager.actions.setDrawingTool(drawingToolBeforeColorPicker);
    }
    setDrawingToolBeforeColorPicker(undefined);
  }

  if (props.controls === "bottom") {
    return (
      <>
        <Box display="flex" flexDirection="column">
          <AspectRatio widthPercent={100} ratio={1 / 1}>
            {renderDrawArea()}
          </AspectRatio>

          {renderActions()}
          {renderOtherActions()}
        </Box>
      </>
    );
  }

  return (
    <>
      {renderActions()}
      {renderOtherActions()}
      <AspectRatio widthPercent={50} ratio={1 / 1}>
        {renderDrawArea()}
      </AspectRatio>
    </>
  );

  function renderDrawArea() {
    return (
      <div
        ref={drawingManager.state.$container}
        onPointerDown={drawingManager.handlers.onStartDrawing}
        onPointerMove={drawingManager.handlers.onDrawing}
        onPointerUp={drawingManager.handlers.onStopDrawing}
        onBlur={drawingManager.handlers.onBlur}
        className={css({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          cursor: props.readonly ? "inherit" : "crosshair",
          touchAction: drawingManager.state.isDrawing ? "none" : "auto",
          border: props.fullScreen ? "1px solid  grey" : "none",
        })}
      >
        <Fade in={drawingManager.state.objects.length === 0}>
          <Box
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            display={
              drawingManager.state.objects.length === 0 ? "flex" : "none"
            }
          >
            <GestureTwoToneIcon
              classes={{
                root: css({
                  width: "7rem",
                  height: "7rem",
                }),
              }}
              htmlColor={textColors.disabled}
            />
          </Box>
        </Fade>
        <Fade in={drawingManager.state.objects.length > 0}>
          <svg
            ref={drawingManager.state.$svgElement}
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className={css({
              display:
                drawingManager.state.objects.length > 0 ? "block" : "none",
            })}
          >
            {drawingManager.state.objects.map((object, index) => {
              return (
                <DrawObject
                  key={index}
                  object={object}
                  roughSVG={drawingManager.state.roughSVG}
                  drawingTool={drawingManager.state.drawingTool}
                  onMove={(startEvent, moveEvent) => {
                    drawingManager.handlers.onObjectMove(
                      index,
                      startEvent,
                      moveEvent
                    );
                  }}
                  onRemove={() => {
                    drawingManager.handlers.onObjectRemove(index);
                  }}
                />
              );
            })}
          </svg>
        </Fade>
      </div>
    );
  }

  function renderActions() {
    const colorPickerOpen =
      drawingManager.state.drawingTool === DrawingTool.ColorPicker;
    if (props.readonly) {
      return null;
    }
    return (
      <Box flex="0 1 auto" p=".5rem">
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <IconButton
                  size="small"
                  ref={$paletteButton}
                  className={css({
                    color: "#000000",
                  })}
                  onClick={(event) => {
                    setDrawingToolBeforeColorPicker(
                      drawingManager.state.drawingTool
                    );
                    drawingManager.actions.setDrawingTool(
                      DrawingTool.ColorPicker
                    );
                  }}
                >
                  <PaletteTwoToneIcon
                    className={css({
                      "&:nth-child(1)": {
                        color: drawingManager.state.color,
                      },
                    })}
                  />
                </IconButton>
                <Popover
                  open={colorPickerOpen}
                  anchorEl={$paletteButton.current}
                  onClose={() => {
                    resetDrawingTool();
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <ColorPicker
                    value={drawingManager.state.color}
                    onChange={(color) => {
                      drawingManager.actions.setColor(color);
                      resetDrawingTool();
                    }}
                  />
                </Popover>
              </Grid>
              <Grid item>
                <IconButton
                  size="small"
                  className={css({
                    color:
                      drawingManager.state.drawingTool === DrawingTool.Move
                        ? theme.palette.primary.main
                        : "#000000",
                  })}
                  onClick={() => {
                    drawingManager.actions.setDrawingTool(DrawingTool.Move);
                  }}
                >
                  <PanToolTwoToneIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  size="small"
                  className={css({
                    color:
                      drawingManager.state.drawingTool === DrawingTool.Remove
                        ? theme.palette.primary.main
                        : "#000000",
                  })}
                  onClick={() => {
                    drawingManager.actions.setDrawingTool(DrawingTool.Remove);
                  }}
                >
                  <DeleteTwoToneIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <IconButton
                  size="small"
                  className={css({
                    color:
                      drawingManager.state.drawingTool === DrawingTool.Line
                        ? theme.palette.primary.main
                        : "#000000",
                  })}
                  onClick={() => {
                    drawingManager.actions.setDrawingTool(DrawingTool.Line);
                  }}
                >
                  <GestureTwoToneIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  size="small"
                  className={css({
                    color:
                      drawingManager.state.drawingTool === DrawingTool.Rectangle
                        ? theme.palette.primary.main
                        : "#000000",
                  })}
                  onClick={() => {
                    drawingManager.actions.setDrawingTool(
                      DrawingTool.Rectangle
                    );
                  }}
                >
                  <CheckBoxOutlineBlankIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  size="small"
                  className={css({
                    color:
                      drawingManager.state.drawingTool === DrawingTool.Ellipse
                        ? theme.palette.primary.main
                        : "#000000",
                  })}
                  onClick={() => {
                    drawingManager.actions.setDrawingTool(DrawingTool.Ellipse);
                  }}
                >
                  <RadioButtonUncheckedTwoToneIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  size="small"
                  className={css({
                    color:
                      drawingManager.state.drawingTool === DrawingTool.Token
                        ? theme.palette.primary.main
                        : "#000000",
                  })}
                  onClick={() => {
                    drawingManager.actions.setDrawingTool(DrawingTool.Token);
                  }}
                >
                  <FaceTwoToneIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }

  function renderOtherActions() {
    return (
      <>
        <Divider />
        <Box p="0.5rem">
          <Grid container justify="flex-start" alignItems="center" spacing={1}>
            {!props.readonly && (
              <>
                <Grid item>
                  <IconButton
                    size="small"
                    className={css({
                      color: "#000000",
                    })}
                    onClick={() => {
                      drawingManager.actions.clear();
                    }}
                  >
                    <ClearAllTwoToneIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    size="small"
                    className={css({
                      color: "#000000",
                    })}
                    onClick={() => {
                      drawingManager.actions.undo();
                    }}
                  >
                    <UndoTwoToneIcon />
                  </IconButton>
                </Grid>
              </>
            )}
            {props.onFullScreenChange && (
              <Grid item>
                <IconButton
                  size="small"
                  className={css({
                    color: "#000000",
                  })}
                  onClick={() => {
                    props.onFullScreenChange?.(!props.fullScreen);
                  }}
                >
                  {!props.fullScreen ? (
                    <FullscreenTwoToneIcon />
                  ) : (
                    <FullscreenExitTwoToneIcon />
                  )}
                </IconButton>
              </Grid>
            )}
          </Grid>
        </Box>
      </>
    );
  }
};

DrawObjects.displayName = "DrawObjects";

export const ColorPicker: React.FC<{
  value: string;
  onChange: (color: string) => void;
}> = (props) => {
  return (
    <TwitterPicker
      width="10.5rem"
      triangle="hide"
      styles={{
        default: {
          hash: { clear: "both" },
        },
      }}
      color={props.value}
      colors={pickerColors}
      className={css({
        boxShadow: "none",
      })}
      onChange={(color) => props.onChange(color.hex)}
    />
  );
};

ColorPicker.displayName = "ColorPicker";
