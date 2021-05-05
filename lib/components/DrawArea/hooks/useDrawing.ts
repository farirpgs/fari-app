import Konva from "konva";
import isEqual from "lodash/isEqual";
import { useEffect, useRef, useState } from "react";
import { DrawObjectFactory } from "../domains/DrawObjectFactory";
import { tokenColors } from "../domains/pickerColors";

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
  Line = "Line",
  Rectangle = "Rectangle",
  Ellipse = "Ellipse",
  Token = "Token",
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

const DEFAULT_STAGE_WIDTH = 800;

export function useDrawing(props: {
  objects?: IDrawAreaObjects;
  readonly?: boolean;
  onChange?(objects: IDrawAreaObjects): void;
}) {
  const [objects, setObjects] = useState<IDrawAreaObjects>([]);
  const [drawing, setDrawing] = useState(false);
  const [drawingTool, setDrawingTool] = useState(DrawingTool.Line);

  const [color, setColor] = useState("#000000");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const dragPoint = useRef<IPoint>();
  const [tokenIndex, setTokenIndex] = useState(0);
  const onChangeTimeout = useRef<any | undefined>(undefined);

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

  function onStartDrawing(konvaEvent: Konva.KonvaEventObject<MouseEvent>) {
    // if (pointerEvent.button !== 0 || props.readonly) {
    //   return;
    // }

    // pointerEvent.preventDefault();
    // pointerEvent.stopPropagation();

    // try {
    //   $container.current?.setPointerCapture(pointerEvent.pointerId);
    // } catch (error) {
    //   // ignore
    // }

    const stage = konvaEvent.target.getStage();
    if (!stage) {
      return;
    }
    const newPoint = getRelativePointerPosition(stage);
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

  function onDrawing(konvaEvent: Konva.KonvaEventObject<MouseEvent>) {
    const stage = konvaEvent.target.getStage();
    if (!drawing || !stage) {
      return;
    }

    // pointerEvent.preventDefault();
    // pointerEvent.stopPropagation();
    const newPoint = getRelativePointerPosition(stage);
    // const boundingRect = $container.current.getBoundingClientRect();
    // const x = pointerEvent.clientX - boundingRect.left;
    // const y = pointerEvent.clientY - boundingRect.top;
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

  /**
   * https://konvajs.org/docs/sandbox/Zooming_Relative_To_Pointer.html
   */
  function onWheel(konvaEvent: Konva.KonvaEventObject<WheelEvent>) {
    const scaleBy = 1.1;
    const stage = konvaEvent.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!stage || !pointer) {
      return;
    }
    konvaEvent.evt.preventDefault();
    const oldScale = stage.scaleX();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale =
      konvaEvent.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    console.debug("WEeeee", { oldScale, mousePointTo, newScale });

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  }

  function getRelativePointerPosition(node: any) {
    // the function will return pointer position relative to the passed node
    const transform = node.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();

    // get pointer (say mouse or touch) position
    const pos = node.getStage().getPointerPosition();

    // now we find a relative point
    return transform.point(pos);
  }

  function onStopDrawing(pointerEvent: Konva.KonvaEventObject<MouseEvent>) {
    // const validPointerTypes = ["mouse", "touch"];

    // if (validPointerTypes.includes(pointerEvent.pointerType)) {
    setDrawing(false);

    // try {
    // $container.current?.releasePointerCapture(pointerEvent.pointerId);
    // } catch (error) {
    // ignore
    // }
    // }
  }

  function onDragStart(
    objectIndex: number,
    konvaEvent: Konva.KonvaEventObject<MouseEvent>
  ) {
    dragPoint.current = getRelativePointerPosition(konvaEvent.target);
    // const x = pointerEvent.target.x;
    // const y = pointerEvent.target.y;
    // setObjects((objects) => {
    //   return objects.map((object, index) => {
    //     const shouldUpdate = index === objectIndex;
    //     if (!shouldUpdate) {
    //       return object;
    //     }
    //     switch (object.type) {
    //       case ObjectType.Rectangle: {
    //         return DrawObjectFactory.moveRectangle({
    //           object: object,
    //           x: diffX,
    //           y: diffY,
    //         });
    //       }
    //       case ObjectType.Ellipse: {
    //         return DrawObjectFactory.moveEllipse({
    //           object: object,
    //           x: diffX,
    //           y: diffY,
    //         });
    //       }
    //       case ObjectType.Token: {
    //         return DrawObjectFactory.moveToken({
    //           object: object,
    //           x: diffX,
    //           y: diffY,
    //         });
    //       }
    //       default: {
    //         return DrawObjectFactory.moveLine({
    //           object: object,
    //           x: diffX,
    //           y: diffY,
    //         });
    //       }
    //     }
    //   });
    // });
  }

  function onDragEnd(
    objectIndex: number,
    konvaEvent: Konva.KonvaEventObject<DragEvent>
  ) {
    const dropPoint = getRelativePointerPosition(konvaEvent.target);
    const diffX = dropPoint.x - dragPoint.current?.x;
    const diffY = dropPoint.y - dragPoint.current?.y;
    console.log("point move", { dragPoint, dropPoint });
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

  function onObjectMove(
    objectIndex: number,
    startEvent: PointerEvent,
    moveEvent: PointerEvent
  ) {
    return;
    // const startPoint = relativeCoordinatesForEvent(startEvent);
    // const movePoint = relativeCoordinatesForEvent(moveEvent);
    // const diffX = movePoint.x - startPoint.x;
    // const diffY = movePoint.y - startPoint.y;

    // setObjects((objects) => {
    //   return objects.map((object, index) => {
    //     const shouldUpdate = index === objectIndex;
    //     if (!shouldUpdate) {
    //       return object;
    //     }

    //     switch (object.type) {
    //       case ObjectType.Rectangle: {
    //         return DrawObjectFactory.moveRectangle({
    //           object: object,
    //           x: diffX,
    //           y: diffY,
    //         });
    //       }
    //       case ObjectType.Ellipse: {
    //         return DrawObjectFactory.moveEllipse({
    //           object: object,
    //           x: diffX,
    //           y: diffY,
    //         });
    //       }
    //       case ObjectType.Token: {
    //         return DrawObjectFactory.moveToken({
    //           object: object,
    //           x: diffX,
    //           y: diffY,
    //         });
    //       }
    //       default: {
    //         return DrawObjectFactory.moveLine({
    //           object: object,
    //           x: diffX,
    //           y: diffY,
    //         });
    //       }
    //     }
    //   });
    // });
  }

  function onObjectRemove(objectIndex: number) {
    setObjects((lines) => {
      return lines.filter((object, index) => {
        return index !== objectIndex;
      });
    });
  }

  // function relativeCoordinatesForEvent(
  //   pointerEvent: React.PointerEvent<unknown> | PointerEvent
  // ): IPoint {
  //   if ($container.current) {
  //     const boundingRect = $container.current.getBoundingClientRect();
  //     const x = pointerEvent.clientX - boundingRect.left;
  //     const y = pointerEvent.clientY - boundingRect.top;
  //     const point = {
  //       x: (x / boundingRect.width) * 100,
  //       y: (y / boundingRect.height) * 100,
  //     } as IPoint;
  //     return point;
  //   }
  //   return {
  //     x: 0,
  //     y: 0,
  //   };
  // }

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
      drawingTool,
      color,
      width,
      height,
    },
    actions: {
      clear,
      undo,
      setColor,
      setDrawingTool,
      setWidth,
      setHeight,
    },
    handlers: {
      onStartDrawing,
      onDrawing,
      onStopDrawing,
      onWheel,
      onObjectMove,
      onObjectRemove,
      onDragStart,
      onDragEnd,
    },
  };
}

export type IDrawingManager = ReturnType<typeof useDrawing>;
