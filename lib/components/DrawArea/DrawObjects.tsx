import { css } from "@emotion/css";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import ClearAllTwoToneIcon from "@mui/icons-material/ClearAllTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import FaceTwoToneIcon from "@mui/icons-material/FaceTwoTone";
import GestureTwoToneIcon from "@mui/icons-material/GestureTwoTone";
import PaletteTwoToneIcon from "@mui/icons-material/PaletteTwoTone";
import PanToolTwoToneIcon from "@mui/icons-material/PanToolTwoTone";
import RadioButtonUncheckedTwoToneIcon from "@mui/icons-material/RadioButtonUncheckedTwoTone";
import UndoTwoToneIcon from "@mui/icons-material/UndoTwoTone";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { ColorPicker } from "../ColorPicker/ColorPicker";
import { AspectRatio } from "./AspectRatio";
import { DrawObject } from "./DrawObject";
import { DrawingTool, IDrawingManager, ObjectType } from "./hooks/useDrawing";

interface IProps {
  drawingManager: IDrawingManager;
  readonly?: boolean;
  controls: "bottom" | "top";
  tokenTitles?: Array<string>;
}

export const DrawObjects: React.FC<IProps> = (props) => {
  const theme = useTheme();
  const logger = useLogger();
  const textColors = useTextColors(theme.palette.background.paper);
  const [drawingToolBeforeColorPicker, setDrawingToolBeforeColorPicker] =
    useState<DrawingTool | undefined>(undefined);
  const $paletteButton = useRef<HTMLButtonElement | null>(null);
  const $svg = useRef<SVGSVGElement | null>(null);
  const $container = useRef<HTMLDivElement | null>(null);

  let tokenIndex = 0;
  const { drawingManager } = props;

  useEffect(() => {
    drawingManager.actions.setSVG($container.current, $svg.current);
  }, []);

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
          <AspectRatio width={100} ratio={1 / 1}>
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
      <AspectRatio width={100} ratio={1 / 1}>
        {renderDrawArea()}
      </AspectRatio>
    </>
  );

  function renderDrawArea() {
    return (
      <div
        ref={$container}
        data-cy="draw.container"
        onPointerDown={drawingManager.handlers.onStartDrawing}
        onPointerMove={drawingManager.handlers.onDrawing}
        onPointerUp={drawingManager.handlers.onStopDrawing}
        onBlur={drawingManager.handlers.onBlur}
        className={css({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          touchAction: "none",
          height: "100%",
          cursor: props.readonly ? "inherit" : "crosshair",
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
            ref={$svg}
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
              const hasTokenTitle = object.type === ObjectType.Token;
              const titleIndex = hasTokenTitle ? tokenIndex++ : undefined;
              const title =
                titleIndex !== undefined
                  ? props.tokenTitles?.[titleIndex]
                  : undefined;

              return (
                <DrawObject
                  key={index}
                  object={object}
                  roughSVG={drawingManager.state.roughSVG}
                  drawingTool={drawingManager.state.drawingTool}
                  title={title}
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
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <IconButton
                  size="small"
                  data-cy="draw.palette"
                  ref={$paletteButton}
                  className={css({
                    color: theme.palette.text.primary,
                  })}
                  onClick={() => {
                    setDrawingToolBeforeColorPicker(
                      drawingManager.state.drawingTool
                    );
                    drawingManager.actions.setDrawingTool(
                      DrawingTool.ColorPicker
                    );

                    logger.track("drawing_area.open_color_picker");
                  }}
                >
                  <PaletteTwoToneIcon
                    className={css({
                      "&:nth-child(1)": {
                        color:
                          drawingManager.state.color === "#000000"
                            ? theme.palette.text.primary
                            : drawingManager.state.color,
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
                      logger.track("drawing_area.pick_color");
                    }}
                  />
                </Popover>
              </Grid>
              <Grid item>
                <IconButton
                  data-cy="draw.move"
                  size="small"
                  className={css({
                    color:
                      drawingManager.state.drawingTool === DrawingTool.Move
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                  })}
                  onClick={() => {
                    drawingManager.actions.setDrawingTool(DrawingTool.Move);
                    logger.track("drawing_area.use_moving_tool");
                  }}
                >
                  <PanToolTwoToneIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  data-cy="draw.remove"
                  size="small"
                  className={css({
                    color:
                      drawingManager.state.drawingTool === DrawingTool.Remove
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                  })}
                  onClick={() => {
                    drawingManager.actions.setDrawingTool(DrawingTool.Remove);
                    logger.track("drawing_area.use_eraser");
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
                  data-cy="draw.line"
                  size="small"
                  className={css({
                    color:
                      drawingManager.state.drawingTool === DrawingTool.Line
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                  })}
                  onClick={() => {
                    drawingManager.actions.setDrawingTool(DrawingTool.Line);
                    logger.track("drawing_area.use_line_tool");
                  }}
                >
                  <GestureTwoToneIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  size="small"
                  data-cy="draw.rectangle"
                  className={css({
                    color:
                      drawingManager.state.drawingTool === DrawingTool.Rectangle
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                  })}
                  onClick={() => {
                    drawingManager.actions.setDrawingTool(
                      DrawingTool.Rectangle
                    );
                    logger.track("drawing_area.use_rectangle_tool");
                  }}
                >
                  <CheckBoxOutlineBlankIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  size="small"
                  data-cy="draw.ellipse"
                  className={css({
                    color:
                      drawingManager.state.drawingTool === DrawingTool.Ellipse
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                  })}
                  onClick={() => {
                    drawingManager.actions.setDrawingTool(DrawingTool.Ellipse);

                    logger.track("drawing_area.use_ellipse_tool");
                  }}
                >
                  <RadioButtonUncheckedTwoToneIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  data-cy="draw.token"
                  size="small"
                  className={css({
                    color:
                      drawingManager.state.drawingTool === DrawingTool.Token
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                  })}
                  onClick={() => {
                    drawingManager.actions.setDrawingTool(DrawingTool.Token);
                    logger.track("drawing_area.use_token_tool");
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
    if (props.readonly) {
      return null;
    }
    return (
      <>
        <Divider />
        <Box p="0.5rem">
          <Grid
            container
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <IconButton
                data-cy="draw.clear"
                size="small"
                className={css({
                  color: theme.palette.text.primary,
                })}
                onClick={() => {
                  drawingManager.actions.clear();

                  logger.track("drawing_area.clear_drawing");
                }}
              >
                <ClearAllTwoToneIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                data-cy="draw.undo"
                size="small"
                className={css({
                  color: theme.palette.text.primary,
                })}
                onClick={() => {
                  drawingManager.actions.undo();

                  logger.track("drawing_area.undo");
                }}
              >
                <UndoTwoToneIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
        <Divider />
      </>
    );
  }
};

DrawObjects.displayName = "DrawObjects";
