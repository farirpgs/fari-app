import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import { useTheme } from "@material-ui/core/styles";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import ClearAllTwoToneIcon from "@material-ui/icons/ClearAllTwoTone";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import FaceTwoToneIcon from "@material-ui/icons/FaceTwoTone";
import GestureTwoToneIcon from "@material-ui/icons/GestureTwoTone";
import PaletteTwoToneIcon from "@material-ui/icons/PaletteTwoTone";
import PanToolTwoToneIcon from "@material-ui/icons/PanToolTwoTone";
import RadioButtonUncheckedTwoToneIcon from "@material-ui/icons/RadioButtonUncheckedTwoTone";
import UndoTwoToneIcon from "@material-ui/icons/UndoTwoTone";
import getStroke from "perfect-freehand";
import React, { useEffect, useRef, useState } from "react";
import { Ellipse, Group, Layer, Line, Rect, Stage } from "react-konva";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { ColorPicker } from "../ColorPicker/ColorPicker";
import { AspectRatio } from "./AspectRatio";
import {
  DrawingTool,
  IEllipseObject,
  ILineObject,
  IRectangleObject,
  ObjectType,
  useDrawing,
} from "./hooks/useDrawing";

interface IProps {
  readonly?: boolean;
  controls: "bottom" | "top";
  tokenTitles?: Array<string>;
}

export const DrawObjects: React.FC<IProps> = (props) => {
  const theme = useTheme();
  const logger = useLogger();
  const textColors = useTextColors(theme.palette.background.paper);
  const [
    drawingToolBeforeColorPicker,
    setDrawingToolBeforeColorPicker,
  ] = useState<DrawingTool | undefined>(undefined);
  const $paletteButton = useRef<HTMLButtonElement | null>(null);
  const $container = useRef<HTMLDivElement | null>(null);

  const drawingManager = useDrawing({});

  let tokenIndex = 0;

  useEffect(() => {
    function checkSize() {
      const containerWidth = $container.current?.offsetWidth ?? 0;
      const containerHeight = window.innerHeight ?? 0;

      drawingManager.actions.setWidth(containerWidth);
      drawingManager.actions.setHeight(containerHeight);
    }
    checkSize();
    window.addEventListener("resize", checkSize);

    return () => {
      window.addEventListener("resize", checkSize);
    };
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
          {renderDrawArea()}

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
      <div ref={$container}>
        <Stage
          width={drawingManager.state.width}
          height={drawingManager.state.height}
          onMouseDown={drawingManager.handlers.onStartDrawing}
          onMousemove={drawingManager.handlers.onDrawing}
          onMouseup={drawingManager.handlers.onStopDrawing}
          onWheel={drawingManager.handlers.onWheel}
        >
          <Layer>
            {/* <Text text="Just start drawing" x={5} y={30} /> */}
            {drawingManager.state.objects.map((object, index) => {
              const hasTokenTitle = object.type === ObjectType.Token;
              const titleIndex = hasTokenTitle ? tokenIndex++ : undefined;
              const title =
                titleIndex !== undefined
                  ? props.tokenTitles?.[titleIndex]
                  : undefined;

              const color =
                object.color === "#000000"
                  ? theme.palette.text.primary
                  : object.color;

              const Comps: Record<ObjectType, () => JSX.Element> = {
                [ObjectType.Line]: () => {
                  const line = object as ILineObject;
                  const pointsForPerfectFreeHand = line.points.flatMap((p) => ({
                    x: p.x,
                    y: p.y,
                    pressure: 0,
                  })) as any;

                  const perfectLines = getStroke(pointsForPerfectFreeHand, {
                    simulatePressure: true,
                  });
                  return (
                    <Line
                      points={
                        perfectLines.flatMap((p) => {
                          const x = p[0];
                          const y = p[1];
                          return [x, y];
                        }) as any
                      }
                      stroke={color}
                      strokeWidth={5}
                      tension={0.5}
                      lineCap="round"
                      globalCompositeOperation={
                        "source-over"
                        // line.tool === "eraser" ? "destination-out" : "source-over"
                      }
                    />
                  );
                },
                [ObjectType.Rectangle]: () => {
                  const rect = object as IRectangleObject;

                  return (
                    <>
                      <Rect
                        x={rect.form.end.x}
                        y={rect.form.end.y}
                        width={rect.form.start.x - rect.form.end.x}
                        height={rect.form.start.y - rect.form.end.y}
                        stroke={color}
                        strokeWidth={5}
                        tension={0.5}
                      />
                    </>
                  );
                },
                [ObjectType.Ellipse]: () => {
                  const circ = object as IEllipseObject;
                  const radiusX = (circ.form.start.x - circ.form.end.x) / 2;
                  const radiusY = (circ.form.start.y - circ.form.end.y) / 2;
                  return (
                    <>
                      <Ellipse
                        x={(circ.form.start.x + circ.form.end.x) / 2}
                        y={(circ.form.start.y + circ.form.end.y) / 2}
                        radiusX={radiusX > 0 ? radiusX : radiusX * -1}
                        radiusY={radiusY > 0 ? radiusY : radiusY * -1}
                        stroke={color}
                        strokeWidth={5}
                        tension={0.5}
                      />
                    </>
                  );
                },
                [ObjectType.Token]: () => <></>,
              };

              return (
                <React.Fragment key={index}>
                  <Group
                    draggable
                    onDragStart={(e) => {
                      drawingManager.handlers.onDragStart(index, e);
                    }}
                    onDragEnd={(e) => {
                      drawingManager.handlers.onDragEnd(index, e);
                    }}
                  >
                    {Comps[object.type]()}
                  </Group>
                </React.Fragment>
              );
            })}
          </Layer>
        </Stage>
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
                  data-cy="draw.palette"
                  ref={$paletteButton}
                  className={css({
                    color: theme.palette.text.primary,
                  })}
                  onClick={(event) => {
                    setDrawingToolBeforeColorPicker(
                      drawingManager.state.drawingTool
                    );
                    drawingManager.actions.setDrawingTool(
                      DrawingTool.ColorPicker
                    );
                    logger.info("DrawArea:onSetDrawingTool:ColorPicker");
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
                      logger.info("DrawArea:onSetColor");
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
                    logger.info("DrawArea:onSetDrawingTool:Move");
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
                    logger.info("DrawArea:onSetDrawingTool:Remove");
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
                    logger.info("DrawArea:onSetDrawingTool:Line");
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
                    logger.info("DrawArea:onSetDrawingTool:Rectangle");
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
                    logger.info("DrawArea:onSetDrawingTool:Ellipse");
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
                    logger.info("DrawArea:onSetDrawingTool:Token");
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
          <Grid container justify="flex-start" alignItems="center" spacing={1}>
            <Grid item>
              <IconButton
                data-cy="draw.clear"
                size="small"
                className={css({
                  color: theme.palette.text.primary,
                })}
                onClick={() => {
                  drawingManager.actions.clear();
                  logger.info("DrawArea:onClear");
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
                  logger.info("DrawArea:onUndo");
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
