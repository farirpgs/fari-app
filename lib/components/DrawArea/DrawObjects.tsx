import {
  Box,
  Button,
  Divider,
  Fade,
  Grid,
  IconButton,
  Popover,
  useTheme,
} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import DeleteIcon from "@material-ui/icons/Delete";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import GestureIcon from "@material-ui/icons/Gesture";
import PaletteIcon from "@material-ui/icons/Palette";
import PanToolIcon from "@material-ui/icons/PanTool";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import UndoIcon from "@material-ui/icons/Undo";
import { css } from "emotion";
import React from "react";
import { TwitterPicker } from "react-color";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { AspectRatio } from "./AspectRatio";
import { pickerColors } from "./domains/pickerColors";
import { DrawObject } from "./DrawObject";
import { DrawingTool, IDrawAreaObjects, useDrawing } from "./hooks/useDrawing";

interface IProps {
  objects: IDrawAreaObjects;
  readonly: boolean;
  fullScreen: boolean;
  onFullScreenChange: (fullScreen: boolean) => void;
  onChange(lines: IDrawAreaObjects): void;
  controls: "bottom" | "top";
}

export const DrawObjects: React.FC<IProps> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const textColors = useTextColors(theme.palette.background.paper);
  const drawingManager = useDrawing({
    objects: props.objects,
    readonly: props.readonly,
    onChange: props.onChange,
  });

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
        onPointerDown={drawingManager.handlers.onPointerDown}
        onPointerMove={drawingManager.handlers.onPointerMove}
        onPointerUp={drawingManager.handlers.onPointerUp}
        onBlur={drawingManager.handlers.onBlur}
        className={css({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          cursor: props.readonly ? "inherit" : "crosshair",
          touchAction: drawingManager.state.isDrawing ? "none" : "auto",
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
            <GestureIcon
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
              border: props.fullScreen ? "1px solid  grey" : "none",
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
    const colorPickerOpen = !!drawingManager.state.colorPickerButton;
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
                  color={colorPickerOpen ? "primary" : "default"}
                  onClick={(event) => {
                    drawingManager.actions.setColorPickerButton(
                      event.currentTarget
                    );
                  }}
                >
                  <PaletteIcon />
                </IconButton>
                <Popover
                  open={colorPickerOpen}
                  anchorEl={drawingManager.state.colorPickerButton}
                  onClose={() => {
                    drawingManager.actions.setColorPickerButton(undefined);
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
                      drawingManager.actions.setColorPickerButton(undefined);
                    }}
                  />
                </Popover>
              </Grid>
              <Grid item>
                <IconButton
                  color={
                    drawingManager.state.drawingTool === DrawingTool.Move
                      ? "primary"
                      : "default"
                  }
                  onClick={() => {
                    drawingManager.actions.setDrawingTool(DrawingTool.Move);
                  }}
                >
                  <PanToolIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  color={
                    drawingManager.state.drawingTool === DrawingTool.Remove
                      ? "primary"
                      : "default"
                  }
                  onClick={() => {
                    drawingManager.actions.setDrawingTool(DrawingTool.Remove);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <IconButton
                  color={
                    drawingManager.state.drawingTool === DrawingTool.Line
                      ? "primary"
                      : "default"
                  }
                  onClick={() => {
                    drawingManager.actions.setDrawingTool(DrawingTool.Line);
                  }}
                >
                  <GestureIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  color={
                    drawingManager.state.drawingTool === DrawingTool.Rectangle
                      ? "primary"
                      : "default"
                  }
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
                  color={
                    drawingManager.state.drawingTool === DrawingTool.Ellipse
                      ? "primary"
                      : "default"
                  }
                  onClick={() => {
                    drawingManager.actions.setDrawingTool(DrawingTool.Ellipse);
                  }}
                >
                  <RadioButtonUncheckedIcon />
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

        <Box p="1rem">
          <Grid container justify="space-between">
            {!props.readonly && (
              <>
                <Grid item>
                  <Button
                    onClick={() => {
                      drawingManager.actions.clear();
                    }}
                    endIcon={<GestureIcon />}
                  >
                    {t("play-route.clear-drawing")}
                  </Button>
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={() => {
                      drawingManager.actions.undo();
                    }}
                  >
                    <UndoIcon />
                  </IconButton>
                </Grid>
              </>
            )}
            <Grid item>
              <IconButton
                onClick={() => {
                  props.onFullScreenChange(!props.fullScreen);
                }}
              >
                {!props.fullScreen ? (
                  <FullscreenIcon />
                ) : (
                  <FullscreenExitIcon />
                )}
              </IconButton>
            </Grid>
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
