import { Fade, useTheme } from "@material-ui/core";
import GestureIcon from "@material-ui/icons/Gesture";
import { css } from "emotion";
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";

export type ILines = Array<ILine>;

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
  const $container = useRef<HTMLDivElement | null>(null);

  const handleScrolling = useCallback(() => {
    event?.preventDefault();

  }, []);

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
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  useEffect(() => {
    if (!isDrawing) {
      props.onChange?.(lines);
    }
  }, [isDrawing, lines, props.onChange]);

  useEffect(() => {
    if (isDrawing) {
      window.addEventListener("touchstart", handleScrolling, { 'passive': false });
    }
    else {
      window.removeEventListener("touchstart", handleScrolling);
    }
  }, [isDrawing]);

  function handlePointerDown(
    pointerEvent: React.PointerEvent<HTMLDivElement>
  ) {

    if (pointerEvent.button !== 0 || props.readonly) {
      return;
    }

    const newPoint = relativeCoordinatesForEvent(pointerEvent);
    if (newPoint) {
      setLines((lines) => {
        return [...lines, [newPoint]];
      });
      setDrawing(true);
    }
  }

  function handlePointerMove(
    pointerEvent: React.PointerEvent<HTMLDivElement>
  ) {
    if (!isDrawing) {
      return;
    }

    const newPoint = relativeCoordinatesForEvent(pointerEvent);
    if (newPoint) {
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
  }

  function handlePointerUp() {
    setDrawing(false);
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
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
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
          />
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
