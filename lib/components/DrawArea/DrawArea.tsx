import { Fade, useTheme } from "@material-ui/core";
import GestureIcon from "@material-ui/icons/Gesture";
import { css } from "emotion";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";

export type ILines = Array<ILine>;

interface IProps {
  lines?: ILines;
  readonly?: boolean;
  onChange?(lines: ILines): void;
}

interface IHandles {
  clear(): void;
}

export type IDrawAreaHandles = IHandles;

export const DrawArea = React.forwardRef<IHandles, IProps>((props, ref) => {
  const theme = useTheme();
  const textColors = useTextColors(theme.palette.background.paper);

  const [lines, setLines] = useState<ILines>([]);
  const [isDrawing, setDrawing] = useState(false);
  const $container = useRef<HTMLDivElement>(undefined);

  // useEffect(() => {
  //   if (props.lines && props.readonly) {
  //     setLines(props.lines);
  //   }
  // }, [props.lines, props.readonly]);

  useImperativeHandle(ref, () => {
    return {
      clear() {
        setLines([]);
      },
    };
  });

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (!isDrawing) {
      props.onChange?.(lines);
    }
  }, [isDrawing]);

  function handleMouseDown(
    mouseEvent: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (mouseEvent.button !== 0 || props.readonly) {
      return;
    }

    const newPoint = relativeCoordinatesForEvent(mouseEvent);
    setLines((lines) => {
      return [...lines, [newPoint]];
    });
    setDrawing(true);
  }

  function handleMouseMove(
    mouseEvent: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (!isDrawing) {
      return;
    }

    const newPoint = relativeCoordinatesForEvent(mouseEvent);
    setLines((lines) => {
      const lastLineIndex = lines.length - 1;
      return lines.map((line, index) => {
        if (index !== lastLineIndex) {
          return line;
        }
        const updatedLine = [...line, newPoint];
        return updatedLine;
      });
    });
  }

  function handleDoubleClick() {
    setLines([]);
  }

  function handleMouseUp() {
    setDrawing(false);
  }

  function relativeCoordinatesForEvent(
    mouseEvent: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): IPoint {
    const boundingRect = $container.current.getBoundingClientRect();
    const x = mouseEvent.clientX - boundingRect.left;
    const y = mouseEvent.clientY - boundingRect.top;
    const point = {
      x: x,
      y: y,
      percentX: (x / boundingRect.width) * 100,
      percentY: (y / boundingRect.height) * 100,
    } as IPoint;
    return point;
  }

  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        cursor: props.readonly ? "inherit" : "crosshair",
      })}
      ref={$container}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onDoubleClick={handleDoubleClick}
    >
      {lines.length === 0 ? (
        <Fade in>
          <GestureIcon
            classes={{
              root: css({
                width: "7rem",
                height: "7rem",
              }),
            }}
            htmlColor={textColors.disabled}
          ></GestureIcon>
        </Fade>
      ) : (
        <Fade in>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className={css({
              "& path": {
                fill: "none",
                strokeWidth: "5px",
                stroke: textColors.secondary,
                strokeLinejoin: "round",
                strokeLinecap: "round",
              },
            })}
          >
            {lines.map((line, index) => (
              <DrawingLine key={index} line={line} />
            ))}
          </svg>
        </Fade>
      )}
    </div>
  );
});

DrawArea.displayName = "DrawArea";

export const DrawingLine: React.FC<{ line: ILine }> = (props) => {
  const lineData = props.line
    .map((p) => {
      return `${p.percentX} ${p.percentY}`;
    })
    .join(" L ");
  const pathData = `M ${lineData}`;
  return <path d={pathData} vectorEffect="non-scaling-stroke" />;
};

DrawingLine.displayName = "DrawingLine";

type ILine = Array<IPoint>;

type IPoint = {
  x: number;
  y: number;
  percentX: number;
  percentY: number;
};
