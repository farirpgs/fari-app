import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "@material-ui/styles";
import React from "react";

export const DndItem: React.FC<{
  dndId: string;
  styleProps?: CSSProperties;
  render(renderProps: { attributes: any; listeners: any }): JSX.Element;
}> = (props) => {
  const { dndId, styleProps } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dndId });

  const newStyles = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? "100" : "auto",
    outline: "none",
    //cursor: "move",
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...(newStyles as any), ...styleProps }}
      // {...attributes}
      // {...listeners}
    >
      {props.render({ listeners, attributes })}
    </div>
  );
};
