import {
  Box,
  Fade,
  Grid,
  IconButton,
  Popover,
  useTheme,
} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import DeleteIcon from "@material-ui/icons/Delete";
import GestureIcon from "@material-ui/icons/Gesture";
import PaletteIcon from "@material-ui/icons/Palette";
import PanToolIcon from "@material-ui/icons/PanTool";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import { css } from "emotion";
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { TwitterPicker } from "react-color";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { IRoughSVG, rough } from "./rough";
enum DrawingTool {
  Line,
  Move,
  Remove,
  Rectangle,
  Ellipse,
}
enum ObjectType {
  Line,
  Rectangle,
  Ellipse,
}

export type ILines = Array<IObject>;

type IObject =
  | {
      type: ObjectType.Line;
      color: string;
      points: Array<IPoint>;
    }
  | {
      type: ObjectType.Rectangle;
      color: string;
      form: IForm;
    }
  | {
      type: ObjectType.Ellipse;
      color: string;
      form: IForm;
    };

type IPoint = {
  percentX: number;
  percentY: number;
};

type IForm = {
  start: IPoint;
  end: IPoint;
};

interface IProps {
  lines?: ILines;
  readonly?: boolean;
  onChange?(lines: ILines): void;
}

interface IHandles {
  clear(): void;
  undo(): void;
}

