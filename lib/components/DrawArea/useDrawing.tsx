import React, { useEffect, useMemo, useRef, useState } from "react";
import { rough } from "./rough";

export enum DrawingTool {
  Line,
  Move,
  Remove,
  Rectangle,
  Ellipse,
}

export enum ObjectType {
  Line,
  Rectangle,
  Ellipse,
}

export type ILines = Array<IObject>;

export type IObject =
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

export type IPoint = {
  percentX: number;
  percentY: number;
};

export type IForm = {
  start: IPoint;
  end: IPoint;
};

const ON_CHANGE_DELAY = 500;

export function useDrawing(props: {
  lines: ILines;
  readonly: boolean;
  onChange(lines: ILines): void;
}) {
  const [lines, setLines] = useState<ILines>([]);
  const [isDrawing, setDrawing] = useState(false);
  const [drawingTool, setDrawingTool] = useState(DrawingTool.Line);

  const [colorPickerButton, setColorPickerButton] = useState<
    HTMLButtonElement | undefined
  >(undefined);

  const [color, setColor] = useState("#000000");
  const $container = useRef<HTMLDivElement | null>(null);
  const $svgElement = useRef<SVGSVGElement | null>(null);
  const onChangeTimeout = useRef<any | undefined>(undefined);

  const roughSVG = useMemo(() => {
    if ($svgElement.current) {
      return rough.svg($svgElement.current);
    }
  }, [$svgElement.current]);

  useEffect(() => {
    const shouldUpdateLocalState = props.lines.length !== lines.length;
    if (shouldUpdateLocalState) {
      setLines(props.lines);
    }
  }, [props.lines]);

  useEffect(() => {
    changeWithDelay(lines);
  }, [lines]);

  function changeWithDelay(lines: ILines) {
    clearTimeout(onChangeTimeout.current);
    onChangeTimeout.current = setTimeout(() => {
      props.onChange(lines);
      console.log("onChange: Local", lines.length);
    }, ON_CHANGE_DELAY);
  }

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

  function clear() {
    setLines([]);
  }

  function undo() {
    setLines((draft) => {
      const lastElementIndex = draft.length - 1;
      const newLines = draft.filter((line, index) => {
        return index !== lastElementIndex;
      });
      return newLines;
    });
  }

  return {
    state: {
      lines,
      isDrawing,
      colorPickerButton,
      $container,
      $svgElement,
      roughSVG,
      drawingTool,
      color,
    },
    actions: {
      clear,
      undo,
      setColor,
      setColorPickerButton,
      setDrawingTool,
    },
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onBlur,
      onObjectMove,
      onObjectRemove,
    },
  };
}
