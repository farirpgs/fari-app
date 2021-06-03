import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import React, { useMemo } from "react";
import { IBlock } from "../../../../domains/character/types";
import { IIndexCard } from "../../../../hooks/useScene/IScene";

export const DndProvider: React.FC<{
  onMove: (oldIndex: number, newIndex: number) => void;
  items: Array<IIndexCard | IBlock>;
}> = (props) => {
  const { items, onMove } = props;
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = parseInt(active.id);
      const newIndex = parseInt(over.id);
      onMove(oldIndex, newIndex);
    }
  }

  const injectedIdsIntoItems = useMemo(() => {
    return items.map((c, index) => {
      return { ...c, id: index.toString() };
    });
  }, [items]);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={injectedIdsIntoItems}>
          {props.children}
        </SortableContext>
      </DndContext>
    </>
  );
};
