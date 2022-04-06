import { css, cx } from "@emotion/css";
import { useTheme } from "@mui/material/styles";
import React, { useRef, useState } from "react";
import { ConnectDragSource, useDrag, useDrop } from "react-dnd";

type IItem = {
  id: string;
};
export const BetterDnd: React.FC<{
  /**
   * Unique key to know where blocks can be dropped
   */
  type: string;
  id: string;
  className?: string;
  render(renderProps: {
    drag: ConnectDragSource;
    isDragging: boolean;
    isOver: boolean;
  }): JSX.Element;
  onDrag?(): void;
  onDrop?(): void;
  direction: "horizontal" | "vertical";
  onMove?(dragId: string, hoverId: string): void;
}> = (props) => {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [{ isDragging }, drag, preview] = useDrag({
    type: props.type,
    item: () => {
      props.onDrag?.();
      return {
        id: props.id,
      };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<IItem>({
    accept: props.type,
    drop: () => {
      props.onDrop?.();
    },
    hover(item: IItem) {
      if (!ref.current) {
        return;
      }
      const dragId = item.id;
      const hoverId = props.id;

      // Don't replace items with themselves
      if (dragId === hoverId) {
        return;
      }

      props.onMove?.(dragId, hoverId);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  preview(drop(ref));

  return (
    <div
      ref={ref}
      className={cx(
        css({
          opacity: isDragging ? 0.2 : 1,
          boxShadow: isDragging
            ? `0 0 3pt 2pt ${theme.palette.primary.main}`
            : undefined,
          position: "relative",
        }),
        props.className
      )}
      onPointerEnter={() => {
        setHover(true);
      }}
      onPointerLeave={() => {
        setHover(false);
      }}
    >
      {props.render({ drag, isDragging, isOver: hover })}
    </div>
  );
};
