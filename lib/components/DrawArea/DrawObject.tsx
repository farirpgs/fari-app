import { useTheme } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { IRoughSVG } from "./rough";
import { DrawingTool, IObject, ObjectType } from "./useDrawing";

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
  const [moving, setMoving] = useState(false);

  const movableCursor = moving ? "grabbing" : "grab";
  const cursor =
    props.drawingTool === DrawingTool.Move
      ? movableCursor
      : props.drawingTool === DrawingTool.Remove
      ? "pointer"
      : "inherit";
  const strokeWidth = 0.5;
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
    setMoving(false);
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
        setMoving(true);
      } else if (props.drawingTool === DrawingTool.Remove) {
        props.onRemove();
      }
    },
    onBlur: () => {
      startEvent.current = undefined;
    },
  };

  if (!props.roughSVG) {
    console.error("DrawObject.render: missing props.roughSVG");
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
