import { Box, Fade, Grid, IconButton, useTheme } from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import GestureIcon from "@material-ui/icons/Gesture";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import { css } from "emotion";
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { IRoughSVG, rough } from "./rough";

enum ObjectType {
  Line,
  Rectangle,
  Ellipse,
}

export type ILines = Array<IObject>;

type IObject =
  | {
      type: ObjectType.Line;
      points: Array<IPoint>;
    }
  | {
      type: ObjectType.Rectangle;
      form: IForm;
    }
  | {
      type: ObjectType.Ellipse;
      form: IForm;
    };

type IPoint = {
  x: number;
  y: number;
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

export const DrawArea = React.forwardRef<IHandles, IProps>((props, ref) => {
  const theme = useTheme();
  const textColors = useTextColors(theme.palette.background.paper);

  const [lines, setLines] = useState<ILines>([]);
  const [isDrawing, setDrawing] = useState(false);
  const [drawingTool, setDrawingTool] = useState(ObjectType.Line);
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

  function handlePointerDown(pointerEvent: React.PointerEvent<HTMLDivElement>) {
    if (pointerEvent.button !== 0 || props.readonly) {
      return;
    }

    pointerEvent.preventDefault();
    pointerEvent.stopPropagation();

    const newPoint = relativeCoordinatesForEvent(pointerEvent);
    if (newPoint) {
      if (drawingTool === ObjectType.Rectangle) {
        setLines((lines) => {
          return [
            ...lines,
            {
              type: ObjectType.Rectangle,
              form: {
                start: newPoint,
                end: newPoint,
              },
            },
          ];
        });
      } else if (drawingTool === ObjectType.Ellipse) {
        setLines((lines) => {
          return [
            ...lines,
            {
              type: ObjectType.Ellipse,
              form: {
                start: newPoint,
                end: newPoint,
              },
            },
          ];
        });
      } else {
        setLines((lines) => {
          return [
            ...lines,
            {
              type: ObjectType.Line,
              points: [newPoint],
            },
          ];
        });
      }

      setDrawing(true);
    }
  }

  function handlePointerMove(pointerEvent: React.PointerEvent<HTMLDivElement>) {
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
              type: ObjectType.Rectangle,
              form: {
                start: line.form.start,
                end: newPoint,
              },
            };
          }

          if (line.type === ObjectType.Ellipse) {
            return {
              type: ObjectType.Ellipse,
              form: {
                start: line.form.start,
                end: newPoint,
              },
            };
          }

          return {
            type: ObjectType.Line,
            points: [...line.points, newPoint],
          };
        });
      });
    }
  }

  function handlePointerUp(pointerEvent: React.PointerEvent<HTMLDivElement>) {
    if (pointerEvent.pointerType == "mouse") {
      setDrawing(false);
    }
  }

  function handleBlur(blurEvent: React.FocusEvent<HTMLDivElement>) {
    if (isDrawing) setDrawing(false);
  }

  function relativeCoordinatesForEvent(
    pointerEvent: React.PointerEvent<HTMLDivElement>
  ): IPoint | undefined {
    if ($container.current) {
      const boundingRect = $container.current.getBoundingClientRect();
      const x = pointerEvent.clientX - boundingRect.left;
      const y = pointerEvent.clientY - boundingRect.top;
      const point = {
        x: x,
        y: y,
        percentX: (x / boundingRect.width) * 100,
        percentY: (y / boundingRect.height) * 100,
      } as IPoint;
      return point;
    }
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100%">
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
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onBlur={handleBlur}
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
                  <DrawObject key={index} object={object} roughSVG={roughSVG} />
                );
              })}
            </svg>
          </Fade>
        </div>
      </Box>
      <Box flex="0 1 auto" py=".5rem">
        <Grid container spacing={1}>
          <Grid item>
            <IconButton
              color={drawingTool === ObjectType.Line ? "primary" : "default"}
              onClick={() => {
                setDrawingTool(ObjectType.Line);
              }}
            >
              <GestureIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              color={
                drawingTool === ObjectType.Rectangle ? "primary" : "default"
              }
              onClick={() => {
                setDrawingTool(ObjectType.Rectangle);
              }}
            >
              <CheckBoxOutlineBlankIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              color={drawingTool === ObjectType.Ellipse ? "primary" : "default"}
              onClick={() => {
                setDrawingTool(ObjectType.Ellipse);
              }}
            >
              <RadioButtonUncheckedIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
});

DrawArea.displayName = "DrawArea";

export const DrawObject: React.FC<{
  roughSVG: IRoughSVG | undefined;
  object: IObject;
}> = React.memo((props) => {
  const theme = useTheme();
  const [seed] = useState(() => Math.random() * 100);

  if (!props.roughSVG) {
    return null;
  }

  if (props.object.type === ObjectType.Rectangle) {
    const formData = props.roughSVG.rectangle(
      props.object.form.start.percentX,
      props.object.form.start.percentY,
      props.object.form.end.percentX - props.object.form.start.percentX,
      props.object.form.end.percentY - props.object.form.start.percentY,
      {
        strokeWidth: 0.8,
        roughness: 0.3,
        seed: seed,
        fill: theme.palette.primary.light,
        fillStyle: "solid",
      }
    );
    return <g dangerouslySetInnerHTML={{ __html: formData.innerHTML }} />;
  }
  if (props.object.type === ObjectType.Ellipse) {
    const formData = props.roughSVG.ellipse(
      (props.object.form.start.percentX + props.object.form.end.percentX) / 2,
      (props.object.form.start.percentY + props.object.form.end.percentY) / 2,
      props.object.form.end.percentX - props.object.form.start.percentX,
      props.object.form.end.percentY - props.object.form.start.percentY,
      {
        strokeWidth: 0.8,
        roughness: 0.3,
        seed: seed,
        fill: theme.palette.primary.light,
        fillStyle: "solid",
      }
    );
    return <g dangerouslySetInnerHTML={{ __html: formData.innerHTML }} />;
  }

  const line = props.roughSVG.linearPath(
    props.object.points.map((p) => [p.percentX, p.percentY]),
    {
      strokeWidth: 0.8,
      roughness: 0.3,
      seed: seed,
    }
  );

  return <g dangerouslySetInnerHTML={{ __html: line.innerHTML }} />;
});

DrawObject.displayName = "DrawObject";
