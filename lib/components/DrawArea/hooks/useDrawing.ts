import React, { useEffect, useMemo, useRef, useState } from "react";
import { DrawObject } from "../domains/DrawObject";
import { rough } from "../domains/rough";

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

export type IDrawAreaObjects = Array<IObject>;

export type IObject = ILineObject | IRectangleObject | IEllipseObject;

export type ILineObject = {
  type: ObjectType.Line;
  color: string;
  points: Array<IPoint>;
};

export type IRectangleObject = {
  type: ObjectType.Rectangle;
  color: string;
  form: IForm;
};

export type IEllipseObject = {
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
  objects: IDrawAreaObjects;
  readonly: boolean;
  onChange(objects: IDrawAreaObjects): void;
}) {
  const [objects, setObjects] = useState<IDrawAreaObjects>([]);
  const [drawing, setDrawing] = useState(false);
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
    const shouldUpdateLocalState = props.objects.length !== objects.length;
    if (shouldUpdateLocalState) {
      setObjects(props.objects);
    }
  }, [props.objects]);

  useEffect(() => {
    changeWithDelay(objects);
  }, [objects]);

  function changeWithDelay(objects: IDrawAreaObjects) {
    clearTimeout(onChangeTimeout.current);
    onChangeTimeout.current = setTimeout(() => {
      props.onChange(objects);
    }, ON_CHANGE_DELAY);
  }

  function onPointerDown(pointerEvent: React.PointerEvent<HTMLDivElement>) {
    if (pointerEvent.button !== 0 || props.readonly) {
      return;
    }

    pointerEvent.preventDefault();
    pointerEvent.stopPropagation();

    const newPoint = relativeCoordinatesForEvent(pointerEvent);
    if (!newPoint) {
      return;
    }

    setDrawing(true);

    switch (drawingTool) {
      case DrawingTool.Rectangle: {
        setObjects((objects) => {
          return [
            ...objects,
            DrawObject.startRectangle({ color: color, point: newPoint }),
          ];
        });
        break;
      }
      case DrawingTool.Ellipse: {
        setObjects((objects) => {
          return [
            ...objects,
            DrawObject.startEllipse({ color: color, point: newPoint }),
          ];
        });
        break;
      }
      case DrawingTool.Line: {
        setObjects((objects) => {
          return [
            ...objects,
            DrawObject.startLine({ color: color, point: newPoint }),
          ];
        });
        break;
      }
    }
  }

  function onPointerMove(pointerEvent: React.PointerEvent<HTMLDivElement>) {
    if (!drawing) {
      return;
    }

    const newPoint = relativeCoordinatesForEvent(pointerEvent);
    if (newPoint) {
      setObjects((objects) => {
        const lastLineIndex = objects.length - 1;
        return objects.map((object, index) => {
          const shouldUpdate = index === lastLineIndex;
          if (!shouldUpdate) {
            return object;
          }

          switch (object.type) {
            case ObjectType.Rectangle: {
              return {
                ...object,
                form: {
                  start: object.form.start,
                  end: newPoint,
                },
              };
            }
            case ObjectType.Ellipse: {
              return {
                ...object,
                form: {
                  start: object.form.start,
                  end: newPoint,
                },
              };
            }
            default: {
              return {
                ...object,
                points: [...object.points, newPoint],
              };
            }
          }
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

    setObjects((objects) => {
      return objects.map((object, index) => {
        const shouldUpdate = index === objectIndex;
        if (!shouldUpdate) {
          return object;
        }

        switch (object.type) {
          case ObjectType.Rectangle: {
            return DrawObject.moveRectangle({
              object: object,
              x: diffX,
              y: diffY,
            });
          }
          case ObjectType.Ellipse: {
            return DrawObject.moveEllipse({
              object: object,
              x: diffX,
              y: diffY,
            });
          }
          default: {
            return DrawObject.moveLine({
              object: object,
              x: diffX,
              y: diffY,
            });
          }
        }
      });
    });
  }

  function onObjectRemove(objectIndex: number) {
    setObjects((lines) => {
      return lines.filter((object, index) => {
        return index !== objectIndex;
      });
    });
  }

  function onBlur(blurEvent: React.FocusEvent<HTMLDivElement>) {
    if (drawing) {
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
    setObjects([]);
  }

  function undo() {
    setObjects((objects) => {
      const lastElementIndex = objects.length - 1;
      const newObjects = objects.filter((object, index) => {
        return index !== lastElementIndex;
      });
      return newObjects;
    });
  }

  return {
    state: {
      objects: objects,
      isDrawing: drawing,
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
