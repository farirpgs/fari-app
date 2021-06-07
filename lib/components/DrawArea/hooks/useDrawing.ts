import isEqual from "lodash/isEqual";
import React, { useEffect, useRef, useState } from "react";
import { DrawObjectFactory } from "../domains/DrawObjectFactory";
import { tokenColors } from "../domains/pickerColors";
import { rough } from "../domains/rough";

export enum DrawingTool {
  ColorPicker,
  Line,
  Move,
  Remove,
  Rectangle,
  Ellipse,
  Token,
}

export enum ObjectType {
  Line,
  Rectangle,
  Ellipse,
  Token,
}

export type IDrawAreaObjects = Array<IObject>;

export type IObject =
  | ILineObject
  | ITokenObject
  | IRectangleObject
  | IEllipseObject;

export type ITokenObject = {
  type: ObjectType.Token;
  tokenIndex: number;
  color: string;
  point: IPoint;
};

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
  x: number;
  y: number;
};

export type IForm = {
  start: IPoint;
  end: IPoint;
};

const ON_CHANGE_DELAY = 500;

export function useDrawing(props: {
  objects?: IDrawAreaObjects;
  readonly?: boolean;
  onChange?(objects: IDrawAreaObjects): void;
}) {
  const [objects, setObjects] = useState<IDrawAreaObjects>([]);
  const [drawing, setDrawing] = useState(false);
  const [drawingTool, setDrawingTool] = useState(DrawingTool.Line);

  const [color, setColor] = useState("#000000");
  const [tokenIndex, setTokenIndex] = useState(0);
  const $container = useRef<HTMLDivElement | null>(null);
  const onChangeTimeout = useRef<any | undefined>(undefined);
  const roughSVG = useRef<ReturnType<typeof rough.svg> | undefined>(undefined);

  useEffect(() => {
    return () => {
      clearTimeout(onChangeTimeout.current);
    };
  }, []);

  useEffect(() => {
    const shouldUpdateLocalState =
      !!props.objects && !isEqual(props.objects, objects);

    if (shouldUpdateLocalState) {
      setObjects(props.objects as IDrawAreaObjects);
    }
  }, [props.objects]);

  useEffect(() => {
    changeWithDelay(objects);
  }, [objects]);

  function changeWithDelay(objects: IDrawAreaObjects) {
    clearTimeout(onChangeTimeout.current);
    onChangeTimeout.current = setTimeout(() => {
      props.onChange?.(objects);
    }, ON_CHANGE_DELAY);
  }

  function setSVG($newContainer: any, $newSVG: any) {
    $container.current = $newContainer;
    roughSVG.current = rough.svg($newSVG);
  }

  function onStartDrawing(pointerEvent: React.PointerEvent<HTMLDivElement>) {
    if (pointerEvent.button !== 0 || props.readonly) {
      return;
    }

    pointerEvent.preventDefault();
    pointerEvent.stopPropagation();

    try {
      $container.current?.setPointerCapture(pointerEvent.pointerId);
    } catch (error) {
      // ignore
    }

    const newPoint = relativeCoordinatesForEvent(pointerEvent);
    if (!newPoint) {
      return;
    }

    switch (drawingTool) {
      case DrawingTool.Rectangle: {
        setDrawing(true);
        setObjects((objects) => {
          return [
            ...objects,
            DrawObjectFactory.startRectangle({ color: color, point: newPoint }),
          ];
        });
        break;
      }
      case DrawingTool.Ellipse: {
        setDrawing(true);
        setObjects((objects) => {
          return [
            ...objects,
            DrawObjectFactory.startEllipse({ color: color, point: newPoint }),
          ];
        });
        break;
      }
      case DrawingTool.Token: {
        setDrawing(true);
        const numberOfColors = tokenColors.length;
        const newColorIndex = tokenIndex % numberOfColors;
        const tokenColor = tokenColors[newColorIndex];

        setTokenIndex((prevIndex) => {
          return prevIndex + 1;
        });
        setObjects((objects) => {
          return [
            ...objects,
            DrawObjectFactory.startToken({
              color: tokenColor,
              tokenIndex: tokenIndex,
              point: newPoint,
            }),
          ];
        });
        break;
      }
      case DrawingTool.Line: {
        setDrawing(true);
        setObjects((objects) => {
          return [
            ...objects,
            DrawObjectFactory.startLine({ color: color, point: newPoint }),
          ];
        });
        break;
      }
    }
  }

  function onDrawing(pointerEvent: React.PointerEvent<HTMLDivElement>) {
    if (!drawing) {
      return;
    }

    pointerEvent.preventDefault();
    pointerEvent.stopPropagation();

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
            case ObjectType.Line: {
              return {
                ...object,
                points: [...object.points, newPoint],
              };
            }
            default: {
              return object;
            }
          }
        });
      });
    }
  }

  function onStopDrawing(pointerEvent: React.PointerEvent<HTMLDivElement>) {
    const validPointerTypes = ["mouse", "touch"];

    if (validPointerTypes.includes(pointerEvent.pointerType)) {
      setDrawing(false);

      try {
        $container.current?.releasePointerCapture(pointerEvent.pointerId);
      } catch (error) {
        // ignore
      }
    }
  }

  function onObjectMove(
    objectIndex: number,
    startEvent: PointerEvent,
    moveEvent: PointerEvent
  ) {
    const startPoint = relativeCoordinatesForEvent(startEvent);
    const movePoint = relativeCoordinatesForEvent(moveEvent);
    const diffX = movePoint.x - startPoint.x;
    const diffY = movePoint.y - startPoint.y;

    setObjects((objects) => {
      return objects.map((object, index) => {
        const shouldUpdate = index === objectIndex;
        if (!shouldUpdate) {
          return object;
        }

        switch (object.type) {
          case ObjectType.Rectangle: {
            return DrawObjectFactory.moveRectangle({
              object: object,
              x: diffX,
              y: diffY,
            });
          }
          case ObjectType.Ellipse: {
            return DrawObjectFactory.moveEllipse({
              object: object,
              x: diffX,
              y: diffY,
            });
          }
          case ObjectType.Token: {
            return DrawObjectFactory.moveToken({
              object: object,
              x: diffX,
              y: diffY,
            });
          }
          default: {
            return DrawObjectFactory.moveLine({
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

  function onBlur() {
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
        x: (x / boundingRect.width) * 100,
        y: (y / boundingRect.height) * 100,
      } as IPoint;
      return point;
    }
    return {
      x: 0,
      y: 0,
    };
  }

  function clear() {
    setObjects([]);
    setTokenIndex(0);
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
      $container,
      roughSVG: roughSVG.current,
      drawingTool,
      color,
    },
    actions: {
      clear,
      undo,
      setSVG,
      setColor,
      setDrawingTool,
    },
    handlers: {
      onStartDrawing,
      onDrawing,
      onStopDrawing,
      onBlur,
      onObjectMove,
      onObjectRemove,
    },
  };
}

export type IDrawingManager = ReturnType<typeof useDrawing>;
