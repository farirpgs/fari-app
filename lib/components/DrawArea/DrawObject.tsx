import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useEffect, useRef, useState } from "react";
import { DrawObjectFactory } from "./domains/DrawObjectFactory";
import { IRoughSVG } from "./domains/rough";
import { DrawingTool, IObject, ObjectType } from "./hooks/useDrawing";
import { AllTokens } from "./tokens/tokens";

export const DrawObject: React.FC<{
  roughSVG: IRoughSVG | undefined | null;
  object: IObject;
  drawingTool: DrawingTool;
  title?: string;
  onMove: (startEvent: PointerEvent, event: PointerEvent) => void;
  onRemove: () => void;
}> = React.memo((props) => {
  type IStartEvent = PointerEvent | undefined;

  const theme = useTheme();

  const [seed] = useState(() => Math.random() * 100);
  const startEvent = useRef<IStartEvent>(undefined);
  const [moving, setMoving] = useState(false);
  const [hover, setHover] = useState(false);

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
  const [$tokenRef, $setTokenRef] = useState<SVGGElement | null>(null);

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
    onPointerEnter: () => {
      setHover(true);
    },
    onPointerLeave: () => {
      setHover(false);
    },
    onPointerDown: (event: React.PointerEvent<SVGGElement>) => {
      if (props.drawingTool === DrawingTool.Move) {
        event.stopPropagation();
        event.persist();
        startEvent.current = event.nativeEvent;
        setMoving(true);
      } else if (props.drawingTool === DrawingTool.Remove) {
        event.stopPropagation();
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
        props.object.form.start.x,
        props.object.form.start.y,
        props.object.form.end.x - props.object.form.start.x,
        props.object.form.end.y - props.object.form.start.y,
        {
          fill: fill,
          stroke: theme.palette.text.primary,
          strokeWidth: strokeWidth,
          roughness: roughness,
          seed: seed,
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
        (props.object.form.start.x + props.object.form.end.x) / 2,
        (props.object.form.start.y + props.object.form.end.y) / 2,
        props.object.form.end.x - props.object.form.start.x,
        props.object.form.end.y - props.object.form.start.y,
        {
          fill: fill,
          stroke: theme.palette.text.primary,
          strokeWidth: strokeWidth,
          roughness: roughness,
          seed: seed,
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
    case ObjectType.Token: {
      const numberOfTokens = AllTokens.length;
      const tokenIndex = props.object.tokenIndex % numberOfTokens;
      const Token = AllTokens[tokenIndex];
      const shouldRenderPopper = props.title && hover;

      const color =
        props.object.color === "#000000"
          ? theme.palette.text.primary
          : props.object.color;
      return (
        <g
          {...eventProps}
          ref={(ref) => {
            $setTokenRef(ref);
          }}
          color={color}
        >
          <Token
            width={DrawObjectFactory.TokenSize.width}
            height={DrawObjectFactory.TokenSize.height}
            x={props.object.point.x}
            y={props.object.point.y}
          />

          {shouldRenderPopper && (
            <Popper
              className={css({
                pointerEvents: "none",
                marginLeft: ".5rem",
                marginTop: "-2rem",
                zIndex: theme.zIndex.tooltip,
              })}
              open={true}
              anchorEl={$tokenRef}
              placement="right-start"
            >
              <Paper elevation={8}>
                <Box p=".5rem">
                  <Typography>{props.title}</Typography>
                </Box>
              </Paper>
            </Popper>
          )}
        </g>
      );
    }
    case ObjectType.Line: {
      const color =
        props.object.color === "#000000"
          ? theme.palette.text.primary
          : props.object.color;

      const line = props.roughSVG.linearPath(
        props.object.points.map((p) => [p.x, p.y]),
        {
          stroke: color,
          strokeWidth: strokeWidth,
          roughness: roughness,
          seed: seed,
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