export type IDrawAreaHandles = IHandles;
const pickerColors = [
  "#000000",
  "#FF6900",
  "#FCB900",
  "#7BDCB5",
  "#00D084",
  "#8ED1FC",
  "#0693E3",
  "#ABB8C3",
  "#EB144C",
  "#F78DA7",
  "#9900EF",
];
export const DrawArea = React.forwardRef<IHandles, IProps>((props, ref) => {
  const theme = useTheme();
  const textColors = useTextColors(theme.palette.background.paper);

  const [lines, setLines] = useState<ILines>([]);
  const [isDrawing, setDrawing] = useState(false);
  const [drawingTool, setDrawingTool] = useState(DrawingTool.Line);

  const [colorPickerButton, setColorPickerButton] = useState<
    HTMLButtonElement | undefined
  >(undefined);

  const [color, setColor] = useState("#000000");
  const $container = useRef<HTMLDivElement | null>(null);
  const $svgElement = useRef<SVGSVGElement | null>(null);

  const roughSVG = useMemo(() => {
    if ($svgElement.current) {
      return rough.svg($svgElement.current);
    }
  }, [$svgElement.current]);

  useEffect(() => {
    if (props.lines && props.readonly) {
      setLines(props.lines);
    }
  }, [props.lines, props.readonly]);

  useImperativeHandle(ref, () => {
    return {
      clear() {
        setLines([]);
        props.onChange?.([]);
      },
      undo() {
        setLines((draft) => {
          const lastElementIndex = draft.length - 1;
          const newLines = draft.filter((line, index) => {
            return index !== lastElementIndex;
          });
          props.onChange?.(newLines);
          return newLines;
        });
      },
    };
  });

  useEffect(() => {
    if (!isDrawing) {
      props.onChange?.(lines);
    }
  }, [isDrawing]);

  function onPointerDown(pointerEvent: React.PointerEvent<HTMLDivElement>) {
    if (pointerEvent.button !== 0 || props.readonly) {
      return;
    }

    pointerEvent.preventDefault();
    pointerEvent.stopPropagation();

    const newPoint = relativeCoordinatesForEvent(pointerEvent);
    if (newPoint) {
      if (drawingTool === DrawingTool.Rectangle) {
        setLines((lines) => {
          return [
            ...lines,
            {
              type: ObjectType.Rectangle,
              color: color,
              form: {
                start: newPoint,
                end: newPoint,
              },
            },
          ];
        });
        setDrawing(true);
      } else if (drawingTool === DrawingTool.Ellipse) {
        setLines((lines) => {
          return [
            ...lines,
            {
              type: ObjectType.Ellipse,
              color: color,
              form: {
                start: newPoint,
                end: newPoint,
              },
            },
          ];
        });
        setDrawing(true);
      } else if (drawingTool === DrawingTool.Line) {
        setLines((lines) => {
          return [
            ...lines,
            {
              type: ObjectType.Line,
              color: color,
              points: [newPoint],
            },
          ];
        });
        setDrawing(true);
      }
    }
  }

  function onPointerMove(pointerEvent: React.PointerEvent<HTMLDivElement>) {
    if (!isDrawing) {
      return;
    }

    const newPoint = relativeCoordinatesForEvent(pointerEvent);
    if (newPoint) {
      setLines((lines) => {
        const lastLineIndex = lines.length - 1;
        return lines.map((line, index) => {
          const shouldUpdate = index === lastLineIndex;
          if (!shouldUpdate) {
            return line;
          }

          if (line.type === ObjectType.Rectangle) {
            return {
              ...line,
              form: {
                start: line.form.start,
                end: newPoint,
              },
            };
          }

          if (line.type === ObjectType.Ellipse) {
            return {
              ...line,
              form: {
                start: line.form.start,
                end: newPoint,
              },
            };
          }

          return {
            ...line,
            points: [...line.points, newPoint],
          };
        });
      });
    }
  }

  function onPointerUp(pointerEvent: React.PointerEvent<HTMLDivElement>) {
    if (pointerEvent.pointerType == "mouse") {
      setDrawing(false);
    }
  }

  function onObjectMove(
    objectIndex: number,
    startEvent: PointerEvent,
    moveEvent: PointerEvent
  ) {
    const startPoint = relativeCoordinatesForEvent(startEvent);
    const movePoint = relativeCoordinatesForEvent(moveEvent);
    const diffX = movePoint.percentX - startPoint.percentX;
    const diffY = movePoint.percentY - startPoint.percentY;

    setLines((lines) => {
      return lines.map((line, index) => {
        const shouldUpdate = index === objectIndex;
        if (!shouldUpdate) {
          return line;
        }
        if (line.type === ObjectType.Rectangle) {
          return {
            ...line,
            form: {
              start: {
                percentX: line.form.start.percentX + diffX,
                percentY: line.form.start.percentY + diffY,
              },
              end: {
                percentX: line.form.end.percentX + diffX,
                percentY: line.form.end.percentY + diffY,
              },
            },
          };
        }
        if (line.type === ObjectType.Ellipse) {
          return {
            ...line,
            form: {
              start: {
                percentX: line.form.start.percentX + diffX,
                percentY: line.form.start.percentY + diffY,
              },
              end: {
                percentX: line.form.end.percentX + diffX,
                percentY: line.form.end.percentY + diffY,
              },
            },
          };
        }
        return {
          ...line,
          points: line.points.map((p) => {
            return {
              percentX: p.percentX + diffX,
              percentY: p.percentY + diffY,
            };
          }),
        };
      });
    });
  }

  function onObjectRemove(objectIndex: number) {
    setLines((lines) => {
      return lines.filter((object, index) => {
        return index !== objectIndex;
      });
    });
  }

  function onBlur(blurEvent: React.FocusEvent<HTMLDivElement>) {
    if (isDrawing) {
      setDrawing(false);
    }
  }

  function relativeCoordinatesForEvent(
    pointerEvent: React.PointerEvent<unknown> | PointerEvent
  ): IPoint {
    if ($container.current) {
      const boundingRect = $container.current.getBoundingClientRect();
      const x = pointerEvent.clientX - boundingRect.left;
      const y = pointerEvent.clientY - boundingRect.top;
      const point = {
        percentX: (x / boundingRect.width) * 100,
        percentY: (y / boundingRect.height) * 100,
      } as IPoint;
      return point;
    }
    return {
      percentX: 0,
      percentY: 0,
    };
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100%">
      {renderDrawArea()}
      {renderActions()}
    </Box>
  );

  function renderDrawArea() {
    return (
      <Box width="100%" height="400px">
        <div
          className={css({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            cursor: props.readonly ? "inherit" : "crosshair",
            touchAction: isDrawing ? "none" : "auto",
          })}
          ref={$container}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onBlur={onBlur}
        >
          <Fade in={lines.length === 0}>
            <GestureIcon
              classes={{
                root: css({
                  width: "7rem",
                  height: "7rem",
                  display: lines.length === 0 ? "block" : "none",
                }),
              }}
              htmlColor={textColors.disabled}
            />
          </Fade>
          <Fade in={lines.length > 0}>
            <svg
              ref={$svgElement}
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className={css({
                display: lines.length > 0 ? "block" : "none",
              })}
            >
              {lines.map((object, index) => {
                return (
                  <DrawObject
                    key={index}
                    object={object}
                    roughSVG={roughSVG}
                    drawingTool={drawingTool}
                    onMove={(startEvent, moveEvent) => {
                      onObjectMove(index, startEvent, moveEvent);
                    }}
                    onRemove={() => {
                      onObjectRemove(index);
                    }}
                  />
                );
              })}
            </svg>
          </Fade>
        </div>
      </Box>
    );
  }

  function renderActions() {
    const colorPickerOpen = !!colorPickerButton;

    return (
      <Box flex="0 1 auto" p=".5rem">
        <Grid container justify="space-between">
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <IconButton
                  color={colorPickerOpen ? "primary" : "default"}
                  onClick={(event) => {
                    setColorPickerButton(event.currentTarget);
                  }}
                >
                  <PaletteIcon />
                </IconButton>
                <Popover
                  open={colorPickerOpen}
                  anchorEl={colorPickerButton}
                  onClose={() => {
                    setColorPickerButton(undefined);
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
                  <TwitterPicker
                    width="19.5rem"
                    triangle="hide"
                    color={color}
                    colors={pickerColors}
                    className={css({
                      boxShadow: "none",
                    })}
                    onChange={(color) => {
                      setColor(color.hex);
                      setColorPickerButton(undefined);
                    }}
                  />
                </Popover>
              </Grid>
              <Grid item>
                <IconButton
                  color={
                    drawingTool === DrawingTool.Move ? "primary" : "default"
                  }
                  onClick={() => {
                    setDrawingTool(DrawingTool.Move);
                  }}
                >
                  <PanToolIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  color={
                    drawingTool === DrawingTool.Remove ? "primary" : "default"
                  }
                  onClick={() => {
                    setDrawingTool(DrawingTool.Remove);
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
                    drawingTool === DrawingTool.Line ? "primary" : "default"
                  }
                  onClick={() => {
                    setDrawingTool(DrawingTool.Line);
                  }}
                >
                  <GestureIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  color={
                    drawingTool === DrawingTool.Rectangle
                      ? "primary"
                      : "default"
                  }
                  onClick={() => {
                    setDrawingTool(DrawingTool.Rectangle);
                  }}
                >
                  <CheckBoxOutlineBlankIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  color={
                    drawingTool === DrawingTool.Ellipse ? "primary" : "default"
                  }
                  onClick={() => {
                    setDrawingTool(DrawingTool.Ellipse);
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
});

DrawArea.displayName = "DrawArea";

export const DrawObject: React.FC<{
  roughSVG: IRoughSVG | undefined;
  object: IObject;
  drawingTool: DrawingTool;
  onMove: (startEvent: PointerEvent, event: PointerEvent) => void;
  onRemove: () => void;
}> = React.memo((props) => {
  type IStartEvent = PointerEvent | undefined;

  const theme = useTheme();

  const [seed] = useState(() => Math.random() * 100);
  const startEvent = useRef<IStartEvent>(undefined);
  const isMoving = !!startEvent;
  const movableCursor = isMoving ? "grabbing" : "grab";
  const cursor =
    props.drawingTool === DrawingTool.Move
      ? movableCursor
      : props.drawingTool === DrawingTool.Remove
      ? "pointer"
      : "inherit";
  const strokeWidth = 0.8;
  const roughness = 0.3;
  const fillStyle = "solid";
  const isBlack = props.object.color === "#000000";
  const fill = isBlack ? theme.palette.background.default : props.object.color;

  function onPointerMove(event: PointerEvent) {
    if (startEvent.current) {
      props.onMove(startEvent.current, event);
      startEvent.current = event;
    }
  }

  function onPointerUp() {
    startEvent.current = undefined;
  }

  useEffect(() => {
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  const eventProps = {
    cursor: cursor,
    onPointerDown: (event: React.PointerEvent<SVGGElement>) => {
      if (props.drawingTool === DrawingTool.Move) {
        event.persist();
        startEvent.current = event.nativeEvent;
      } else if (props.drawingTool === DrawingTool.Remove) {
        props.onRemove();
      }
    },
    onBlur: () => {
      startEvent.current = undefined;
    },
  };

  if (!props.roughSVG) {
    return null;
  }

  switch (props.object.type) {
    case ObjectType.Rectangle: {
      const formData = props.roughSVG!.rectangle(
        props.object.form.start.percentX,
        props.object.form.start.percentY,
        props.object.form.end.percentX - props.object.form.start.percentX,
        props.object.form.end.percentY - props.object.form.start.percentY,
        {
          strokeWidth: strokeWidth,
          roughness: roughness,
          seed: seed,
          fill: fill,
          fillStyle: fillStyle,
        }
      );
      return (
        <g
          {...eventProps}
          dangerouslySetInnerHTML={{ __html: formData.innerHTML }}
        />
      );
    }
    case ObjectType.Ellipse: {
      const formData = props.roughSVG.ellipse(
        (props.object.form.start.percentX + props.object.form.end.percentX) / 2,
        (props.object.form.start.percentY + props.object.form.end.percentY) / 2,
        props.object.form.end.percentX - props.object.form.start.percentX,
        props.object.form.end.percentY - props.object.form.start.percentY,
        {
          strokeWidth: strokeWidth,
          roughness: roughness,
          seed: seed,
          fill: fill,
          fillStyle: fillStyle,
        }
      );
      return (
        <g
          {...eventProps}
          dangerouslySetInnerHTML={{ __html: formData.innerHTML }}
        />
      );
    }
    case ObjectType.Line: {
      const line = props.roughSVG.linearPath(
        props.object.points.map((p) => [p.percentX, p.percentY]),
        {
          strokeWidth: strokeWidth,
          roughness: roughness,
          seed: seed,
          stroke: props.object.color,
        }
      );

      return (
        <g
          {...eventProps}
          dangerouslySetInnerHTML={{ __html: line.innerHTML }}
        />
      );
    }
  }
});

DrawObject.displayName = "DrawObject";
